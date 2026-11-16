import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button, Field, Panel, TextInput } from "@/components/ui";
import { useStore } from "@/lib/store";
import { useTheme, type ThemeChoice } from "@/lib/theme";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  return (
    <Shell>
      <h1 className="text-3xl font-bold tracking-tight">Настройки</h1>
      <p className="mt-2 text-sm text-muted">Тема и пароль. Остальной профиль остаётся на своей странице.</p>
      <Link to="/profile" className="mt-3 inline-block text-sm font-semibold text-brand">
        Вернуться в профиль
      </Link>
      <ThemeSwitch />
      <PasswordCard />
    </Shell>
  );
}

function ThemeSwitch() {
  const { choice, setChoice } = useTheme();
  const options: { id: ThemeChoice; label: string }[] = [
    { id: "system", label: "Как в системе" },
    { id: "light", label: "Светлая" },
    { id: "dark", label: "Тёмная" },
  ];
  return (
    <Panel className="mt-5">
      <p className="text-sm font-medium">Тема</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setChoice(option.id)}
            className={`min-h-11 rounded-md px-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
              choice === option.id ? "bg-brand text-white" : "bg-card text-ink"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </Panel>
  );
}

function PasswordCard() {
  const changePassword = useStore((state) => state.changePassword);
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <Panel className="mt-4">
      <h2 className="text-lg font-bold">Пароль</h2>
      <form
        className="mt-3 grid gap-3 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (password.length < 6) {
            toast.error("Пароль должен быть не короче 6 символов");
            return;
          }
          if (password === current) {
            toast.error("Новый пароль совпадает с текущим");
            return;
          }
          if (password !== again) {
            toast.error("Пароли не совпадают");
            return;
          }
          setPending(true);
          void changePassword(password, current).then((result) => {
            setPending(false);
            if (!result.ok) toast.error(result.error);
            else {
              toast.success("Пароль изменён");
              setCurrent("");
              setPassword("");
              setAgain("");
            }
          });
        }}
      >
        <Field label="Текущий пароль">
          <TextInput type="password" autoComplete="current-password" value={current} onChange={(event) => setCurrent(event.target.value)} required />
        </Field>
        <Field label="Новый пароль">
          <TextInput type="password" autoComplete="new-password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required />
        </Field>
        <Field label="Повтор">
          <TextInput type="password" autoComplete="new-password" value={again} onChange={(event) => setAgain(event.target.value)} required />
        </Field>
        <div className="flex items-end">
          <Button type="submit" disabled={pending}>
            {pending ? "Сохраняем…" : "Сменить пароль"}
          </Button>
        </div>
      </form>
    </Panel>
  );
}
