import { copyFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const source = "_build/wasm-gc/release/build/background/background.wasm";
const destination = "dist/assets/background.wasm";

mkdirSync(dirname(destination), { recursive: true });
copyFileSync(source, destination);
