import puppeteer from "puppeteer";

const baseUrl = process.env.SITE_URL || "http://127.0.0.1:4173";

const checks = [
  { path: "/", scripts: 1, canvas: true, viewport: { width: 1280, height: 900 } },
  { path: "/", scripts: 1, canvas: true, dark: true, viewport: { width: 390, height: 844, deviceScaleFactor: 2 } },
  { path: "/posts/", scripts: 0, viewport: { width: 1280, height: 900 } },
  { path: "/tags/", scripts: 0, dark: true, viewport: { width: 1280, height: 900 } },
  { path: "/posts/rc-s380-blank-tag/", scripts: 0, viewport: { width: 1280, height: 900 } },
  { path: "/posts/rc-s380-blank-tag/", scripts: 0, viewport: { width: 390, height: 844, deviceScaleFactor: 2 } },
  { path: "/posts/debian-woody-hurd-vm/", scripts: 0, viewport: { width: 390, height: 844, deviceScaleFactor: 2 } },
  { path: "/posts/godot-package-lag-opensuse/", scripts: 0, viewport: { width: 390, height: 844, deviceScaleFactor: 2 } },
  { path: "/404.html", scripts: 0, viewport: { width: 1280, height: 900 } },
];

const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium";
const browser = await puppeteer.launch({
  executablePath,
  args: ["--no-sandbox"],
});

const failures = [];

for (const check of checks) {
  const page = await browser.newPage();
  await page.setViewport({ deviceScaleFactor: 1, ...check.viewport });
  await page.emulateMediaFeatures([
    { name: "prefers-color-scheme", value: check.dark ? "dark" : "light" },
  ]);

  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto(new URL(check.path, baseUrl).toString(), { waitUntil: "networkidle0" });
  const result = await page.evaluate(() => {
    const canvas = document.querySelector("canvas");
    let canvasNonblank = false;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        const image = context.getImageData(
          0,
          0,
          Math.min(canvas.width, 80),
          Math.min(canvas.height, 80),
        ).data;
        for (let i = 3; i < image.length; i += 4) {
          if (image[i] > 0) {
            canvasNonblank = true;
            break;
          }
        }
      }
    }

    return {
      h1: document.querySelector("h1")?.textContent?.trim() ?? "",
      scripts: document.querySelectorAll("script").length,
      leakedLunaAttrs: document.querySelectorAll("[luna\\:wc-url], [luna\\:wc-trigger]").length,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      canvasNonblank,
    };
  });

  const prefix = `${check.path} (${check.dark ? "dark" : "light"}, ${check.viewport.width}px)`;
  if (errors.length > 0) failures.push(`${prefix}: console/page errors: ${errors.join("; ")}`);
  if (result.scripts !== check.scripts) {
    failures.push(`${prefix}: expected ${check.scripts} script(s), got ${result.scripts}`);
  }
  if (result.leakedLunaAttrs !== 0) {
    failures.push(`${prefix}: leaked ${result.leakedLunaAttrs} luna:* attribute(s)`);
  }
  if (result.scrollWidth > result.clientWidth) {
    failures.push(`${prefix}: horizontal overflow ${result.scrollWidth} > ${result.clientWidth}`);
  }
  if (check.canvas && !result.canvasNonblank) {
    failures.push(`${prefix}: automaton canvas is blank`);
  }

  console.log(`${prefix}: ${result.h1 || "(no h1)"}`);
  await page.close();
}

await browser.close();

if (failures.length > 0) {
  for (const failure of failures) console.error(`smoke failed: ${failure}`);
  process.exitCode = 1;
}
