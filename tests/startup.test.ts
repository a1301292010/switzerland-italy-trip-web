import assert from "node:assert/strict";
import test from "node:test";
import {
  selectInitialDayIndex,
  TRIP_END,
  TRIP_START,
} from "../data/trip-startup.ts";

const dates = [
  "2026-09-27",
  "2026-09-28",
  "2026-09-29",
  "2026-09-30",
  "2026-10-01",
  "2026-10-02",
  "2026-10-03",
  "2026-10-04",
  "2026-10-05",
];

test("before the trip opens Day 1", () => {
  assert.equal(selectInitialDayIndex(dates, "2026-09-15"), 0);
  assert.equal(dates[0], TRIP_START);
});

test("a travel date opens its matching day", () => {
  assert.equal(selectInitialDayIndex(dates, "2026-10-02"), 5);
});

test("after the trip opens the final day", () => {
  assert.equal(selectInitialDayIndex(dates, "2026-10-06"), 8);
  assert.equal(dates.at(-1), TRIP_END);
});
