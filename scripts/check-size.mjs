import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const budgets = [
  { label: "HTML", pattern: /\.html$/, limit: 10 * 1024 },
  { label: "CSS gzip", pattern: /\.css$/, limit: 6 * 1024, gzip: true },
  { label: "initial JS gzip", pattern: /\.js$/, limit: 4 * 1024, gzip: true },
  { label: "WASM gzip", pattern: /\.wasm$/, limit: 5 * 1024, gzip: true },
];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });
}

const files = walk("dist");
let failed = false;

for (const budget of budgets) {
  const matched = files.filter((file) => budget.pattern.test(file));
  if (matched.length === 0) {
    console.error(`size budget failed: no ${budget.label} asset found`);
    failed = true;
    continue;
  }

  for (const file of matched) {
    const size = budget.gzip ? gzipSync(readFileSync(file)).length : statSync(file).size;
    if (size > budget.limit) {
      console.error(
        `size budget failed: ${file} is ${size} bytes, limit is ${budget.limit} bytes (${budget.label})`,
      );
      failed = true;
    }
  }
}

if (failed) {
  process.exitCode = 1;
}
