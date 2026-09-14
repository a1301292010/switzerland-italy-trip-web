export type MapTransport = "train" | "walk" | "cable" | "flight" | "transfer";
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
  id: `${day}-${eventIndex}`,
  day,
  eventIndex,
  order,
  name,
  lat,
  lng,
  transport,
  publicArea,
});

export const dayMapPoints: Record<string, TripMapPoint[]> = {
  "2026-09-27": [
    p("2026-09-27", 0, 1, "Zürich Flughafen", 47.4582, 8.5555, "flight"),
    p("2026-09-27", 1, 2, "Lungern Bahnhof", 46.7853, 8.1595, "train"),
    p("2026-09-27", 3, 3, "Lungern village & lake", 46.7861, 8.1602, "walk"),
    p("2026-09-27", 4, 4, "Lauterbrunnen Bahnhof", 46.5986, 7.9076, "train"),
    p(
      "2026-09-27",
      5,
      5,
      "Lauterbrunnen village",
      46.5935,
      7.9091,
      "walk",
      true,
    ),
  ],
  "2026-09-28": [
    p(
      "2026-09-28",
      0,
      1,
      "Lauterbrunnen village",
      46.5935,
      7.9091,
      "walk",
      true,
    ),
    p("2026-09-28", 1, 2, "Interlaken Ost", 46.6905, 7.869, "train"),
    p("2026-09-28", 2, 3, "Reichenbach airfield", 46.6138, 7.6814, "flight"),
    p("2026-09-28", 3, 4, "Lauterbrunnen valley", 46.5935, 7.9091, "train"),
    p("2026-09-28", 4, 5, "Mürren", 46.5592, 7.8926, "cable"),
    p("2026-09-28", 5, 6, "Wengen", 46.6059, 7.921, "train"),
  ],
  "2026-09-29": [
    p("2026-09-29", 0, 1, "Lauterbrunnen", 46.5986, 7.9076, "walk", true),
    p("2026-09-29", 1, 2, "Zermatt Bahnhof", 46.0243, 7.7478, "train"),
    p("2026-09-29", 2, 3, "Gornergrat", 45.983, 7.7849, "train"),
    p("2026-09-29", 3, 4, "Gornergrat viewpoint", 45.9833, 7.7845, "walk"),
    p("2026-09-29", 4, 5, "Riffelsee", 45.989, 7.7628, "walk"),
    p("2026-09-29", 5, 6, "Zermatt village", 46.0207, 7.7491, "train"),
    p("2026-09-29", 6, 7, "Lauterbrunnen Bahnhof", 46.5986, 7.9076, "train"),
  ],
  "2026-09-30": [
    p("2026-09-30", 0, 1, "Lauterbrunnen", 46.5986, 7.9076, "walk", true),
    p("2026-09-30", 2, 2, "Milano Centrale", 45.4863, 9.2045, "train"),
    p("2026-09-30", 3, 3, "Porta Venezia", 45.4741, 9.2058, "transfer", true),
    p("2026-09-30", 4, 4, "Duomo di Milano", 45.4642, 9.1916, "train"),
  ],
  "2026-10-01": [
    p("2026-10-01", 0, 1, "Piazza del Duomo", 45.4642, 9.19, "walk"),
    p("2026-10-01", 1, 2, "Duomo Rooftops", 45.4641, 9.1919, "walk"),
    p(
      "2026-10-01",
      2,
      3,
      "Galleria Vittorio Emanuele II",
      45.4659,
      9.19,
      "walk",
    ),
    p("2026-10-01", 3, 4, "Brera", 45.4719, 9.1881, "walk"),
    p("2026-10-01", 4, 5, "Castello Sforzesco", 45.4705, 9.1793, "walk"),
    p("2026-10-01", 5, 6, "Arco della Pace", 45.4755, 9.1723, "walk"),
    p("2026-10-01", 6, 7, "Milano Centrale", 45.4863, 9.2045, "train"),
    p("2026-10-01", 7, 8, "Venezia Santa Lucia", 45.441, 12.321, "train"),
    p("2026-10-01", 8, 9, "Cannaregio area", 45.4455, 12.3267, "walk", true),
  ],
  "2026-10-02": [
    p("2026-10-02", 0, 1, "Cannaregio area", 45.4455, 12.3267, "walk", true),
    p("2026-10-02", 1, 2, "Rialto Bridge", 45.438, 12.3359, "walk"),
    p("2026-10-02", 2, 3, "Piazza San Marco", 45.4342, 12.3385, "walk"),
    p("2026-10-02", 3, 4, "Palazzo Ducale", 45.4337, 12.3404, "walk"),
    p("2026-10-02", 4, 5, "Basilica di San Marco", 45.4346, 12.3397, "walk"),
    p("2026-10-02", 6, 6, "Venezia Santa Lucia", 45.441, 12.321, "walk"),
    p("2026-10-02", 7, 7, "Firenze SMN", 43.7764, 11.2478, "train"),
    p("2026-10-02", 8, 8, "Santa Croce area", 43.7683, 11.2624, "walk", true),
    p("2026-10-02", 9, 9, "Piazzale Michelangelo", 43.7629, 11.2651, "walk"),
    p("2026-10-02", 10, 10, "Ponte Vecchio", 43.768, 11.2531, "walk"),
  ],
  "2026-10-03": [
    p("2026-10-03", 0, 1, "Santa Croce area", 43.7683, 11.2624, "walk", true),
    p("2026-10-03", 1, 2, "Florence Duomo", 43.7731, 11.256, "walk"),
    p("2026-10-03", 2, 3, "Firenze SMN", 43.7764, 11.2478, "walk"),
    p("2026-10-03", 3, 4, "Roma Termini", 41.901, 12.5018, "train"),
    p(
      "2026-10-03",
      4,
      5,
      "Colosseo / Monti area",
      41.891,
      12.493,
      "transfer",
      true,
    ),
    p("2026-10-03", 5, 6, "Vatican Museums entrance", 41.9065, 12.4536, "walk"),
    p("2026-10-03", 6, 7, "Sistine Chapel", 41.9029, 12.4545, "walk"),
    p("2026-10-03", 7, 8, "Ponte Sant'Angelo", 41.9014, 12.4663, "walk"),
    p("2026-10-03", 8, 9, "Piazza Navona", 41.8992, 12.4731, "walk"),
    p(
      "2026-10-03",
      10,
      10,
      "Via San Giovanni in Laterano area",
      41.8882,
      12.4972,
      "walk",
      true,
    ),
  ],
  "2026-10-04": [
    p("2026-10-04", 0, 1, "Colosseo", 41.8902, 12.4922, "walk"),
    p("2026-10-04", 1, 2, "Foro Romano", 41.8925, 12.4853, "walk"),
    p("2026-10-04", 2, 3, "Monti", 41.8958, 12.4931, "walk"),
    p("2026-10-04", 3, 4, "Piazza Venezia", 41.8958, 12.4823, "walk"),
    p("2026-10-04", 4, 5, "Piazza Navona", 41.8992, 12.4731, "walk"),
    p("2026-10-04", 5, 6, "Pantheon", 41.8986, 12.4769, "walk"),
    p("2026-10-04", 6, 7, "Sant'Ignazio", 41.8997, 12.479, "walk"),
    p("2026-10-04", 7, 8, "Trevi area", 41.9007, 12.4833, "walk"),
    p("2026-10-04", 8, 9, "Trevi Fountain", 41.9009, 12.4833, "walk"),
    p("2026-10-04", 9, 10, "Spanish Steps", 41.9059, 12.4823, "walk"),
    p("2026-10-04", 10, 11, "Via dei Fori Imperiali", 41.8938, 12.4887, "walk"),
  ],
  "2026-10-05": [
    p(
      "2026-10-05",
      0,
      1,
      "Colosseo / Monti area",
      41.891,
      12.493,
      "transfer",
      true,
    ),
    p("2026-10-05", 1, 2, "Fiumicino Airport", 41.8003, 12.2389, "train"),
    p("2026-10-05", 2, 3, "FCO check-in", 41.8003, 12.2389, "walk"),
    p("2026-10-05", 3, 4, "FCO airside", 41.7999, 12.2462, "walk"),
    p("2026-10-05", 4, 5, "Departure gate", 41.7999, 12.2462, "flight"),
  ],
};

export const tripOverview: TripMapPoint[] = [
  p("2026-09-27", 0, 1, "Zürich Flughafen", 47.4582, 8.5555, "flight"),
  p("2026-09-27", 1, 2, "Lungern", 46.7853, 8.1595, "train"),
  p("2026-09-27", 4, 3, "Lauterbrunnen", 46.5986, 7.9076, "train"),
  p("2026-09-28", 1, 4, "Interlaken", 46.6905, 7.869, "train"),
  p("2026-09-29", 1, 5, "Zermatt", 46.0243, 7.7478, "train"),
  p("2026-09-30", 2, 6, "Milan", 45.4863, 9.2045, "train"),
  p("2026-10-01", 7, 7, "Venice", 45.441, 12.321, "train"),
  p("2026-10-02", 7, 8, "Florence", 43.7764, 11.2478, "train"),
  p("2026-10-03", 3, 9, "Rome", 41.901, 12.5018, "train"),
  p("2026-10-05", 1, 10, "Fiumicino Airport", 41.8003, 12.2389, "flight"),
];
