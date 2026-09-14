export type MapTransport =
  | "train"
  | "walk"
  | "cable"
  | "flight"
  | "operator"
  | "transfer";

export type TripMapPoint = {
  id: string;
  day: string;
  eventIndex: number;
  order: number;
  name: string;
  lat: number;
  lng: number;
  transport: MapTransport;
  publicArea?: boolean;
};

const p = (
  day: string,
  eventIndex: number,
  order: number,
  name: string,
  lat: number,
  lng: number,
  transport: MapTransport,
  publicArea = false,
): TripMapPoint => ({
  id: `${day}-${order}-${eventIndex}`,
  day,
  eventIndex,
  order,
  name,
  lat,
  lng,
  transport,
  publicArea,
});

// Coordinates are explicit public POIs or area-level locations. Accommodation
// points deliberately use a public station/neighbourhood rather than a door number.
export const dayMapPoints: Record<string, TripMapPoint[]> = {
  "2026-09-27": [
    p("2026-09-27", 0, 1, "Zürich Flughafen", 47.4582, 8.5555, "flight"),
    p("2026-09-27", 1, 2, "Lungern Bahnhof", 46.78635, 8.16378, "train"),
    p("2026-09-27", 2, 3, "Lungern Bahnhof lockers", 46.78622, 8.16355, "walk"),
    p("2026-09-27", 3, 4, "Mülibachersträssli 14 S-bend", 46.7958, 8.1656, "walk"),
    p("2026-09-27", 3, 5, "Milchautomat Lungern", 46.7904, 8.1645, "walk"),
    p("2026-09-27", 3, 6, "Inseli Lungern", 46.7833, 8.1582, "walk"),
    p("2026-09-27", 3, 7, "返回 Lungern Bahnhof", 46.78635, 8.16378, "walk"),
    p("2026-09-27", 4, 8, "Lauterbrunnen Bahnhof", 46.5986, 7.9076, "train"),
    p("2026-09-27", 5, 9, "Lauterbrunnen village / Coop area", 46.5961, 7.907, "walk", true),
  ],
  "2026-09-28": [
    p("2026-09-28", 0, 1, "Lauterbrunnen", 46.5986, 7.9076, "walk", true),
    p("2026-09-28", 1, 2, "Interlaken Ost", 46.6905, 7.869, "train"),
    p("2026-09-28", 1, 3, "OUTDOOR – Interlaken Shop, Höheweg 95", 46.68708, 7.85929, "walk"),
    p("2026-09-28", 2, 4, "Reichenbach drop zone", 46.6138, 7.6814, "operator"),
    p("2026-09-28", 3, 5, "Lauterbrunnen valley", 46.5935, 7.9091, "train"),
    p("2026-09-28", 4, 6, "Stechelberg, Schilthornbahn", 46.5552, 7.9017, "train"),
    p("2026-09-28", 4, 7, "Mürren", 46.5592, 7.8926, "cable"),
    p("2026-09-28", 4, 8, "Allmendhubel", 46.5608, 7.8892, "cable"),
    p("2026-09-28", 5, 9, "Mürren BLM", 46.5636, 7.896, "walk"),
    p("2026-09-28", 5, 10, "Grütschalp", 46.5964, 7.8884, "train"),
    p("2026-09-28", 5, 11, "Lauterbrunnen Bahnhof", 46.5986, 7.9076, "cable"),
    p("2026-09-28", 5, 12, "Wengen", 46.6059, 7.921, "train"),
    p("2026-09-28", 5, 13, "返回 Lauterbrunnen", 46.5986, 7.9076, "train", true),
  ],
  "2026-09-29": [
    p("2026-09-29", 0, 1, "Lauterbrunnen", 46.5986, 7.9076, "walk", true),
    p("2026-09-29", 1, 2, "Interlaken Ost", 46.6905, 7.869, "train"),
    p("2026-09-29", 1, 3, "Spiez", 46.6863, 7.6806, "train"),
    p("2026-09-29", 1, 4, "Visp", 46.2937, 7.8816, "train"),
    p("2026-09-29", 1, 5, "Zermatt Bahnhof", 46.0243, 7.7478, "train"),
    p("2026-09-29", 2, 6, "Gornergrat", 45.983, 7.7849, "train"),
    p("2026-09-29", 3, 7, "Gornergrat viewpoint", 45.9833, 7.7845, "walk"),
    p("2026-09-29", 4, 8, "Rotenboden", 45.9854, 7.7659, "walk"),
    p("2026-09-29", 4, 9, "Riffelsee", 45.989, 7.7628, "walk"),
    p("2026-09-29", 4, 10, "Second lake area", 45.9874, 7.7587, "walk"),
    p("2026-09-29", 4, 11, "Riffelberg", 45.9927, 7.7538, "walk"),
    p("2026-09-29", 5, 12, "Zermatt village / Kirchbrücke", 46.0189, 7.7497, "train"),
    p("2026-09-29", 6, 13, "Lauterbrunnen Bahnhof", 46.5986, 7.9076, "train", true),
  ],
  "2026-09-30": [
    p("2026-09-30", 0, 1, "Lauterbrunnen", 46.5986, 7.9076, "walk", true),
    p("2026-09-30", 0, 2, "OUTDOOR Interlaken（补跳备选）", 46.68708, 7.85929, "operator"),
    p("2026-09-30", 1, 3, "Lauterbrunnen Bahnhof / luggage", 46.5986, 7.9076, "walk"),
    p("2026-09-30", 2, 4, "Spiez", 46.6863, 7.6806, "train"),
    p("2026-09-30", 2, 5, "Brig", 46.319, 7.9881, "train"),
    p("2026-09-30", 2, 6, "Milano Centrale", 45.4863, 9.2045, "train"),
    p("2026-09-30", 3, 7, "Porta Venezia public area", 45.4741, 9.2058, "transfer", true),
    p("2026-09-30", 4, 8, "Duomo di Milano", 45.4642, 9.1916, "train"),
    p("2026-09-30", 4, 9, "Galleria Vittorio Emanuele II", 45.4659, 9.19, "walk"),
    p("2026-09-30", 5, 10, "Porta Venezia public area", 45.4741, 9.2058, "train", true),
  ],
  "2026-10-01": [
    p("2026-10-01", 0, 1, "Piazza del Duomo", 45.4642, 9.19, "train"),
    p("2026-10-01", 1, 2, "Duomo di Milano entrance", 45.4641, 9.1919, "walk"),
    p("2026-10-01", 1, 3, "Duomo Rooftops", 45.4641, 9.1919, "walk"),
    p("2026-10-01", 2, 4, "Galleria Vittorio Emanuele II", 45.4659, 9.19, "walk"),
    p("2026-10-01", 3, 5, "Brera", 45.4719, 9.1881, "walk"),
    p("2026-10-01", 4, 6, "Castello Sforzesco", 45.4705, 9.1793, "walk"),
    p("2026-10-01", 5, 7, "Parco Sempione", 45.4723, 9.176, "walk"),
    p("2026-10-01", 5, 8, "Arco della Pace", 45.4755, 9.1723, "walk"),
    p("2026-10-01", 6, 9, "Porta Venezia public area / luggage", 45.4741, 9.2058, "train", true),
    p("2026-10-01", 6, 10, "Milano Centrale", 45.4863, 9.2045, "train"),
    p("2026-10-01", 7, 11, "Venezia Santa Lucia", 45.441, 12.321, "train"),
    p("2026-10-01", 8, 12, "Cannaregio public area", 45.4455, 12.3267, "walk", true),
  ],
  "2026-10-02": [
    p("2026-10-02", 0, 1, "Cannaregio public area", 45.4455, 12.3267, "walk", true),
    p("2026-10-02", 1, 2, "Rialto Bridge", 45.438, 12.3359, "walk"),
    p("2026-10-02", 2, 3, "Piazza San Marco", 45.4342, 12.3385, "walk"),
    p("2026-10-02", 2, 4, "Bridge of Sighs exterior", 45.4341, 12.3411, "walk"),
    p("2026-10-02", 3, 5, "Palazzo Ducale", 45.4337, 12.3404, "walk"),
    p("2026-10-02", 4, 6, "Basilica di San Marco", 45.4346, 12.3397, "walk"),
    p("2026-10-02", 5, 7, "Rialto return route", 45.438, 12.3359, "walk"),
    p("2026-10-02", 5, 8, "Cannaregio public area", 45.4455, 12.3267, "walk", true),
    p("2026-10-02", 6, 9, "Venezia Santa Lucia", 45.441, 12.321, "walk"),
    p("2026-10-02", 7, 10, "Firenze SMN", 43.7764, 11.2478, "train"),
    p("2026-10-02", 8, 11, "Santa Croce public area", 43.7683, 11.2624, "transfer", true),
    p("2026-10-02", 9, 12, "Piazzale Michelangelo", 43.7629, 11.2651, "walk"),
    p("2026-10-02", 10, 13, "Ponte alle Grazie", 43.7669, 11.2597, "walk"),
    p("2026-10-02", 10, 14, "Ponte Vecchio", 43.768, 11.2531, "walk"),
    p("2026-10-02", 10, 15, "Santa Croce public area", 43.7683, 11.2624, "walk", true),
  ],
  "2026-10-03": [
    p("2026-10-03", 0, 1, "Santa Croce public area", 43.7683, 11.2624, "walk", true),
    p("2026-10-03", 1, 2, "Florence Duomo", 43.7731, 11.256, "walk"),
    p("2026-10-03", 1, 3, "Piazza della Repubblica", 43.7711, 11.2537, "walk"),
    p("2026-10-03", 1, 4, "Piazza della Signoria", 43.7697, 11.2556, "walk"),
    p("2026-10-03", 1, 5, "Uffizi exterior", 43.7687, 11.2559, "walk"),
    p("2026-10-03", 1, 6, "Ponte Vecchio", 43.768, 11.2531, "walk"),
    p("2026-10-03", 2, 7, "Santa Croce public area / luggage", 43.7683, 11.2624, "walk", true),
    p("2026-10-03", 2, 8, "Firenze SMN", 43.7764, 11.2478, "transfer"),
    p("2026-10-03", 3, 9, "Roma Termini", 41.901, 12.5018, "train"),
    p("2026-10-03", 4, 10, "Colosseo / Monti public area", 41.891, 12.493, "transfer", true),
    p("2026-10-03", 5, 11, "Vatican Museums entrance", 41.9065, 12.4536, "train"),
    p("2026-10-03", 6, 12, "Vatican Museums", 41.9065, 12.4536, "walk"),
    p("2026-10-03", 6, 13, "Sistine Chapel", 41.9029, 12.4545, "walk"),
    p("2026-10-03", 7, 14, "Ponte Sant'Angelo", 41.9014, 12.4663, "walk"),
    p("2026-10-03", 8, 15, "Piazza Navona / Prati dinner area", 41.8992, 12.4731, "walk"),
    p("2026-10-03", 9, 16, "Colosseo / Monti public area", 41.891, 12.493, "transfer", true),
    p("2026-10-03", 10, 17, "Gay Street / Coming Out area", 41.889, 12.4966, "walk"),
  ],
  "2026-10-04": [
    p("2026-10-04", 0, 1, "Colosseo public area", 41.8902, 12.4922, "walk", true),
    p("2026-10-04", 1, 2, "Colosseum", 41.8902, 12.4922, "walk"),
    p("2026-10-04", 1, 3, "Arch of Constantine", 41.8898, 12.4905, "walk"),
    p("2026-10-04", 1, 4, "Foro Romano", 41.8925, 12.4853, "walk"),
    p("2026-10-04", 1, 5, "Palatine Hill", 41.8894, 12.4875, "walk"),
    p("2026-10-04", 2, 6, "Monti / Piazza Venezia lunch area", 41.8958, 12.4931, "walk"),
    p("2026-10-04", 3, 7, "Vittoriano", 41.8946, 12.4831, "walk"),
    p("2026-10-04", 3, 8, "Campidoglio", 41.8933, 12.4828, "walk"),
    p("2026-10-04", 3, 9, "Via Monte Tarpeo viewpoint", 41.8928, 12.4833, "walk"),
    p("2026-10-04", 4, 10, "Largo di Torre Argentina", 41.8955, 12.4769, "walk"),
    p("2026-10-04", 4, 11, "Piazza Navona", 41.8992, 12.4731, "walk"),
    p("2026-10-04", 5, 12, "Pantheon", 41.8986, 12.4769, "walk"),
    p("2026-10-04", 6, 13, "Sant'Ignazio", 41.8997, 12.479, "walk"),
    p("2026-10-04", 7, 14, "Trevi neighbourhood", 41.9007, 12.4833, "walk"),
    p("2026-10-04", 8, 15, "Trevi Fountain", 41.9009, 12.4833, "walk"),
    p("2026-10-04", 9, 16, "Spanish Steps", 41.9059, 12.4823, "walk"),
    p("2026-10-04", 10, 17, "Colosseum night / dinner area", 41.8938, 12.4887, "walk"),
  ],
  "2026-10-05": [
    p("2026-10-05", 0, 1, "Colosseo / Monti public area", 41.891, 12.493, "walk", true),
    p("2026-10-05", 1, 2, "Roma Termini（rail option）", 41.901, 12.5018, "transfer"),
    p("2026-10-05", 1, 3, "Fiumicino Airport Terminal", 41.8003, 12.2389, "train"),
    p("2026-10-05", 2, 4, "FCO check-in area", 41.8003, 12.2389, "walk"),
    p("2026-10-05", 3, 5, "FCO shopping / airside", 41.7999, 12.2462, "walk"),
    p("2026-10-05", 4, 6, "Departure gate area", 41.7999, 12.2462, "flight"),
  ],
};

export const tripOverview: TripMapPoint[] = [
  p("2026-09-27", 0, 1, "Zürich Flughafen", 47.4582, 8.5555, "flight"),
  p("2026-09-27", 1, 2, "Lungern", 46.7857, 8.1607, "train"),
  p("2026-09-27", 4, 3, "Lauterbrunnen", 46.5986, 7.9076, "train"),
  p("2026-09-28", 1, 4, "Interlaken", 46.68708, 7.85929, "train"),
  p("2026-09-28", 5, 5, "Return to Lauterbrunnen", 46.5986, 7.9076, "train"),
  p("2026-09-29", 1, 6, "Zermatt", 46.0243, 7.7478, "train"),
  p("2026-09-29", 6, 7, "Return to Lauterbrunnen", 46.5986, 7.9076, "train"),
  p("2026-09-30", 2, 8, "Milan", 45.4863, 9.2045, "train"),
  p("2026-10-01", 7, 9, "Venice", 45.441, 12.321, "train"),
  p("2026-10-02", 7, 10, "Florence", 43.7764, 11.2478, "train"),
  p("2026-10-03", 3, 11, "Rome", 41.901, 12.5018, "train"),
  p("2026-10-05", 1, 12, "Fiumicino Airport", 41.8003, 12.2389, "flight"),
];
