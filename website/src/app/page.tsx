export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-foreground">
      <h1 className="text-4xl font-bold">がーと / gaato</h1>
      <p className="mt-4 text-lg text-center">
        Hi, I&apos;m がーと / gaato. I&apos;m learning English and Indonesian. I&apos;m a fan of hololive and I play GeoGuessr.
      </p>
      <ul className="mt-8 space-y-2">
        <li>
          <a className="text-blue-600 hover:underline" href="https://x.com/gaato__">X/Twitter (general)</a>
        </li>
        <li>
          <a className="text-blue-600 hover:underline" href="https://x.com/gaato11">X/Twitter (hololive)</a>
        </li>
        <li>
          <a className="text-blue-600 hover:underline" href="https://note.com/gaato">note</a>
        </li>
        <li>
          <a className="text-blue-600 hover:underline" href="https://github.com/gaato">GitHub</a>
        </li>
      </ul>
    </main>
  );
}
