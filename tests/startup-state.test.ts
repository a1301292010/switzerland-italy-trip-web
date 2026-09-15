import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(
  new URL("../app/page.tsx", import.meta.url),
  "utf8",
);

test("navigation always starts on Today and does not restore trip-ui-v1", () => {
  assert.match(source, /useState<Tab>\("today"\)/);
  assert.doesNotMatch(source, /getItem\("trip-ui-v1"\)/);
  assert.doesNotMatch(source, /setItem\(\s*"trip-ui-v1"/);
  assert.match(source, /removeItem\("trip-ui-v1"\)/);
});

test("reload resets scrolling while preserving execution and prep state", () => {
  assert.match(source, /history\.scrollRestoration = "manual"/);
  assert.match(source, /scrollTo\(0, 0\)/);
  assert.match(source, /getItem\("trip-execution-v1"\)/);
  assert.match(source, /getItem\("trip-prep-v1"\)/);
});
