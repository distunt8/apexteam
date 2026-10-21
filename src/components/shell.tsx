import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  ChevronDown,
  Gem,
  History,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  ShoppingBag,
  UserRound,
  Users,
  Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Wordmark } from "@/components/logo";
import { cn } from "@/lib/cn";
import { formatNumber, formatDateTime } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/labels";
import { isAdminRole, useStore, type Role } from "@/lib/store";

const TOP = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/activities", label: "Активности", icon: Zap },
  { to: "/colleagues", label: "Коллеги", icon: Users },
  { to: "/catalog", label: "Магазин", icon: ShoppingBag },
  { to: "/support", label: "Поддержка", icon: LifeBuoy },
] as const;

const SIDE = [
  { to: "/catalog", label: "Каталог" },
  { to: "/cart", label: "Корзина" },
  { to: "/orders", label: "Мои заказы" },
  { to: "/history", label: "История" },
  { to: "/profile", label: "Профиль" },
  { to: "/support", label: "Поддержка" },
] as const;

const BOTTOM = [
  { to: "/", label: "Главная", icon: Home },
  { to: "/activities", label: "Активности", icon: Zap },
  { to: "/catalog", label: "Магазин", icon: ShoppingBag },
  { to: "/profile", label: "Профиль", icon: UserRound },
] as const;

function activePath(path: string, to: string) {
  if (to === "/") return path === "/";
  return path === to || path.startsWith(`${to}/`);
}

export function Shell({
  mode,
  children,
}: {
  mode: "top" | "shop";
  children: ReactNode;
}) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const cartCount = useStore((state) => state.cart.reduce((sum, item) => sum + item.qty, 0));
  const unread = useStore((state) =>
    state.notices.filter((notice) => notice.userId === state.currentUserId && !notice.read).length,
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface text-ink">
      {mode === "top" ? (
        <header className="sticky top-0 z-20 border-b border-line bg-surface/95 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-4 px-4 sm:px-6">
            <Link to="/" className="shrink-0" aria-label="На главную">
              <Wordmark />
            </Link>
            <nav className="hidden items-center gap-1 lg:flex">
              {TOP.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm",
                    activePath(path, item.to) ? "font-semibold text-brand" : "text-ink hover:bg-card",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="ml-auto flex items-center gap-1 sm:gap-2">
              <BalanceMenu />
              <Notices unread={unread} />
              <UserMenu />
            </div>
          </div>
        </header>
      ) : (
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:hidden">
          <Link to="/" aria-label="На главную">
            <Wordmark className="h-8" />
          </Link>
          <div className="flex items-center gap-1">
            <Link to="/cart" className="relative grid size-11 place-items-center" aria-label="Корзина">
              <ShoppingBag className="size-5" />
              {cartCount > 0 ? (
                <span className="absolute top-1 right-1 grid min-w-5 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              ) : null}
            </Link>
            <BalanceMenu compact />
            <Notices unread={unread} />
            <UserMenu compact />
          </div>
        </header>
      )}

      <div className={cn(mode === "shop" && "lg:grid lg:grid-cols-[220px_minmax(0,1fr)]")}>
        {mode === "shop" ? (
          <aside className="hidden min-h-screen flex-col border-r border-line bg-sidebar px-4 py-6 lg:flex">
            <Link to="/" aria-label="На главную">
              <Wordmark />
            </Link>
            <nav className="mt-8 flex flex-col gap-1">
              {SIDE.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex min-h-11 items-center rounded-md px-3 text-[15px]",
                    activePath(path, item.to) ? "font-bold text-brand" : "text-ink hover:bg-surface",
                  )}
                >
                  {item.label}
                  {item.to === "/cart" && cartCount > 0 ? (
                    <span className="ml-auto text-xs font-semibold text-brand">{cartCount}</span>
                  ) : null}
                </Link>
              ))}
              {isAdminRole(user.role) ? (
                <Link
                  to="/admin"
                  className={cn(
                    "flex min-h-11 items-center gap-2 rounded-md px-3 text-[15px]",
                    activePath(path, "/admin") ? "font-bold text-brand" : "text-ink hover:bg-surface",
                  )}
                >
                  <LayoutDashboard className="size-4" />
                  Администрирование
                </Link>
              ) : null}
            </nav>
            <div className="mt-auto space-y-3 pt-10">
              <div>
                <p className="text-sm text-muted">Личный баланс</p>
                <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-brand">
                  <Gem className="size-5" />
                  <span className="tabular">{formatNumber(user.balance)}</span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted">Рабочий · поощрения</p>
                <p className="mt-1 text-lg font-bold tabular">
                  <RewardAmount />
                </p>
              </div>
            </div>
          </aside>
        ) : null}
        <main className="mx-auto w-full min-w-0 max-w-[1200px] px-4 pt-5 pb-28 sm:px-6 lg:pb-10">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
        <ul className="grid h-16 grid-cols-4">
          {BOTTOM.map((item) => {
            const Icon = item.icon;
            const on = activePath(path, item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-full flex-col items-center justify-center gap-1 text-[11px]",
                    on ? "font-semibold text-brand" : "text-muted",
                  )}
                >
                  <Icon className="size-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

function RewardAmount() {
  const reward = useStore((state) => state.rewardBalance);
  if (reward == null) return <span className="text-base font-medium text-muted">нет доступа</span>;
  return <>{formatNumber(reward)}</>;
}

function BalanceMenu({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const reward = useStore((state) => state.rewardBalance);
  if (!user) return null;
  return (
    <div className="relative">
      <button
        type="button"
        className="flex min-h-11 items-center gap-1.5 rounded-md px-2 text-sm hover:bg-card"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Gem className="size-4 text-brand" />
        <span className="tabular font-semibold">{formatNumber(user.balance)}</span>
        {compact ? null : <span className="hidden text-muted sm:inline">баллов</span>}
        <ChevronDown className="size-3.5 text-muted" />
      </button>
      {open ? (
        <div className="absolute right-0 z-40 mt-1 w-64 rounded-lg border border-line bg-surface p-3 shadow-lg">
          <p className="text-xs text-muted">Личный баланс</p>
          <p className="mt-1 text-lg font-bold text-brand tabular">{formatNumber(user.balance)}</p>
          <p className="mt-3 text-xs text-muted">Рабочий баланс · поощрения</p>
          <p className="mt-1 text-lg font-bold tabular">
            {reward == null ? <span className="text-base font-medium text-muted">нет доступа</span> : formatNumber(reward)}
          </p>
          <p className="mt-2 text-xs text-muted">Покупки списывают личный. Поощрения — с рабочего.</p>
        </div>
      ) : null}
    </div>
  );
}

function Notices({ unread }: { unread: number }) {
  const [open, setOpen] = useState(false);
  const userId = useStore((state) => state.currentUserId);
  const noticeList = useStore((state) => state.notices);
  const notices = noticeList.filter((notice) => notice.userId === userId).slice(0, 8);
  const mark = useStore((state) => state.markNoticesRead);

  return (
    <div className="relative">
      <button
        type="button"
        className="relative grid size-11 place-items-center rounded-md hover:bg-card"
        aria-label="Уведомления"
        onClick={() => {
          setOpen((value) => !value);
          mark();
        }}
      >
        <Bell className="size-5" />
        {unread > 0 ? (
          <span className="absolute top-2 right-2 size-2 rounded-full bg-brand" />
        ) : null}
      </button>
      {open ? (
        <div className="absolute right-0 z-40 mt-1 w-[min(100vw-2rem,22rem)] rounded-lg border border-line bg-surface p-2 shadow-lg">
          {notices.length === 0 ? (
            <p className="px-2 py-4 text-sm text-muted">Пока пусто</p>
          ) : (
            <ul className="max-h-80 space-y-1 overflow-auto">
              {notices.map((notice) => (
                <li key={notice.id} className="rounded-md px-2 py-2 text-sm hover:bg-card">
                  <p>{notice.text}</p>
                  <p className="mt-1 text-xs text-muted">{formatDateTime(notice.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}

function UserMenu({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const logout = useStore((state) => state.logout);
  if (!user) return null;
  const title = user.roleTitle || ROLE_LABEL[user.role];

  return (
    <div className="relative">
      <button
        type="button"
        className="flex min-h-11 items-center gap-2 rounded-md px-2 hover:bg-card"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="grid size-8 place-items-center rounded-full bg-brand-wash text-xs font-bold text-brand-deep">
          {user.name
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0])
            .join("")}
        </span>
        {compact ? null : (
          <span className="hidden text-left sm:block">
            <span className="block max-w-40 truncate text-sm leading-tight">{user.name}</span>
            <span className="block text-xs text-muted">{title}</span>
          </span>
        )}
      </button>
      {open ? (
        <div className="absolute right-0 z-40 mt-1 w-64 rounded-lg border border-line bg-surface p-2 shadow-lg">
          <p className="px-2 pt-1 text-sm font-medium">{user.name}</p>
          <p className="px-2 pb-1 text-xs text-muted">{title}</p>
          <div className="my-1 h-px bg-line" />
          <MenuLink to="/history" icon={<History className="size-4" />} label="История" onDone={() => setOpen(false)} />
          <MenuLink to="/orders" icon={<ShoppingBag className="size-4" />} label="Заказы" onDone={() => setOpen(false)} />
          <MenuLink to="/support" icon={<LifeBuoy className="size-4" />} label="Поддержка" onDone={() => setOpen(false)} />
          {isAdminRole(user.role) ? (
            <MenuLink
              to="/admin"
              icon={<LayoutDashboard className="size-4" />}
              label="Администрирование"
              onDone={() => setOpen(false)}
            />
          ) : null}
          <button
            type="button"
            className="mt-1 flex w-full min-h-10 items-center gap-2 rounded-md px-2 text-left text-sm hover:bg-card"
            onClick={() => {
              logout();
              setOpen(false);
            }}
          >
            <LogOut className="size-4" />
            Выйти
          </button>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({
  to,
  label,
  icon,
  onDone,
}: {
  to: "/" | "/history" | "/orders" | "/support" | "/admin";
  label: string;
  icon: ReactNode;
  onDone: () => void;
}) {
  return (
    <Link to={to} onClick={onDone} className="flex min-h-10 items-center gap-2 rounded-md px-2 text-sm hover:bg-card">
      {icon}
      {label}
    </Link>
  );
}

export function roleTone(role: Role) {
  return ROLE_LABEL[role];
}
