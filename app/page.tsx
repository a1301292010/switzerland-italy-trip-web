"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import content from "../data/trip-content.json";
import TripMap from "./TripMap";
import {
  dayMapPoints,
  tripOverview,
  type TripMapPoint,
} from "../data/map-points";

type Event = {
  time: string;
  area: string;
  title: string;
  description: string;
  map: string;
  transport: string;
  duration: string;
  cost: string;
  booking: string;
  photo: string;
  food: string;
  luggage: string;
  clothes: string;
  planB: string;
  safety: string;
};
type Day = {
  iso: string;
  shortDate: string;
  weekday: string;
  title: string;
  city: string;
  day: number;
  route: string;
  hardTime: string;
  weather: string;
  budget: string;
  food: string;
  luggage: string;
  clothes: string;
  planB: string;
  events: Event[];
};
type Vlog = (typeof content.vlog)[number];
type Tab = "today" | "days" | "map" | "tickets" | "budget" | "vlog";
type IconName =
  | "today"
  | "days"
  | "ticket"
  | "budget"
  | "vlog"
  | "train"
  | "walk"
  | "food"
  | "place"
  | "camera"
  | "map"
  | "chevron"
  | "hotel";

const days = content.days as Day[];

const themes = [
  {
    match: "Interlaken",
    key: "interlaken",
    flag: "🇨🇭",
    code: "INT",
    coord: "46.6863° N · 7.8632° E",
  },
  {
    match: "Lauterbrunnen",
    key: "lauterbrunnen",
    flag: "🇨🇭",
    code: "LBR",
    coord: "46.5935° N · 7.9091° E",
  },
  {
    match: "Zermatt",
    key: "zermatt",
    flag: "🇨🇭",
    code: "ZMT",
    coord: "46.0207° N · 7.7491° E",
  },
  {
    match: "米兰",
    key: "milan",
    flag: "🇮🇹",
    code: "MIL",
    coord: "45.4642° N · 9.1900° E",
  },
  {
    match: "威尼斯",
    key: "venice",
    flag: "🇮🇹",
    code: "VCE",
    coord: "45.4408° N · 12.3155° E",
  },
  {
    match: "佛罗伦萨",
    key: "florence",
    flag: "🇮🇹",
    code: "FLR",
    coord: "43.7696° N · 11.2558° E",
  },
  {
    match: "罗马",
    key: "rome",
    flag: "🇮🇹",
    code: "ROM",
    coord: "41.9028° N · 12.4964° E",
  },
];

function CityArt({ kind }: { kind: string }) {
  if (kind === "milan")
    return (
      <svg
        className="hero-landscape city-art"
        viewBox="0 0 560 230"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M80 202h400M145 202v-67h46v67m178 0v-67h46v67M205 202V91h150v111M230 91l15-35 13 35m44 0 13-35 15 35M275 91V39l5-18 5 18v52M220 127h120M247 202v-51h66v51" />
        <path className="route-line" d="M55 211h450" />
      </svg>
    );
  if (kind === "venice")
    return (
      <svg
        className="hero-landscape city-art"
        viewBox="0 0 560 230"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M55 174h450M108 174c42-85 100-85 142 0m0 0c42-85 100-85 142 0M80 196c85-13 132 13 210 0s132 13 205 0M92 211c72-11 120 11 186 0s126 11 196 0" />
        <path d="M248 174v-73h64v73m-50-73V72h36v29m-18-29V45" />
      </svg>
    );
  if (kind === "florence")
    return (
      <svg
        className="hero-landscape city-art"
        viewBox="0 0 560 230"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M55 205h450M165 205v-73h58v73m114 0v-73h58v73M218 205v-76c0-63 124-63 124 0v76M235 112c16-58 74-58 90 0M280 68V35M268 46h24M247 205v-58h66v58" />
      </svg>
    );
  if (kind === "rome")
    return (
      <svg
        className="hero-landscape city-art"
        viewBox="0 0 560 230"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M70 202h420M112 202v-94c0-22 336-22 336 0v94M112 126h336M112 157h336M141 126v-21m47 21v-25m47 25V98m47 28V97m47 29V99m47 27v-23m47 23v-18" />
        {[145, 200, 255, 310, 365, 420].map((x) => (
          <path key={x} d={`M${x - 13} 202v-24c0-22 26-22 26 0v24`} />
        ))}
      </svg>
    );
  if (kind === "zermatt")
    return (
      <svg
        className="hero-landscape city-art"
        viewBox="0 0 560 230"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path d="M20 205 150 159l52 20L304 30l38 87 32-19 166 107M304 30l-20 81 41-32 17 38M190 182l45-40 27 25" />
        <path className="route-line" d="M54 211 C180 180 260 215 505 186" />
      </svg>
    );
  return (
    <svg
      className="hero-landscape city-art"
      viewBox="0 0 560 230"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0 190 80 105l61 57 64-95 86 113 69-84 83 72 117-80v142H0Z"
        className="mountain-back"
      />
      <path
        d="M0 207 102 148l57 42 73-75 86 93 70-61 69 52 103-29v60H0Z"
        className="mountain-front"
      />
      <path
        className="route-line"
        d="M42 194 C128 116 188 207 274 139 S420 104 518 166"
      />
      <circle cx="42" cy="194" r="4" />
      <circle cx="274" cy="139" r="4" />
      <circle cx="518" cy="166" r="4" />
    </svg>
  );
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    today: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v4l3 2" />
      </>
    ),
    days: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M4 10h16" />
      </>
    ),
    ticket: (
      <>
        <path d="M4 7a2 2 0 0 0 2-2h12a2 2 0 0 0 2 2v2a3 3 0 0 0 0 6v2a2 2 0 0 0-2 2H6a2 2 0 0 0-2-2v-2a3 3 0 0 0 0-6Z" />
        <path d="M12 7v2M12 15v2" />
      </>
    ),
    budget: (
      <>
        <rect x="3" y="6" width="18" height="13" rx="3" />
        <path d="M16 12h5M7 6V4h10" />
      </>
    ),
    vlog: (
      <>
        <rect x="3" y="6" width="14" height="12" rx="2" />
        <path d="m17 10 4-2v8l-4-2Z" />
      </>
    ),
    train: (
      <>
        <rect x="5" y="3" width="14" height="15" rx="4" />
        <path d="M8 21l2-3M16 18l2 3M8 8h8M8 13h.01M16 13h.01" />
      </>
    ),
    walk: (
      <>
        <circle cx="12" cy="4" r="2" />
        <path d="m10 22 1-7-3-3 2-5 4 3 3 1M14 22l-3-7" />
      </>
    ),
    hotel: (
      <>
        <path d="M4 20V5h16v15M8 9h2M14 9h2M8 13h2M14 13h2M9 20v-3h6v3" />
      </>
    ),
    food: (
      <>
        <path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M16 3v18M16 3c4 2 4 8 0 10" />
      </>
    ),
    place: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    camera: (
      <>
        <path d="M5 7h3l2-2h4l2 2h3a2 2 0 0 1 2 2v9H3V9a2 2 0 0 1 2-2Z" />
        <circle cx="12" cy="13" r="3" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3Z" />
        <path d="M9 3v15M15 6v15" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
  };
  return (
    <svg
      className="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}

function openMap(query: string) {
  if (query)
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      "_blank",
      "noopener,noreferrer",
    );
}
function eventKind(e: Event): IconName {
  const s = `${e.title}${e.area}${e.transport}${e.food}${e.photo}`;
  if (/入住|酒店|民宿|住宿|BASE/i.test(s)) return "hotel";
  if (/餐|吃|午餐|晚餐|咖啡|补给|Coop/i.test(s)) return "food";
  if (/拍|Vlog|口播|镜头/i.test(s)) return "camera";
  if (/火车|列车|SBB|车站|机场|航班|船|巴士|交通|出发|抵达|高铁/i.test(s))
    return "train";
  if (/步行|徒步|逛|散步/i.test(s)) return "walk";
  return "place";
}
function statusPills(e: Event) {
  const out: string[] = [];
  const s = `${e.booking} ${e.cost} ${e.planB} ${e.safety}`;
  if (/已购|已付/.test(s)) out.push("已购");
  if (/免费|CHF0|€0/.test(s)) out.push("免费");
  if (/预约|提前|必须/.test(s)) out.push("需预约");
  if (/天气|雨|风|取消|关闭/.test(s)) out.push("天气敏感");
  if (/Plan B|雨天|替代/.test(s)) out.push("雨天替代");
  return [...new Set(out)].slice(0, 3);
}
function cleanNode(s: string) {
  return s.replace(/\([^)]*\)|（[^）]*）/g, "").trim();
}
function routeNodes(day: Day) {
  const raw = day.route
    .split(/→|➜|—|\+|\/|｜/)
    .map(cleanNode)
    .filter(Boolean);
  return raw.slice(0, 6);
}
function matchVlog(e: Event): Vlog | undefined {
  const hay = `${e.title} ${e.area} ${e.map}`.toLowerCase();
  return content.vlog.find((v) => {
    const loc = v.location.toLowerCase();
    return (
      loc.length > 1 &&
      (hay.includes(loc) ||
        loc.includes(e.area.toLowerCase()) ||
        hay.includes(loc.split(/[（(·]/)[0]))
    );
  });
}
function money(currency: string, value: string) {
  const n = Number(value);
  if (!Number.isFinite(n)) return `${currency} ${value}`;
  const symbol =
    currency === "CNY"
      ? "¥"
      : currency === "EUR"
        ? "€"
        : currency === "CHF"
          ? "CHF "
          : `${currency} `;
  return `${symbol}${n.toLocaleString("zh-CN", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
}
function budgetCategory(name: string) {
  if (/酒店|住宿/.test(name)) return "住宿";
  if (
    /票|Pass|Duomo|Basilica|Palace|Museum|Colosseo|跳伞|观景|缆车/i.test(name)
  )
    return "门票";
  if (/餐|吃|咖啡|补给/.test(name)) return "餐饮";
  if (/备用|应急|机动/.test(name)) return "备用金";
  return "交通";
}
function ticketTone(name: string) {
  if (/skydive|跳伞/i.test(name)) return "sky";
  if (/Duomo|Milan/i.test(name)) return "milan";
  if (/Venez|Mark|Doge/i.test(name)) return "venice";
  if (/Train|→|Pass|rail|Firenze|Roma/i.test(name)) return "rail";
  return "stone";
}
function railLink(e: Event) {
  const s = `${e.title}${e.transport}`;
  if (/Italo/i.test(s)) return ["Italo", "https://www.italotreno.com/"];
  if (/Trenitalia|FR\d/i.test(s))
    return ["Trenitalia", "https://www.trenitalia.com/"];
  return ["SBB", "https://www.sbb.ch/en"];
}
async function copyText(text: string) {
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    el.remove();
  }
}
function zurichNow(at = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Zurich",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}
function initialDay() {
  const i = days.findIndex((d) => d.iso === zurichNow().date);
  return i >= 0 ? i : 0;
}
function eventTimes(time: string) {
  const matches = [...time.matchAll(/(\d{1,2}):(\d{2})/g)].map(
    (m) => Number(m[1]) * 60 + Number(m[2]),
  );
  return {
    start: matches[0] ?? Number.MAX_SAFE_INTEGER,
    end: matches[1] ?? null,
  };
}
type LivePhase = {
  kind: "before" | "active" | "gap" | "finished";
  nowIndex: number | null;
  nextIndex: number | null;
  label: string;
};
function livePhase(events: Event[], minutes: number): LivePhase {
  const spans = events
    .map((e, i) => {
      const t = eventTimes(e.time);
      const next =
        i < events.length - 1 ? eventTimes(events[i + 1].time).start : null;
      return {
        start: t.start,
        end: t.end ?? (next !== null && next > t.start ? next : t.start + 45),
      };
    })
    .filter((t) => Number.isFinite(t.start));
  if (!spans.length)
    return {
      kind: "finished",
      nowIndex: null,
      nextIndex: null,
      label: "今日无定时项目",
    };
  if (minutes < spans[0].start)
    return {
      kind: "before",
      nowIndex: null,
      nextIndex: 0,
      label: `距第一项 ${formatDelta(spans[0].start - minutes)}`,
    };
  for (let i = 0; i < spans.length; i++) {
    if (minutes >= spans[i].start && minutes < spans[i].end)
      return {
        kind: "active",
        nowIndex: i,
        nextIndex: i + 1 < spans.length ? i + 1 : null,
        label: "进行中",
      };
    if (
      i + 1 < spans.length &&
      minutes >= spans[i].end &&
      minutes < spans[i + 1].start
    )
      return {
        kind: "gap",
        nowIndex: null,
        nextIndex: i + 1,
        label: `间隙 · ${formatDelta(spans[i + 1].start - minutes)}后`,
      };
  }
  return {
    kind: "finished",
    nowIndex: null,
    nextIndex: null,
    label: "今日完成",
  };
}
function formatDelta(minutes: number) {
  const h = Math.floor(minutes / 60),
    m = minutes % 60;
  return h ? `${h}h${m ? `${m}m` : ""}` : `${m}m`;
}
function dayDistance(from: string, to: string) {
  return Math.ceil(
    (Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) /
      86400000,
  );
}
type LocalState = "done" | "shot" | "skip";
function Status({ value }: { value: string }) {
  const kind = /已购|已付/.test(value)
    ? "done"
    : /待确认|待定/.test(value)
      ? "check"
      : "pending";
  return <span className={`status ${kind}`}>{value}</span>;
}

export default function Home() {
  const [dayIndex, setDayIndex] = useState(initialDay),
    [tab, setTab] = useState<Tab>("today"),
    [vlogOpen, setVlogOpen] = useState(0);
  const [spotVlog, setSpotVlog] = useState<Vlog | null>(null);
  const [prompter, setPrompter] = useState<{
    title: string;
    short: string;
    long: string;
    mode: "short" | "long";
  } | null>(null);
  const [eventStates, setEventStates] = useState<Record<string, LocalState>>(
    {},
  );
  const [clock, setClock] = useState(() => new Date());
  const [restored, setRestored] = useState(false);
  const [ticketFilter, setTicketFilter] = useState<
    "all" | "buy" | "check" | "done"
  >("all");
  const [prepOpen, setPrepOpen] = useState(false),
    [prepChecks, setPrepChecks] = useState<Record<string, boolean>>({});
  const [mapDayIso, setMapDayIso] = useState<string | null>(null),
    [activeMapId, setActiveMapId] = useState<string | null>(null),
    [mapSheetPoint, setMapSheetPoint] = useState<TripMapPoint | null>(null);
  const day = days[dayIndex];
  const theme =
    themes.find(
      (t) => day.city.includes(t.match) || day.title.includes(t.match),
    ) || themes[dayIndex < 4 ? 0 : 3];
  const dayTickets = useMemo(
    () =>
      content.tickets.filter(
        (t) => t.date === day.shortDate || t.date.includes(day.shortDate),
      ),
    [day.shortDate],
  );
  const nav: [Tab, string, IconName][] = [
    ["today", "今日", "today"],
    ["days", "行程", "days"],
    ["map", "地图", "map"],
    ["tickets", "票务", "ticket"],
    ["budget", "预算", "budget"],
    ["vlog", "Vlog", "vlog"],
  ];
  const categoryTotals = useMemo(() => {
    const rates: Record<string, number> = { CNY: 1, CHF: 9, EUR: 8.4 };
    const sums: Record<string, number> = {
      交通: 0,
      住宿: 0,
      门票: 0,
      餐饮: 0,
      备用金: 0,
    };
    content.budget.forEach(
      (b) =>
        (sums[budgetCategory(b.name)] +=
          (Number(b.high) || 0) * (rates[b.currency] || 1)),
    );
    const total = Object.values(sums).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(sums).map(([name, value]) => ({
      name,
      value,
      pct: Math.round((value / total) * 100),
    }));
  }, []);
  const localNow = zurichNow(clock);
  const isTravelDay = days.some((d) => d.iso === localNow.date);
  const phase =
    isTravelDay && day.iso === localNow.date
      ? livePhase(day.events, localNow.minutes)
      : null;
  const preTrip = localNow.date < days[0].iso;
  const ticketGroups = {
    buy: content.tickets.filter((t) => /待买|未购|未付/.test(t.status)),
    check: content.tickets.filter((t) => /待确认|待定|核/.test(t.status)),
    done: content.tickets.filter((t) => /已购|已付/.test(t.status)),
  };
  const shownTickets =
    ticketFilter === "all" ? content.tickets : ticketGroups[ticketFilter];
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    try {
      setEventStates(
        JSON.parse(localStorage.getItem("trip-execution-v1") || "{}"),
      );
      setPrepChecks(JSON.parse(localStorage.getItem("trip-prep-v1") || "{}"));
      const ui = JSON.parse(localStorage.getItem("trip-ui-v1") || "{}");
      if (
        Number.isInteger(ui.dayIndex) &&
        ui.dayIndex >= 0 &&
        ui.dayIndex < days.length
      )
        setDayIndex(ui.dayIndex);
      if (
        ["today", "days", "map", "tickets", "budget", "vlog"].includes(ui.tab)
      )
        setTab(ui.tab);
      if (Number.isInteger(ui.vlogOpen)) setVlogOpen(ui.vlogOpen);
      setTimeout(() => scrollTo(0, Number(ui.scrollY) || 0), 80);
    } catch {}
    setRestored(true);
    if ("serviceWorker" in navigator)
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          const urls = [
            "/",
            "/manifest.webmanifest",
            ...performance
              .getEntriesByType("resource")
              .map((e) => (e as PerformanceResourceTiming).name)
              .filter((u) => u.startsWith(location.origin)),
          ];
          reg.active?.postMessage({ type: "CACHE_URLS", urls });
        })
        .catch(() => {});
  }, []);
  useEffect(() => {
    if (!restored) return;
    const save = () =>
      localStorage.setItem(
        "trip-ui-v1",
        JSON.stringify({ dayIndex, tab, vlogOpen, scrollY: scrollY }),
      );
    save();
    addEventListener("beforeunload", save);
    return () => removeEventListener("beforeunload", save);
  }, [dayIndex, tab, vlogOpen, restored]);
  function setExecution(index: number, state: LocalState) {
    const key = `${day.iso}:${index}`;
    const next = { ...eventStates, [key]: state };
    setEventStates(next);
    localStorage.setItem("trip-execution-v1", JSON.stringify(next));
  }
  function togglePrep(key: string) {
    const next = { ...prepChecks, [key]: !prepChecks[key] };
    setPrepChecks(next);
    localStorage.setItem("trip-prep-v1", JSON.stringify(next));
  }
  return (
    <main className={`app-shell theme-${theme.key} tab-${tab}`}>
      {tab === "today" && (
        <>
          <section className="hero-card">
            <CityArt kind={theme.key} />
            <div className="hero-content">
              <div className="hero-top">
                <div>
                  <p className="day-kicker">
                    {theme.flag} DAY {day.day} / {days.length} · {day.shortDate}{" "}
                    {day.weekday}
                  </p>
                  <h2>{day.title}</h2>
                  <p className="hero-city">
                    {theme.code} · {day.city}
                  </p>
                </div>
                {preTrip && (
                  <button
                    className="prep-entry"
                    onClick={() => setPrepOpen(true)}
                  >
                    准备 ·{" "}
                    {prepItems.length -
                      prepItems.filter(([key]) => prepChecks[key]).length}
                  </button>
                )}
              </div>
              <div className="hero-journey">
                {routeNodes(day).slice(0, 3).join(" → ")}
              </div>
              <div className="hero-foot">
                <span>
                  {day.weather} ·{" "}
                  {dayDistance(localNow.date, day.iso) > 7
                    ? "规划参考 · T−7 开启实时天气"
                    : "实时天气可用"}
                </span>
                <span>{day.budget}</span>
              </div>
            </div>
          </section>
          <div className="day-strip" aria-label="旅行进度">
            {days.map((d, i) => {
              const th =
                themes.find(
                  (t) => d.city.includes(t.match) || d.title.includes(t.match),
                ) || themes[i < 4 ? 0 : 3];
              return (
                <button
                  key={d.iso}
                  className={i === dayIndex ? "active" : ""}
                  onClick={() => setDayIndex(i)}
                >
                  <small>
                    {th.flag} DAY {i + 1}
                  </small>
                  <b>{d.shortDate}</b>
                  <span>{th.code}</span>
                </button>
              );
            })}
          </div>
          {phase && <NowNext day={day} phase={phase} />}
          <WeatherCard day={day} coord={theme.coord} today={localNow.date} />
          <section className="route-ribbon">
            <div className="route-head">
              <span>
                <Icon name="map" size={15} /> 今日路线
              </span>
              <button onClick={() => openMap(day.city)}>完整地图 ↗</button>
            </div>
            <div className="route-nodes">
              {routeNodes(day).map((n, i) => (
                <div key={`${n}-${i}`}>
                  <i>{i + 1}</i>
                  <span>{n}</span>
                </div>
              ))}
            </div>
          </section>
          <section className="daily-map-block">
            <div className="section-heading">
              <h3>当日地图</h3>
              <button
                onClick={() => {
                  setMapDayIso(day.iso);
                  setTab("map");
                }}
              >
                展开地图 ↗
              </button>
            </div>
            <TripMap
              points={dayMapPoints[day.iso] || []}
              activeId={activeMapId}
              onSelect={(point) => {
                setActiveMapId(point.id);
                setMapSheetPoint(point);
              }}
            />
          </section>
          <section className="section-block timeline-section">
            <div className="section-heading">
              <h3>今天怎么走</h3>
              <span>硬时间：{day.hardTime || "无固定预约"}</span>
            </div>
            <div className="timeline">
              {day.events.map((e, index) => {
                const kind = eventKind(e),
                  v = matchVlog(e),
                  pills = statusPills(e),
                  state = eventStates[`${day.iso}:${index}`],
                  rail = railLink(e),
                  mapPoint = (dayMapPoints[day.iso] || []).find(
                    (point) => point.eventIndex === index,
                  ),
                  vehicle = (`${e.title} ${e.transport}`.match(
                    /\b(?:FR|IC|EC|IR|RE|RJX?|ICE|Italo)\s?\d{2,5}\b/i,
                  ) || [])[0];
                return (
                  <article
                    className={`timeline-item kind-${kind} ${state ? `is-${state}` : ""} ${phase?.nowIndex === index ? "is-current" : ""}`}
                    key={`${e.time}-${index}`}
                    onClick={() => mapPoint && setActiveMapId(mapPoint.id)}
                  >
                    <time>
                      {mapPoint && (
                        <b className="map-order">{mapPoint.order}</b>
                      )}
                      {e.time}
                    </time>
                    <div className="rail">
                      <i>
                        <Icon name={kind} size={14} />
                      </i>
                    </div>
                    <div className="event-card">
                      <div className="event-compact">
                        <div className="event-top">
                          <span className="tag">{e.area}</span>
                          {v && (
                            <button
                              className="vlog-chip"
                              onClick={() => setSpotVlog(v)}
                            >
                              <Icon name="camera" size={15} />
                              口播
                            </button>
                          )}
                        </div>
                        <strong>{e.title}</strong>
                        {state && (
                          <span className="compact-state">
                            {state === "done"
                              ? "✓ 已完成"
                              : state === "shot"
                                ? "📷 已拍"
                                : "已跳过"}
                          </span>
                        )}
                      </div>
                      <div className="event-expanded">
                        <small>
                          {e.transport}
                          {e.duration ? ` · ${e.duration}` : ""}
                        </small>
                        <div className="pills">
                          {pills.map((p) => (
                            <span key={p}>{p}</span>
                          ))}
                          {v && <span className="vlog">Vlog重点</span>}
                        </div>
                        <div className="quick-meta">
                          <span>{e.cost || "费用待定"}</span>
                          <span>{e.booking || "无票务"}</span>
                        </div>
                        <div className="card-actions">
                          {e.map && (
                            <button onClick={() => openMap(e.map)}>
                              <Icon name="map" size={17} />
                              地图
                            </button>
                          )}
                          {kind === "train" && (
                            <>
                              <a
                                href={rail[1]}
                                target="_blank"
                                rel="noreferrer"
                              >
                                {rail[0]}
                              </a>
                              <button onClick={() => copyText(e.map || e.area)}>
                                复制站名
                              </button>
                              {vehicle && (
                                <button onClick={() => copyText(vehicle)}>
                                  复制车次
                                </button>
                              )}
                            </>
                          )}
                        </div>
                        <details>
                          <summary>安全、Plan B 与详细说明</summary>
                          <p>{e.description}</p>
                          {e.safety && (
                            <p>
                              <b>注意：</b>
                              {e.safety}
                            </p>
                          )}
                          {e.planB && (
                            <p>
                              <b>变化方案：</b>
                              {e.planB}
                            </p>
                          )}
                          {e.photo && (
                            <p>
                              <b>拍摄：</b>
                              {e.photo}
                            </p>
                          )}
                        </details>
                        {phase && (
                          <div
                            className="execution-actions"
                            aria-label="本地执行状态"
                          >
                            <button
                              className={state === "done" ? "active" : ""}
                              onClick={() => setExecution(index, "done")}
                            >
                              ✓ 完成
                            </button>
                            <button
                              className={state === "shot" ? "active" : ""}
                              onClick={() => setExecution(index, "shot")}
                            >
                              📷 已拍
                            </button>
                            <button
                              className={state === "skip" ? "active" : ""}
                              onClick={() => setExecution(index, "skip")}
                            >
                              跳过
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
          {dayTickets.length > 0 && (
            <section className="section-block">
              <div className="section-heading">
                <h3>当天票务</h3>
                <span>状态以文档为准</span>
              </div>
              <div className="stack-list">
                {dayTickets.map((t, i) => (
                  <article key={i}>
                    <Icon name="ticket" />
                    <div>
                      <strong>{t.name}</strong>
                      <small>
                        {t.time} · {t.price}
                      </small>
                    </div>
                    <Status value={t.status} />
                  </article>
                ))}
              </div>
            </section>
          )}
          <section className="section-block">
            <div className="section-heading">
              <h3>现场提示</h3>
              <span>按需展开查看</span>
            </div>
            <div className="notes-grid">
              {[
                ["吃饭补给", day.food, "food"],
                ["行李", day.luggage, "ticket"],
                ["穿搭", day.clothes, "today"],
                ["Plan B", day.planB, "map"],
              ].map(([a, b, c]) => (
                <details key={a}>
                  <summary>
                    <Icon name={c as IconName} />
                    <span>{a}</span>
                  </summary>
                  <p>{b}</p>
                </details>
              ))}
            </div>
          </section>
        </>
      )}
      {tab === "days" && (
        <section className="page-section itinerary-page">
          <div className="page-title">
            <h2>行程</h2>
            <span>9 月 27 日 — 10 月 5 日 · 9 天</span>
          </div>
          <SimpleItineraryGroup
            title="🇨🇭 SWITZERLAND"
            items={days.slice(0, 4)}
            offset={0}
            open={(i) => {
              setDayIndex(i);
              setTab("today");
            }}
          />
          <SimpleItineraryGroup
            title="🇮🇹 ITALY"
            items={days.slice(4)}
            offset={4}
            open={(i) => {
              setDayIndex(i);
              setTab("today");
            }}
          />
        </section>
      )}
      {tab === "map" && (
        <MapPage
          days={days}
          selectedIso={mapDayIso}
          selectDay={(iso) => {
            setMapDayIso(iso);
            setActiveMapId(null);
          }}
          onPoint={(point) => {
            setActiveMapId(point.id);
            setMapSheetPoint(point);
          }}
        />
      )}
      {tab === "tickets" && (
        <section className="page-section wallet-page">
          <div className="page-title">
            <p>WALLET</p>
            <h2>票务</h2>
            <span>优先处理未完成事项</span>
          </div>
          <div className="ticket-filters">
            {(
              [
                ["buy", "待买", ticketGroups.buy.length],
                ["check", "待确认", ticketGroups.check.length],
                ["done", "已购", ticketGroups.done.length],
              ] as const
            ).map(([id, label, count]) => (
              <button
                className={ticketFilter === id ? "active" : ""}
                key={id}
                onClick={() =>
                  setTicketFilter(ticketFilter === id ? "all" : id)
                }
              >
                <b>{count}</b>
                <span>{label}</span>
              </button>
            ))}
          </div>
          <div className="ticket-list">
            {shownTickets.map((t, i) => (
              <article
                className={`wallet-card tone-${ticketTone(t.name)}`}
                key={`${t.name}-${i}`}
              >
                <div className="ticket-stub">
                  <Icon name="ticket" size={20} />
                  <b>{t.date}</b>
                  <small>{t.time || "全天"}</small>
                </div>
                <div className="ticket-main">
                  <small>TRAVEL PASS · {String(i + 1).padStart(2, "0")}</small>
                  <strong>{t.name}</strong>
                  <p>{t.price}</p>
                  {t.url && (
                    <a href={t.url} target="_blank" rel="noreferrer">
                      查看官方页面 ↗
                    </a>
                  )}
                  <Status value={t.status} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      {tab === "budget" && (
        <section className="page-section">
          <div className="page-title budget-hero">
            <p>MONEY DASHBOARD</p>
            <h2>预算</h2>
            <strong>{content.budgetSummary.recommended}</strong>
            <div className="paid-split">
              <span>已确认</span>
              <b>{content.budgetSummary.confirmed}</b>
            </div>
            <div className="budget-progress">
              <i style={{ width: "58%" }} />
            </div>
          </div>
          <div className="category-chart">
            {categoryTotals.map((c, i) => (
              <article key={c.name}>
                <div
                  className="donut"
                  style={
                    {
                      "--pct": `${c.pct * 3.6}deg`,
                      "--i": i,
                    } as React.CSSProperties
                  }
                >
                  <b>{c.pct}%</b>
                </div>
                <span>{c.name}</span>
              </article>
            ))}
          </div>
          <div className="budget-summary">
            <article>
              <span>基础预算</span>
              <strong>{content.budgetSummary.base}</strong>
            </article>
            <article>
              <span>汇率口径</span>
              <strong>{content.budgetSummary.rates}</strong>
            </article>
          </div>
          <div className="budget-list">
            {content.budget.map((b, i) => (
              <article key={i}>
                <div>
                  <strong>{b.name}</strong>
                  <small>{b.note}</small>
                </div>
                <div>
                  <b>
                    {money(b.currency, b.low)}
                    {b.high && b.high !== b.low
                      ? ` — ${money(b.currency, b.high)}`
                      : ""}
                  </b>
                  <Status value={b.payment || "未付"} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      {tab === "vlog" && (
        <section className="page-section director-page">
          <div className="page-title">
            <p>DIRECTOR'S FIELD BOOK</p>
            <h2>Vlog</h2>
            <span>先说、再拍，背景资料最后看</span>
          </div>
          <div className="vlog-list">
            {content.vlog.map((v, i) => (
              <article key={i} className={vlogOpen === i ? "open" : ""}>
                <button onClick={() => setVlogOpen(vlogOpen === i ? -1 : i)}>
                  <span>{v.group}</span>
                  <strong>{v.location}</strong>
                  <b>{vlogOpen === i ? "−" : "+"}</b>
                </button>
                {vlogOpen === i && (
                  <VlogBody
                    vlog={v}
                    onPrompt={() =>
                      setPrompter({
                        title: v.location,
                        short: v.script10,
                        long: v.script30,
                        mode: "short",
                      })
                    }
                  />
                )}
              </article>
            ))}
          </div>
        </section>
      )}
      {mapSheetPoint && (
        <MapEventSheet
          point={mapSheetPoint}
          day={days.find((d) => d.iso === mapSheetPoint.day)!}
          close={() => setMapSheetPoint(null)}
        />
      )}
      {prepOpen && (
        <div className="modal-backdrop" onClick={() => setPrepOpen(false)}>
          <section className="prep-sheet" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPrepOpen(false)}>
              ×
            </button>
            <p className="eyebrow">出发前</p>
            <h2>准备清单</h2>
            <PrepChecklist
              checks={prepChecks}
              toggle={togglePrep}
              goTickets={() => {
                setPrepOpen(false);
                setTab("tickets");
              }}
            />
          </section>
        </div>
      )}
      {spotVlog && (
        <div className="modal-backdrop" onClick={() => setSpotVlog(null)}>
          <section className="vlog-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSpotVlog(null)}>
              ×
            </button>
            <p className="eyebrow">🎥 现场口播</p>
            <h2>{spotVlog.location}</h2>
            <VlogBody
              vlog={spotVlog}
              onPrompt={() =>
                setPrompter({
                  title: spotVlog.location,
                  short: spotVlog.script10,
                  long: spotVlog.script30,
                  mode: "short",
                })
              }
            />
          </section>
        </div>
      )}
      {prompter && (
        <Prompter
          data={prompter}
          update={setPrompter}
          close={() => setPrompter(null)}
        />
      )}
      <nav className="bottom-nav" aria-label="主导航">
        {nav.map(([id, label, icon]) => (
          <button
            key={id}
            className={tab === id ? "active" : ""}
            onClick={() => setTab(id)}
          >
            <i>
              <Icon name={icon} />
            </i>
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </main>
  );
}

function MapPage({
  days,
  selectedIso,
  selectDay,
  onPoint,
}: {
  days: Day[];
  selectedIso: string | null;
  selectDay: (iso: string | null) => void;
  onPoint: (point: TripMapPoint) => void;
}) {
  const selected = days.find((d) => d.iso === selectedIso),
    points = selected ? dayMapPoints[selected.iso] || [] : tripOverview;
  return (
    <section className="page-section map-page">
      <div className="page-title">
        <h2>地图</h2>
        <span>
          {selected
            ? `${selected.shortDate} · ${selected.title}`
            : "Switzerland → Italy · 主路线"}
        </span>
      </div>
      <div className="map-scope">
        <button
          className={!selected ? "active" : ""}
          onClick={() => selectDay(null)}
        >
          全程
        </button>
        {days.map((day) => (
          <button
            key={day.iso}
            className={selectedIso === day.iso ? "active" : ""}
            onClick={() => selectDay(day.iso)}
          >
            D{day.day}
          </button>
        ))}
      </div>
      <TripMap points={points} overview={!selected} onSelect={onPoint} />
      <div className="map-legend">
        <span>
          <i className="train" />
          火车
        </span>
        <span>
          <i className="walk" />
          步行
        </span>
        <span>
          <i className="cable" />
          缆车
        </span>
        <span>
          <i className="flight" />
          飞行
        </span>
      </div>
      {!selected && (
        <p className="map-note">
          选择某一天查看详细地点。主路线仅表达正式行程顺序，不代表精确铁路轨迹。
        </p>
      )}
    </section>
  );
}

function MapEventSheet({
  point,
  day,
  close,
}: {
  point: TripMapPoint;
  day: Day;
  close: () => void;
}) {
  const event = day.events[point.eventIndex];
  if (!event) return null;
  return (
    <div className="modal-backdrop" onClick={close}>
      <section className="map-event-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={close}>
          ×
        </button>
        <span className="map-sheet-order">{point.order}</span>
        <small>
          {day.shortDate} · {event.time}
        </small>
        <h2>{event.title}</h2>
        <p>{event.area}</p>
        <div>
          <span>{event.transport || "步行/现场移动"}</span>
          <span>{event.cost || "费用待定"}</span>
          <span>{event.booking || "无票务"}</span>
        </div>
        <button
          className="map-navigate"
          onClick={() => openMap(event.map || point.name)}
        >
          Google Maps 导航 ↗
        </button>
      </section>
    </div>
  );
}

function SimpleItineraryGroup({
  title,
  items,
  offset,
  open,
}: {
  title: string;
  items: Day[];
  offset: number;
  open: (i: number) => void;
}) {
  return (
    <section className="itinerary-group">
      <h3>{title}</h3>
      <div className="itinerary-rows">
        {items.map((d, j) => (
          <button key={d.iso} onClick={() => open(offset + j)}>
            <time>
              {d.shortDate}
              <small>{d.weekday}</small>
            </time>
            <div>
              <strong>{d.title}</strong>
              <p>
                {d.city} · {routeNodes(d).slice(0, 3).join(" → ")}
              </p>
            </div>
            <Icon name="chevron" />
          </button>
        ))}
      </div>
    </section>
  );
}
const prepItems = [
  ["tickets", "票务最后检查", "Swiss Travel Pass、未购项目及预约状态"],
  ["insurance", "保险与跳伞确认", "核实保险期限及跳伞书面承保范围"],
  ["passport", "证件与支付", "护照、签证、银行卡与少量现金"],
  ["clothes", "衣物与雨具", "分层穿搭、防水外套与舒适步行鞋"],
  ["power", "充电设备", "充电宝、转换插头、线材与备用电池"],
  ["camera", "Vlog 设备", "相机、储存卡、麦克风与离线口播"],
] as const;

function PrepChecklist({
  checks,
  toggle,
  goTickets,
}: {
  checks: Record<string, boolean>;
  toggle: (key: string) => void;
  goTickets: () => void;
}) {
  const done = prepItems.filter(([key]) => checks[key]).length;
  return (
    <section className="prep-checklist">
      <div className="section-heading">
        <h3>出发准备</h3>
        <span>
          {done} / {prepItems.length} 已完成
        </span>
      </div>
      {prepItems.map(([key, title, note]) => (
        <label key={key} className={checks[key] ? "checked" : ""}>
          <input
            type="checkbox"
            checked={!!checks[key]}
            onChange={() => toggle(key)}
          />
          <div>
            <b>{title}</b>
            <small>{note}</small>
          </div>
          {key === "tickets" && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                goTickets();
              }}
            >
              查看票务
            </button>
          )}
        </label>
      ))}
    </section>
  );
}

function NowNext({ day, phase }: { day: Day; phase: LivePhase | null }) {
  if (!phase) return null;
  if (phase.kind === "finished")
    return (
      <section className="now-next finished">
        <div className="mode-label">LIVE · 当地时间</div>
        <article>
          <span>DONE</span>
          <div>
            <b>今日完成</b>
            <small>所有定时行程已经结束，注意休息并检查明日安排。</small>
          </div>
        </article>
      </section>
    );
  const now = phase.nowIndex !== null ? day.events[phase.nowIndex] : null,
    next = phase.nextIndex !== null ? day.events[phase.nextIndex] : null;
  return (
    <section className={`now-next phase-${phase.kind}`}>
      <div className="mode-label">LIVE · {phase.label}</div>
      {now && (
        <article>
          <span>NOW</span>
          <time>{now.time}</time>
          <div>
            <b>{now.title}</b>
            <small>{now.area}</small>
          </div>
        </article>
      )}
      {!now && (
        <article>
          <span>{phase.kind === "before" ? "WAIT" : "PAUSE"}</span>
          <div>
            <b>{phase.kind === "before" ? "尚未开始" : "行程间隙"}</b>
            <small>{phase.label}</small>
          </div>
        </article>
      )}
      {next && (
        <article>
          <span>NEXT</span>
          <time>{next.time}</time>
          <div>
            <b>{next.title}</b>
            <small>{next.transport || next.area}</small>
          </div>
        </article>
      )}
    </section>
  );
}

type WeatherData = {
  apparent: number;
  rain: number;
  wind: number;
  visibility: number;
  updated: string;
};
function WeatherCard({
  day,
  coord,
  today,
}: {
  day: Day;
  coord: string;
  today: string;
}) {
  const distance = dayDistance(today, day.iso),
    [weather, setWeather] = useState<WeatherData | null>(null),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    if (distance < 0 || distance > 7) return;
    const nums = coord.match(/[\d.]+/g)?.map(Number);
    if (!nums) return;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${nums[0]}&longitude=${nums[1]}&hourly=apparent_temperature,precipitation_probability,wind_speed_10m,visibility&timezone=Europe%2FZurich&forecast_days=8`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((j) => {
        const target = `${day.iso}T12:00`,
          i = j.hourly.time.findIndex((t: string) => t === target);
        if (i < 0) throw new Error();
        setWeather({
          apparent: j.hourly.apparent_temperature[i],
          rain: j.hourly.precipitation_probability[i],
          wind: j.hourly.wind_speed_10m[i],
          visibility: Math.round(j.hourly.visibility[i] / 100) / 10,
          updated: new Intl.DateTimeFormat("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date()),
        });
      })
      .catch(() => setFailed(true));
  }, [day.iso, coord, distance]);
  if (distance > 7) return null;
  return (
    <section className="weather-strip">
      <b>实时天气</b>
      {weather ? (
        <>
          <span>体感 {weather.apparent}°</span>
          <span>降雨 {weather.rain}%</span>
          <span>风 {weather.wind} km/h</span>
          <span>能见度 {weather.visibility} km</span>
        </>
      ) : (
        <span>{failed ? "暂时无法更新" : `${day.weather} · 正在更新…`}</span>
      )}
    </section>
  );
}
function VlogBody({
  vlog: v,
  onPrompt,
}: {
  vlog: Vlog;
  onPrompt?: () => void;
}) {
  return (
    <div className="vlog-body">
      <section className="script-card primary">
        <h4>10秒口播</h4>
        <p>{v.script10 || "本地点暂无10秒口播"}</p>
        {v.script10 && onPrompt && (
          <button onClick={onPrompt}>进入提词模式</button>
        )}
      </section>
      {v.script30 && (
        <section className="script-card">
          <h4>30秒口播</h4>
          <p>{v.script30}</p>
          {onPrompt && <button onClick={onPrompt}>进入提词模式</button>}
        </section>
      )}
      {v.shots.length > 0 && (
        <section className="shot-list">
          <h4>必拍镜头</h4>
          {v.shots.map((s, j) => (
            <label key={j}>
              <input type="checkbox" />
              <span>{s}</span>
            </label>
          ))}
        </section>
      )}
      {v.changes.length > 0 && (
        <section className="change-note">
          <h4>现场变化</h4>
          {v.changes.map((s, j) => (
            <p key={j}>{s}</p>
          ))}
        </section>
      )}
      {v.background && (
        <details>
          <summary>背景速懂</summary>
          <p>{v.background}</p>
        </details>
      )}
      {v.voiceover && (
        <details>
          <summary>后期旁白</summary>
          <p>{v.voiceover}</p>
        </details>
      )}
      {v.transition && (
        <details>
          <summary>转场建议</summary>
          <p>{v.transition}</p>
        </details>
      )}
    </div>
  );
}

function Prompter({
  data,
  update,
  close,
}: {
  data: { title: string; short: string; long: string; mode: "short" | "long" };
  update: React.Dispatch<React.SetStateAction<typeof data | null>>;
  close: () => void;
}) {
  const [size, setSize] = useState(34),
    [dark, setDark] = useState(true),
    [awake, setAwake] = useState(false);
  const wake = useRef<{ release: () => Promise<void> } | null>(null);
  useEffect(() => {
    if (!awake) {
      wake.current?.release().catch(() => {});
      wake.current = null;
      return;
    }
    const request = async () => {
      try {
        wake.current = await (
          navigator as Navigator & {
            wakeLock: {
              request: (
                type: "screen",
              ) => Promise<{ release: () => Promise<void> }>;
            };
          }
        ).wakeLock.request("screen");
      } catch {
        setAwake(false);
      }
    };
    request();
    return () => {
      wake.current?.release().catch(() => {});
    };
  }, [awake]);
  const text = data.mode === "long" && data.long ? data.long : data.short;
  return (
    <div className={`prompter ${dark ? "dark" : "light"}`}>
      <div className="prompter-tools">
        <button onClick={close}>完成 ×</button>
        <button
          onClick={() =>
            update((p) =>
              p ? { ...p, mode: p.mode === "short" ? "long" : "short" } : p,
            )
          }
          disabled={data.mode === "short" && !data.long}
        >
          {data.mode === "short" ? "30秒" : "10秒"}
        </button>
        <button onClick={() => setSize((s) => Math.max(24, s - 3))}>A−</button>
        <button onClick={() => setSize((s) => Math.min(56, s + 3))}>A+</button>
        <button
          className={awake ? "active" : ""}
          onClick={() => setAwake((v) => !v)}
        >
          {awake ? "常亮中" : "保持常亮"}
        </button>
        <button onClick={() => setDark((v) => !v)}>
          {dark ? "浅色" : "黑底"}
        </button>
      </div>
      <small>
        TELEPROMPTER · {data.mode === "short" ? "10 SEC" : "30 SEC"} ·{" "}
        {data.title}
      </small>
      <p style={{ fontSize: size }}>{text}</p>
    </div>
  );
}
