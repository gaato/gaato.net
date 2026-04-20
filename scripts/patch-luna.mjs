import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const patches = [
  {
    path: ".mooncakes/mizchi/luna/src/luna/signal/signal.mbt",
    before: "let active = { val: true }",
    after: "let active : Ref[Bool] = { val: true }",
  },
  {
    path: ".mooncakes/mizchi/luna/src/luna/signal/store_bench.mbt",
    before: "let effect_runs = { val: 0 }",
    after: "let effect_runs : Ref[Int] = { val: 0 }",
  },
  {
    path: ".mooncakes/mizchi/luna/src/platform/dom/element/render.mbt",
    before: "let is_first = { val: true }",
    after: "let is_first : Ref[Bool] = { val: true }",
  },
];

for (const patch of patches) {
  const file = resolve(process.cwd(), patch.path);
  if (!existsSync(file)) {
    continue;
  }

  const source = readFileSync(file, "utf8");
  const updated = source.includes(patch.before)
    ? source.replaceAll(patch.before, patch.after)
    : source;

  if (!updated.includes(patch.after)) {
    throw new Error(`failed to patch ${patch.path}`);
  }

  if (updated !== source) {
    writeFileSync(file, updated);
  }

  console.log(`patched ${patch.path}`);
}
