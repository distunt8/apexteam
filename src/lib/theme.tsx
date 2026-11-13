import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeChoice = "system" | "light" | "dark";

const KEY = "apex.theme";

export const THEME_BOOT = `(function(){try{var t=localStorage.getItem("${KEY}");if(t==="dark"||t==="light")document.documentElement.classList.add(t);}catch(e){}})();`;

export function readChoice(): ThemeChoice {
  if (typeof window === "undefined") return "system";
  const saved = window.localStorage.getItem(KEY);
  return saved === "light" || saved === "dark" ? saved : "system";
}

export function applyChoice(choice: ThemeChoice) {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  if (choice === "light" || choice === "dark") root.classList.add(choice);
}

function systemDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolvedTheme(choice: ThemeChoice): "light" | "dark" {
  if (choice === "dark") return "dark";
  if (choice === "light") return "light";
  return systemDark() ? "dark" : "light";
}

const ThemeContext = createContext<{
  choice: ThemeChoice;
  resolved: "light" | "dark";
  setChoice: (choice: ThemeChoice) => void;
}>({
  choice: "system",
  resolved: "light",
  setChoice: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoiceState] = useState<ThemeChoice>("system");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = readChoice();
    setChoiceState(stored);
    applyChoice(stored);
    setResolved(resolvedTheme(stored));
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readChoice() !== "system") return;
      setResolved(media.matches ? "dark" : "light");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setChoice = (next: ThemeChoice) => {
    window.localStorage.setItem(KEY, next);
    applyChoice(next);
    setChoiceState(next);
    setResolved(resolvedTheme(next));
  };

  return <ThemeContext.Provider value={{ choice, resolved, setChoice }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
