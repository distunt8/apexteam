import { UserAvatar } from "@/components/user-avatar";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronDown,
  Gem,
  History,
  Home,
  LayoutDashboard,
  LifeBuoy,
  LogOut,
  Menu,
  ShoppingBag,
  UserRound,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Wordmark } from "@/components/logo";
import { cn } from "@/lib/cn";
import { formatNumber, pointsLabel } from "@/lib/format";
import { ROLE_LABEL } from "@/lib/labels";
import { canOpenAdmin, hasWorkBalance, useStore, type Role } from "@/lib/store";

type NavTo =
  | "/"
  | "/activities"
  | "/my-activity"
  | "/colleagues"
  | "/catalog"
  | "/cart"
  | "/orders"
  | "/history"
  | "/support"
  | "/profile"
  | "/admin";

type NavLink = { to: NavTo; label: string };
type NavGroup = { id: string; label: string; icon: typeof Home; items: NavLink[] };

const NAV: Array<NavLink & { icon: typeof Home } | NavGroup> = [
  { to: "/", label: "Главная", icon: Home },
  {
    id: "activities",
    label: "Активности",
    icon: Zap,
    items: [
      { to: "/activities", label: "Все активности" },
      { to: "/my-activity", label: "Моя активность" },
    ],
  },
  { to: "/colleagues", label: "Коллеги", icon: Users },
  {
    id: "shop",
    label: "Магазин",
    icon: ShoppingBag,
    items: [
      { to: "/catalog", label: "Каталог" },
      { to: "/cart", label: "Корзина" },
      { to: "/orders", label: "Мои заказы" },
    ],
  },
  { to: "/history", label: "История", icon: History },
  { to: "/support", label: "Поддержка", icon: LifeBuoy },
  { to: "/profile", label: "Профиль", icon: UserRound },
];

function isGroup(item: (typeof NAV)[number]): item is NavGroup {
  return "items" in item;
}

function activePath(path: string, to: string) {
  if (to === "/") return path === "/";
  return path === to || path.startsWith(`${to}/`);
}

export function Shell({
  children,
}: {
  mode?: "top" | "shop";
  children: ReactNode;
}) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const cartCount = useStore((state) => state.cart.reduce((sum, item) => sum + item.qty, 0));
  const [open, setOpen] = useState(false);
  const [opened, setOpened] = useState<string | null>(null);

  if (!user) return null;

  const groupOpen = (group: NavGroup) =>
    opened === group.id || group.items.some((item) => activePath(path, item.to));

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-surface px-3 lg:hidden">
        <button type="button" className="grid size-11 place-items-center" aria-label="Меню" onClick={() => setOpen(true)}>
          <Menu className="size-5" />
        </button>
        <Link to="/" aria-label="На главную">
          <Wordmark className="h-8" />
        </Link>
        <UserMenu compact />
      </header>

      {open ? <button type="button" className="fixed inset-0 z-40 bg-black/40 lg:hidden" aria-label="Закрыть меню" onClick={() => setOpen(false)} /> : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-line bg-sidebar px-3 py-5 transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-2">
          <Link to="/" aria-label="На главную" onClick={() => setOpen(false)}>
            <Wordmark />
          </Link>
          <button type="button" className="grid size-10 place-items-center lg:hidden" aria-label="Закрыть" onClick={() => setOpen(false)}>
            <X className="size-5" />
          </button>
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1 overflow-y-auto">
          {NAV.map((item) => {
            if (!isGroup(item)) {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex min-h-11 items-center gap-2 rounded-md px-3 text-[15px]",
                    activePath(path, item.to) ? "bg-brand-wash font-bold text-brand" : "text-ink hover:bg-surface",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              );
            }
            const Icon = item.icon;
            const expanded = groupOpen(item);
            return (
              <div key={item.id}>
                <button
                  type="button"
                  className="flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-[15px] hover:bg-surface"
                  aria-expanded={expanded}
                  onClick={() => setOpened(expanded ? "" : item.id)}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  <ChevronDown className={cn("size-4 text-muted transition-transform", expanded && "rotate-180")} />
                </button>
                {expanded ? (
                  <div className="mb-1 ml-4 flex flex-col gap-0.5 border-l border-line pl-2">
                    {item.items.map((child) => (
                      <Link
                        key={child.to}
                        to={child.to}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex min-h-10 items-center rounded-md px-3 text-sm",
                          activePath(path, child.to) ? "font-bold text-brand" : "text-ink hover:bg-surface",
                        )}
                      >
                        {child.label}
                        {child.to === "/cart" && cartCount > 0 ? (
                          <span className="ml-auto text-xs font-semibold text-brand">{cartCount}</span>
                        ) : null}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
          {canOpenAdmin(user.role) ? (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className={cn(
                "flex min-h-11 items-center gap-2 rounded-md px-3 text-[15px]",
                activePath(path, "/admin") ? "bg-brand-wash font-bold text-brand" : "text-ink hover:bg-surface",
              )}
            >
              <LayoutDashboard className="size-4 shrink-0" />
              Администрирование
            </Link>
          ) : null}
        </nav>
        <div className="space-y-3 border-t border-line px-2 pt-4">
          <div>
            <p className="text-xs text-muted">Личный баланс</p>
            <p className="mt-1 flex items-center gap-2 text-xl font-bold text-brand">
              <Gem className="size-4" />
              <span className="tabular">{formatNumber(user.balance)}</span>
              <span className="text-sm font-medium text-muted">{pointsLabel(user.balance)}</span>
            </p>
          </div>
          {hasWorkBalance(user.role) ? (
            <div>
              <p className="text-xs text-muted">Рабочий · поощрения</p>
              <p className="mt-1 text-lg font-bold tabular">
                <RewardAmount />
              </p>
            </div>
          ) : null}
          <div className="hidden items-center gap-2 lg:flex">
            <UserAvatar user={user} className="size-8 text-xs" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.roleTitle || ROLE_LABEL[user.role]}</p>
            </div>
            <Logout />
          </div>
        </div>
      </aside>

      <main className="lg:pl-[260px]">
        <div className="mx-auto w-full min-w-0 max-w-[1100px] px-4 pt-5 pb-10 sm:px-6">{children}</div>
      </main>
    </div>
  );
}

function Logout() {
  const logout = useStore((state) => state.logout);
  return (
    <button type="button" className="grid size-10 place-items-center rounded-md hover:bg-surface" aria-label="Выйти" onClick={() => logout()}>
      <LogOut className="size-4" />
    </button>
  );
}

function RewardAmount() {
  const reward = useStore((state) => state.rewardBalance);
  if (reward == null) return <span className="text-base font-medium text-muted">нет доступа</span>;
  return <>{formatNumber(reward)}</>;
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
        aria-expanded={open}
      >
        <UserAvatar user={user} className="size-8 text-xs" />
        {compact ? null : <span className="hidden max-w-40 truncate text-sm sm:block">{user.name}</span>}
      </button>
      {open ? (
        <div className="absolute right-0 z-40 mt-1 w-56 rounded-lg border border-line bg-surface p-2 shadow-lg">
          <p className="px-2 pt-1 text-sm font-medium">{user.name}</p>
          <p className="px-2 pb-1 text-xs text-muted">{title}</p>
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

export function roleTone(role: Role) {
  return ROLE_LABEL[role];
}
