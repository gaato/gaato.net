import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const vnu = require("vnu-jar");

const result = spawnSync(
  "java",
  ["-jar", vnu, "--skip-non-html", "--also-check-css", "--errors-only", "dist"],
  { stdio: "inherit" },
);

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
