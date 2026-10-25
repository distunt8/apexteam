import { useEffect, useState, type ReactNode } from "react";
import { Wordmark } from "@/components/logo";
import { Button, Field, TextInput } from "@/components/ui";
import { useStore } from "@/lib/store";

export function SessionGate({ children }: { children: ReactNode }) {
  const session = useStore((state) => state.session);
  const sessionError = useStore((state) => state.sessionError);
  const mustChangePassword = useStore((state) => state.mustChangePassword);
  const boot = useStore((state) => state.boot);

  useEffect(() => {
    void useStore.persist.rehydrate();
    void boot();
  }, [boot]);

  if (session === "ready" && mustChangePassword) return <ForcePassword />;
  if (session === "ready") return children;
  if (session === "loading") {
    return (
      <Screen>
        <Wordmark className="h-12" />
        <p className="mt-6 text-sm text-muted">Входим…</p>
      </Screen>
    );
  }
  return <Login error={sessionError} />;
}

function Screen({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-4 py-10 text-ink">
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

function Login({ error }: { error: string }) {
  const login = useStore((state) => state.login);
  const boot = useStore((state) => state.boot);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <Screen>
      <Wordmark className="h-12" />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Вход в Апекс</h1>
      <form
        className="mt-6 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          setPending(true);
          void login(email, password).finally(() => setPending(false));
        }}
      >
        <Field label="Почта">
          <TextInput
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>
        <Field label="Пароль">
          <TextInput
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Field>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Входим…" : "Войти"}
        </Button>
        {error ? (
          <button type="button" className="w-full text-sm font-semibold text-brand" onClick={() => void boot()}>
            Повторить
          </button>
        ) : null}
      </form>
    </Screen>
  );
}

function ForcePassword() {
  const changePassword = useStore((state) => state.changePassword);
  const logout = useStore((state) => state.logout);
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <Screen>
      <Wordmark className="h-12" />
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Смените пароль</h1>
      <p className="mt-2 text-sm text-muted">Это первый вход. Придумайте свой пароль, временный больше не подойдёт.</p>
      <form
        className="mt-6 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (password !== again) {
            setError("Пароли не совпадают");
            return;
          }
          setPending(true);
          setError("");
          void changePassword(password).then((result) => {
            setPending(false);
            if (!result.ok) setError(result.error);
          });
        }}
      >
        <Field label="Новый пароль">
          <TextInput type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </Field>
        <Field label="Ещё раз">
          <TextInput type="password" autoComplete="new-password" value={again} onChange={(event) => setAgain(event.target.value)} required />
        </Field>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={pending}>
          Сохранить пароль
        </Button>
        <button type="button" className="w-full text-sm font-semibold text-brand" onClick={() => logout()}>
          Выйти
        </button>
      </form>
    </Screen>
  );
}
