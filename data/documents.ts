export type DocumentCategory =
  | "admission"
  | "transport"
  | "accommodation"
  | "insurance";

export type CredentialDocument = {
  id: string;
  type: "pdf" | "image";
  titleZh: string;
  titleEn: string;
  category: DocumentCategory;
  date: string;
  time?: string;
  city: string;
  amount?: string;
  displayFileName: string;
  storage: { kind: "mock" } | { kind: "signed"; endpoint: string };
};

// Metadata only. Real files, R2 keys, local paths, QR codes and booking
// references must never be committed here. Endpoints stream private R2 objects
// only after the server validates the HttpOnly vault session cookie.
export const documents: CredentialDocument[] = [
  { id: "milan-venice-fr9747", type: "pdf", titleZh: "米兰 → 威尼斯高铁票", titleEn: "Milano Centrale → Venezia S. Lucia", category: "transport", date: "2026-10-01", time: "16:45", city: "Milano / Venezia", amount: "€19", displayFileName: "Milano-Venezia-FR9747.pdf", storage: { kind: "signed", endpoint: "/api/credentials/milan-venice-fr9747" } },
  { id: "venice-florence-italo-1", type: "pdf", titleZh: "威尼斯 → 佛罗伦萨高铁票", titleEn: "Venezia S. Lucia → Firenze S. M. Novella", category: "transport", date: "2026-10-02", time: "14:05", city: "Venezia / Firenze", amount: "€42.90", displayFileName: "Venezia-Firenze-Italo.pdf", storage: { kind: "signed", endpoint: "/api/credentials/venice-florence-italo-1" } },
  { id: "florence-rome-italo", type: "pdf", titleZh: "佛罗伦萨 → 罗马高铁票", titleEn: "Firenze S. M. Novella → Roma Termini", category: "transport", date: "2026-10-03", time: "11:43", city: "Firenze / Roma", amount: "€29.90", displayFileName: "Firenze-Roma-Italo.pdf", storage: { kind: "signed", endpoint: "/api/credentials/florence-rome-italo" } },
  { id: "milan-duomo", type: "pdf", titleZh: "米兰大教堂门票", titleEn: "Duomo di Milano Rooftop + Cathedral", category: "admission", date: "2026-10-01", time: "09:00", city: "Milano", amount: "€26", displayFileName: "Duomo-di-Milano.pdf", storage: { kind: "signed", endpoint: "/api/credentials/milan-duomo" } },
  { id: "st-marks-basilica", type: "pdf", titleZh: "圣马可大教堂门票", titleEn: "Basilica di San Marco", category: "admission", date: "2026-10-02", time: "11:00", city: "Venezia", amount: "€10", displayFileName: "Basilica-di-San-Marco.pdf", storage: { kind: "signed", endpoint: "/api/credentials/st-marks-basilica" } },
  // Doge's Palace / Musei P. San Marco combo: €30 Ducale entry + €0 Abbinato Correr voucher from the same MUVE order.
  { id: "doges-palace", type: "pdf", titleZh: "总督宫门票", titleEn: "Palazzo Ducale", category: "admission", date: "2026-10-02", time: "09:15", city: "Venezia", amount: "€30", displayFileName: "Palazzo-Ducale.pdf", storage: { kind: "signed", endpoint: "/api/credentials/doges-palace" } },
  { id: "doges-palace-correr", type: "pdf", titleZh: "Correr 联票凭证", titleEn: "Museo Correr — Combined Entry", category: "admission", date: "2026-10-02", time: "16:50", city: "Venezia", amount: "€0", displayFileName: "Museo-Correr-Abbinato.pdf", storage: { kind: "signed", endpoint: "/api/credentials/doges-palace-correr" } },
  { id: "vatican-museums", type: "pdf", titleZh: "梵蒂冈博物馆门票", titleEn: "Musei Vaticani Admission Ticket", category: "admission", date: "2026-10-03", time: "16:00", city: "Roma / Città del Vaticano", amount: "€25", displayFileName: "Musei-Vaticani.pdf", storage: { kind: "signed", endpoint: "/api/credentials/vatican-museums" } },
  { id: "travel-insurance", type: "pdf", titleZh: "境外旅行保险凭证", titleEn: "International Travel Insurance", category: "insurance", date: "2026-09-27", city: "Switzerland / Italy", amount: "CNY 150", displayFileName: "Travel-Insurance.pdf", storage: { kind: "signed", endpoint: "/api/credentials/travel-insurance" } },
];

export type TicketPresentation = {
  titleZh: string;
  titleEn: string;
  category: DocumentCategory;
  city: string;
  documentIds: string[];
};

export const ticketPresentation: Record<string, TicketPresentation> = {
  "Vatican Museums – Admission Ticket": { titleZh: "梵蒂冈博物馆", titleEn: "Musei Vaticani", category: "admission", city: "罗马", documentIds: ["vatican-museums"] },
  "Milan Duomo Rooftop + Cathedral": { titleZh: "米兰大教堂屋顶与教堂", titleEn: "Duomo di Milano Rooftop + Cathedral", category: "admission", city: "米兰", documentIds: ["milan-duomo"] },
  "St Mark's Basilica": { titleZh: "圣马可大教堂", titleEn: "Basilica di San Marco", category: "admission", city: "威尼斯", documentIds: ["st-marks-basilica"] },
  "Doge's Palace": { titleZh: "总督宫", titleEn: "Palazzo Ducale", category: "admission", city: "威尼斯", documentIds: ["doges-palace", "doges-palace-correr"] },
  "Venezia S. Lucia→Firenze SMN": { titleZh: "威尼斯 → 佛罗伦萨高铁", titleEn: "Venezia S. Lucia → Firenze S. M. Novella", category: "transport", city: "威尼斯 / 佛罗伦萨", documentIds: ["venice-florence-italo-1"] },
  "Firenze SMN→Roma Termini": { titleZh: "佛罗伦萨 → 罗马高铁", titleEn: "Firenze S. M. Novella → Roma Termini", category: "transport", city: "佛罗伦萨 / 罗马", documentIds: ["florence-rome-italo"] },
  "Milano Centrale→Venezia S. Lucia": { titleZh: "米兰 → 威尼斯高铁", titleEn: "Milano Centrale → Venezia S. Lucia", category: "transport", city: "米兰 / 威尼斯", documentIds: ["milan-venice-fr9747"] },
  "Swiss Travel Pass 4日二等": { titleZh: "瑞士旅行通票（4日二等）", titleEn: "Swiss Travel Pass — 4 Days, 2nd Class", category: "transport", city: "瑞士", documentIds: [] },
  "境外旅行保险": { titleZh: "境外旅行保险", titleEn: "International Travel Insurance", category: "insurance", city: "瑞士 / 意大利", documentIds: ["travel-insurance"] },
};

export const documentById = new Map(documents.map((document) => [document.id, document]));
