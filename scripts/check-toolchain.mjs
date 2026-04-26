import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const miseToml = readFileSync(new URL("../mise.toml", import.meta.url), "utf8");

function readTomlString(key) {
  const match = miseToml.match(new RegExp(`^${key}\\s*=\\s*"([^"]+)"`, "m"));
  if (!match) {
    throw new Error(`missing ${key} in mise.toml`);
  }
  return match[1];
}

function run(command, args = []) {
  const result = spawnSync(command, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  const output = `${result.stdout}${result.stderr}`.trim();
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed: ${output}`);
  }
  return output;
}

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

const expected = {
  bun: readTomlString("bun"),
  node: readTomlString("node"),
  java: readTomlString("java").replace(/^temurin-/, ""),
  moonbit: readTomlString("moonbit"),
};

const actual = {
  bun: run("bun", ["--version"]),
  node: run("node", ["--version"]).replace(/^v/, ""),
  java: run("java", ["-version"]).split("\n")[0],
  moon: run("moon", ["version"]),
};

if (!actual.bun.startsWith(`${expected.bun}.`)) {
  fail(`bun version mismatch: expected ${expected.bun}.x, got ${actual.bun}`);
}

if (!actual.node.startsWith(`${expected.node}.`)) {
  fail(`node version mismatch: expected ${expected.node}.x, got ${actual.node}`);
}

if (!actual.java.includes(`"${expected.java}`)) {
  fail(`java version mismatch: expected ${expected.java}.x, got ${actual.java}`);
}

if (process.exitCode) {
  process.exit();
}

console.log(`bun ${actual.bun}`);
console.log(`node ${actual.node}`);
console.log(actual.java);
console.log(actual.moon);
