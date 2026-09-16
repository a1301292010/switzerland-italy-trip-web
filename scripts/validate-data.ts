import { readFileSync } from "node:fs";
import { dayMapPoints } from "../data/map-points.ts";
import { TRIP_END, TRIP_START } from "../data/trip-startup.ts";
import {
  documents,
  ticketPresentation,
} from "../data/documents.ts";

const content = JSON.parse(
  readFileSync(new URL("../data/trip-content.json", import.meta.url), "utf8"),
);
const trip = JSON.parse(
  readFileSync(new URL("../data/trip.json", import.meta.url), "utf8"),
);
const errors: string[] = [];
const fail = (message: string) => errors.push(message);

const documentIds = new Set<string>();
for (const document of documents) {
  if (documentIds.has(document.id)) fail(`duplicate credential document id ${document.id}`);
  documentIds.add(document.id);
  if (!document.titleZh.trim() || !document.titleEn.trim())
    fail(`credential document ${document.id} is missing bilingual titles`);
  if (document.storage.kind === "signed" && !document.storage.endpoint.startsWith("/api/"))
    fail(`credential document ${document.id} must use a same-origin signed endpoint`);
  const serializedDocument = JSON.stringify(document);
  if (/public\/|public\\|file:\/\/|[A-Z]:\\/i.test(serializedDocument))
    fail(`credential document ${document.id} exposes a public or local file path`);
}
for (const [ticketName, presentation] of Object.entries(ticketPresentation)) {
  if (!content.tickets.some((ticket: any) => ticket.name === ticketName))
    fail(`credential presentation references unknown ticket ${ticketName}`);
  for (const id of presentation.documentIds) {
    if (!documentIds.has(id)) fail(`${ticketName} references unknown credential ${id}`);
  }
}

const daysByIso = new Map(content.days.map((day: any) => [day.iso, day]));
for (const [iso, points] of Object.entries(dayMapPoints)) {
  const day: any = daysByIso.get(iso);
  if (!day) {
    fail(`dayMapPoints contains unknown day ${iso}`);
    continue;
  }
  const orders = new Set<number>();
  let previousOrder = -Infinity;
  for (const point of points) {
    const legalEvent =
      Number.isInteger(point.eventIndex) &&
      point.eventIndex >= 0 &&
      point.eventIndex < day.events.length;
    if (!legalEvent)
      fail(`${iso} point ${point.id} has invalid eventIndex ${point.eventIndex}`);
    if (!point.nameZh?.trim() || !point.nameEn?.trim())
      fail(`${iso} point ${point.id} is missing nameZh or nameEn`);
    if (orders.has(point.order))
      fail(`${iso} has duplicate map order ${point.order}`);
    if (point.order <= previousOrder)
      fail(`${iso} map order is not strictly increasing at ${point.id}`);
    if ((point.todayPriority || 0) > 0 && !legalEvent)
      fail(`${iso} priority point ${point.id} does not belong to a legal event`);
    orders.add(point.order);
    previousOrder = point.order;
  }
}

const purchasedLedger: Record<string, { confirmed: string; budget: string }> = {
  "Vatican Museums – Admission Ticket": {
    confirmed: "vaticanMuseums",
    budget: "Vatican Museums",
  },
  "Milan Duomo Rooftop + Cathedral": {
    confirmed: "milanDuomo",
    budget: "Milan Duomo",
  },
  "St Mark's Basilica": {
    confirmed: "stMarksBasilica",
    budget: "St Mark Basilica",
  },
  "Doge's Palace": { confirmed: "dogesPalace", budget: "Doge Palace" },
  "Venezia S. Lucia→Firenze SMN": {
    confirmed: "veniceToFlorence",
    budget: "Venice→Florence高铁",
  },
  "Firenze SMN→Roma Termini": {
    confirmed: "florenceToRome",
    budget: "Florence→Rome高铁",
  },
  "Milano Centrale→Venezia S. Lucia": {
    confirmed: "milanToVenice",
    budget: "Milan→Venice高铁",
  },
  "Swiss Travel Pass 4日二等": {
    confirmed: "swissTravelPass",
    budget: "Swiss Travel Pass 4日",
  },
  境外旅行保险: { confirmed: "insurance", budget: "旅行保险" },
};

for (const ticket of content.tickets.filter((item: any) =>
  /已购|已付/.test(item.status),
)) {
  const ledger = purchasedLedger[ticket.name];
  if (!ledger) {
    fail(`purchased ticket ${ticket.name} is missing from the consistency ledger`);
    continue;
  }
  const confirmed = content.confirmed[ledger.confirmed];
  const budget = content.budget.find((item: any) => item.name === ledger.budget);
  if (!/已购|purchased/.test(String(confirmed || "")))
    fail(`${ticket.name} is purchased in tickets but not confirmed`);
  if (!/已付/.test(ticket.status))
    fail(`${ticket.name} is purchased but tickets does not say 已付`);
  if (!budget || budget.payment !== "已付")
    fail(`${ticket.name} is purchased but budget payment is not 已付`);
}

if (trip.dates.start !== TRIP_START || trip.dates.end !== TRIP_END)
  fail(`trip.json dates must be ${TRIP_START} through ${TRIP_END}`);
if (content.days[0]?.iso !== TRIP_START || content.days.at(-1)?.iso !== TRIP_END)
  fail(`trip-content day range must be ${TRIP_START} through ${TRIP_END}`);
if (content.meta.subtitle !== "2026年9月27日—10月5日")
  fail("trip-content meta subtitle has a stale trip date range");
const serialized = JSON.stringify(content);
if (/2026-10-07|10月7日|10\/7/.test(serialized))
  fail("trip-content contains a stale 2026-10-07 reference");

if (errors.length) {
  console.error(`Data consistency validation failed (${errors.length}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log("Data consistency validation passed.");
