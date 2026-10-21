export function formatNumber(value: number) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function pointsLabel(value: number) {
  const abs = Math.abs(value) % 100;
  const digit = abs % 10;
  if (abs > 10 && abs < 20) return "баллов";
  if (digit === 1) return "балл";
  if (digit >= 2 && digit <= 4) return "балла";
  return "баллов";
}

export function formatPoints(value: number) {
  return `${formatNumber(value)} ${pointsLabel(value)}`;
}

const MONTHS = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];

export function formatDate(iso: string) {
  const date = new Date(iso);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatDateTime(iso: string) {
  const date = new Date(iso);
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${formatDate(iso)}, ${hh}:${mm}`;
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function greetingFor(firstName: string, date = new Date()) {
  const hour = date.getHours();
  const hello = hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
  return `${hello}, ${firstName}!`;
}

export function firstName(full: string) {
  return full.split(" ")[0] ?? full;
}

export function initials(full: string) {
  return full
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}
