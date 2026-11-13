import { useEffect, useState } from "react";

const MOON = "луна";
const MEME = "пиздец";

function typingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

export function EasterEggs() {
  const [moon, setMoon] = useState(false);
  const [meme, setMeme] = useState(false);

  useEffect(() => {
    let buffer = "";
    const onKey = (event: KeyboardEvent) => {
      if (typingTarget(event.target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.length !== 1) return;
      buffer = (buffer + event.key.toLowerCase()).slice(-16);
      if (buffer.endsWith(MOON)) {
        buffer = "";
        setMoon(true);
      } else if (buffer.endsWith(MEME)) {
        buffer = "";
        setMeme(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!moon) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) document.documentElement.classList.add("egg-tilt");
    const timer = window.setTimeout(() => {
      document.documentElement.classList.remove("egg-tilt");
      setMoon(false);
    }, 2600);
    return () => {
      window.clearTimeout(timer);
      document.documentElement.classList.remove("egg-tilt");
    };
  }, [moon]);

  return (
    <>
      {moon ? (
        <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden="true">
          <span className="egg-moon">🌕</span>
        </div>
      ) : null}
      {meme ? (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-black/55 p-4"
          onClick={() => setMeme(false)}
        >
          <div className="egg-card max-w-xs rounded-2xl bg-surface p-3 text-left shadow-xl">
            <img src="/rewards/note.jpg" alt="" className="aspect-square w-full rounded-xl object-cover" />
            <p className="mt-3 text-base font-bold">пиздец</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
