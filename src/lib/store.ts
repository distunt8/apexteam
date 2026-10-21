import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { todayKey } from "@/lib/format";
import {
  ApexError,
  apex,
  extractToken,
  loadWorkspace,
  readToken,
  shapeOf,
  statusToApi,
  writeToken,
} from "@/lib/apex";

export type Role = "employee" | "manager" | "admin" | "chief";
export type Category = string;
export type OrderStatus = "created" | "processing" | "ready" | "issued" | "cancelled";
export type TicketStatus = "open" | "answered" | "closed";
export type ActivityKind = "steps" | "streak" | "quiz" | "once";
export type ActivityCategory = "survey" | "challenge" | "event";
export type EntryType =
  | "activity_reward"
  | "recognition_sent"
  | "recognition_received"
  | "manager_award"
  | "purchase"
  | "refund"
  | "admin_adjustment";

export type SessionPhase = "unknown" | "anon" | "loading" | "ready" | "error";

export interface Person {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  avatarUrl?: string;
  position: string;
  department: string;
  role: Role;
  roleCodes?: string[];
  roleTitle?: string;
  balance: number;
  score: number;
  budget: number;
  budgetLimit: number;
  status: "active" | "blocked";
}

export interface CategoryRow {
  id: string;
  name: string;
  sort: number;
}

export interface RoleOption {
  code: string;
  name: string;
}

export interface BoardRow {
  id: string;
  name: string;
  score: number;
}

export interface Product {
  id: string;
  category: string;
  categoryName?: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  image: string;
  popular?: boolean;
  isDigital?: boolean;
}

export interface CartItem {
  lineId: string;
  productId: string;
  qty: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  userId: string;
  type: EntryType;
  amount: number;
  reason: string;
  counterpartyId?: string;
  createdAt: string;
  actorId?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  kind: ActivityKind;
  reward: number;
  target: number;
  active: boolean;
  builtin?: boolean;
}

export interface Progress {
  userId: string;
  activityId: string;
  period: string;
  value: number;
  rewarded: boolean;
  meta?: string;
}

export interface FeedItem {
  id: string;
  fromId: string;
  toId: string;
  fromName?: string;
  toName?: string;
  amount: number;
  message: string;
  kind: "peer" | "manager";
  createdAt: string;
}

export interface TicketMessage {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  status: TicketStatus;
  createdAt: string;
  messages: TicketMessage[];
}

export interface Notice {
  id: string;
  userId: string;
  text: string;
  read: boolean;
  createdAt: string;
}

export interface AppState {
  session: SessionPhase;
  sessionError: string;
  currentUserId: string;
  people: Person[];
  products: Product[];
  categories: CategoryRow[];
  roleCatalog: RoleOption[];
  leaderboard: BoardRow[];
  rewardBalance: number | null;
  apiWarnings: string[];
  cart: CartItem[];
  orders: Order[];
  ledger: LedgerEntry[];
  activities: Activity[];
  progress: Progress[];
  feed: FeedItem[];
  tickets: Ticket[];
  notices: Notice[];
  seq: number;
}

export type Result = { ok: true } | { ok: false; error: string };

const seed = (): AppState => ({
  session: "unknown",
  sessionError: "",
  currentUserId: "",
  seq: 100,
  people: [],
  products: [],
  categories: [],
  roleCatalog: [],
  leaderboard: [],
  rewardBalance: null,
  apiWarnings: [],
  cart: [],
  orders: [],
  ledger: [],
    activities: [
    {
      id: "act-steps",
      title: "8 000 шагов",
      description: "Дневная цель. В прототипе шаги приходят из демонстрационного источника, без Health Connect.",
      category: "challenge",
      kind: "steps",
      reward: 80,
      target: 8000,
      active: true,
      builtin: true,
    },
    {
      id: "act-streak",
      title: "7 дней активности",
      description: "Заходите и отмечайте день. На седьмой день — разовая награда.",
      category: "challenge",
      kind: "streak",
      reward: 300,
      target: 7,
      active: true,
      builtin: true,
    },
    {
      id: "act-team",
      title: "Команда в движении",
      description: "Общий челлендж подразделения. Отметьте участие — команда ближе к призу.",
      category: "challenge",
      kind: "once",
      reward: 20,
      target: 1,
      active: true,
      builtin: true,
    },
    {
      id: "act-quiz",
      title: "Сколько в тебе хайпа?",
      description: "Короткий опрос о том, как устроена команда. Нужны 2 верных ответа из 3.",
      category: "survey",
      kind: "quiz",
      reward: 10,
      target: 1,
      active: true,
      builtin: true,
    },
    {
      id: "act-meetup",
      title: "Внутренний митап",
      description: "Подтвердите участие во встрече пятницы. Начисление один раз.",
      category: "event",
      kind: "once",
      reward: 40,
      target: 1,
      active: true,
      builtin: true,
    },
  ],
  progress: [],
  feed: [],
  tickets: [],
  notices: [],
});

function nextId(state: AppState, prefix: string) {
  state.seq += 1;
  return `${prefix}-${state.seq}`;
}

function person(state: AppState, id: string) {
  return state.people.find((item) => item.id === id);
}

function pushNotice(state: AppState, userId: string, text: string) {
  state.notices.unshift({
    id: nextId(state, "n"),
    userId,
    text,
    read: false,
    createdAt: new Date().toISOString(),
  });
}

export function isAdminRole(role: Role) {
  return role === "admin" || role === "chief";
}

export function awardAmounts(role: Role) {
  if (role === "employee") return [10, 20, 30, 50];
  return [50, 100, 200, 500];
}

interface Actions {
  boot: () => Promise<void>;
  login: (email: string, password: string) => Promise<Result>;
  logout: () => void;
  refresh: () => Promise<void>;
  addToCart: (productId: string) => Promise<Result>;
  setQty: (productId: string, qty: number) => Promise<Result>;
  checkout: () => Promise<Result>;
  completeSteps: () => Result;
  checkIn: () => Result;
  completeOnce: (activityId: string) => Result;
  submitQuiz: (correct: number) => Result;
  sendRecognition: (input: { toId: string; amount: number; message: string; asManager?: boolean }) => Promise<Result>;
  createTicket: (subject: string, text: string) => Result;
  replyTicket: (ticketId: string, text: string) => Result;
  setTicketStatus: (ticketId: string, status: TicketStatus) => Result;
  setOrderStatus: (orderId: string, status: string) => Promise<Result>;
  saveProduct: (product: Product) => Promise<Result>;
  adjustBalance: (input: {
    userId: string;
    amount: number;
    reason: string;
    balanceType?: "Personal" | "Reward";
  }) => Promise<Result>;
  setUserRole: (userId: string, roleCode: string) => Promise<Result>;
  setUserStatus: (userId: string, status: Person["status"]) => Promise<Result>;
  saveActivity: (activity: Activity) => void;
  markNoticesRead: () => void;
}

function findProgress(state: AppState, userId: string, activityId: string, period: string) {
  return state.progress.find(
    (item) => item.userId === userId && item.activityId === activityId && item.period === period,
  );
}

function rewardOnce(state: AppState, user: Person, activity: Activity, _reason: string): Result {
  pushNotice(
    state,
    user.id,
    `«${activity.title}» отмечено на этом устройстве. Баллы на сервере не меняются — активности пока не в базе.`,
  );
  return { ok: true };
}

let booting: Promise<void> | null = null;

async function commit(set: (partial: Partial<AppState>) => void, run: () => Promise<void>): Promise<Result> {
  try {
    await run();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Не получилось" };
  }
  try {
    set(await loadWorkspace());
  } catch (error) {
    if (error instanceof ApexError && error.status === 401) {
      writeToken(null);
      set({ session: "anon", sessionError: "Сессия закончилась. Войдите снова." });
      return { ok: false, error: "Сессия закончилась. Войдите снова." };
    }
  }
  return { ok: true };
}

export const useStore = create<AppState & Actions>()(
  persist(
    immer((set, get) => ({
      ...seed(),
      boot: async () => {
        if (get().session === "ready") return;
        if (booting) return booting;
        booting = (async () => {
          if (!readToken()) {
            set({ session: "anon", sessionError: "" });
            return;
          }
          set({ session: "loading", sessionError: "" });
          try {
            const workspace = await loadWorkspace();
            set({ ...workspace, session: "ready", sessionError: "" });
          } catch (error) {
            if (error instanceof ApexError && error.status === 401) {
              writeToken(null);
              set({ session: "anon", sessionError: "Сессия закончилась. Войдите снова." });
              return;
            }
            set({
              session: "error",
              sessionError: error instanceof Error ? error.message : "Не удалось открыть данные.",
            });
          }
        })().finally(() => {
          booting = null;
        });
        return booting;
      },
      login: async (email, password) => {
        set({ session: "loading", sessionError: "" });
        try {
          const data = await apex("/api/Auth/login", {
            method: "POST",
            body: JSON.stringify({ email: email.trim(), password }),
          });
          const token = extractToken(data);
          if (!token) {
            const message = `Вход прошёл, но токен не найден. Поля ответа: ${shapeOf(data)}.`;
            set({ session: "anon", sessionError: message });
            return { ok: false as const, error: message };
          }
          writeToken(token);
          const workspace = await loadWorkspace();
          set({ ...workspace, session: "ready", sessionError: "" });
          return { ok: true as const };
        } catch (error) {
          writeToken(null);
          const failedAfterToken = error instanceof ApexError && error.status === 500;
          const message = failedAfterToken
            ? "Пароль верный, но база падает с ошибкой 500 на любом запросе с токеном. Это сбой сервера, не сайта."
            : error instanceof Error
              ? error.message
              : "Не удалось войти";
          set({ session: "anon", sessionError: message });
          return { ok: false as const, error: message };
        }
      },
      logout: () => {
        writeToken(null);
        set({
          session: "anon",
          sessionError: "",
          currentUserId: "",
          people: [],
          products: [],
          categories: [],
          roleCatalog: [],
          leaderboard: [],
          rewardBalance: null,
          apiWarnings: [],
          cart: [],
          orders: [],
          ledger: [],
          feed: [],
        });
      },
      refresh: async () => {
        const workspace = await loadWorkspace();
        set({ ...workspace, session: "ready", sessionError: "" });
      },
      addToCart: async (productId) => {
        const state = get();
        const product = state.products.find((item) => item.id === productId);
        if (!product || !product.active) return { ok: false as const, error: "Товар недоступен" };
        if (product.stock <= 0) return { ok: false as const, error: "Нет в наличии" };
        const existing = state.cart.find((item) => item.productId === productId);
        const nextQty = (existing?.qty ?? 0) + 1;
        if (nextQty > product.stock) return { ok: false as const, error: "Больше, чем есть на складе" };
        return commit(set, async () => {
          if (existing?.lineId) {
            await apex(`/api/cart/items/${existing.lineId}`, {
              method: "PUT",
              body: JSON.stringify({ quantity: nextQty }),
            });
          } else {
            await apex("/api/cart/items", {
              method: "POST",
              body: JSON.stringify({ productId: Number(productId), quantity: 1 }),
            });
          }
        });
      },
      setQty: async (productId, qty) => {
        const line = get().cart.find((item) => item.productId === productId);
        if (!line?.lineId) return { ok: false as const, error: "Не нашёл строку корзины на сервере" };
        return commit(set, async () => {
          if (qty <= 0) await apex(`/api/cart/items/${line.lineId}`, { method: "DELETE" });
          else {
            await apex(`/api/cart/items/${line.lineId}`, {
              method: "PUT",
              body: JSON.stringify({ quantity: qty }),
            });
          }
        });
      },
      checkout: async () => {
        if (get().cart.length === 0) return { ok: false as const, error: "Корзина пуста" };
        return commit(set, async () => {
          await apex("/api/orders/checkout", { method: "POST" });
        });
      },
      completeSteps: () => {
        let result: Result = { ok: false, error: "Активность недоступна" };
        set((state) => {
          const user = person(state, state.currentUserId);
          const activity = state.activities.find((item) => item.id === "act-steps");
          if (!user || !activity || !activity.active) return;
          const period = todayKey();
          let row = findProgress(state, user.id, activity.id, period);
          if (!row) {
            row = { userId: user.id, activityId: activity.id, period, value: 0, rewarded: false };
            state.progress.push(row);
          }
          if (row.rewarded) {
            result = { ok: false, error: "Баллы за шаги сегодня уже начислены" };
            return;
          }
          row.value = activity.target;
          row.rewarded = true;
          result = rewardOnce(state, user, activity, "Дневная цель шагов");
          return;
        });
        return result;
      },
      checkIn: () => {
        let result: Result = { ok: false, error: "Активность недоступна" };
        set((state) => {
          const user = person(state, state.currentUserId);
          const activity = state.activities.find((item) => item.id === "act-streak");
          if (!user || !activity || !activity.active) return;
          const today = todayKey();
          let row = findProgress(state, user.id, activity.id, "streak");
          if (!row) {
            row = {
              userId: user.id,
              activityId: activity.id,
              period: "streak",
              value: 0,
              rewarded: false,
            };
            state.progress.push(row);
          }
          if (row.meta === today) {
            result = { ok: false, error: "Сегодня вы уже отметились" };
            return;
          }
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const continues = row.meta === todayKey(yesterday);
          row.value = continues ? row.value + 1 : 1;
          row.meta = today;
          if (row.value >= activity.target && !row.rewarded) {
            row.rewarded = true;
            result = rewardOnce(state, user, activity, "Серия из 7 дней");
          } else {
            result = { ok: true };
          }
          return;
        });
        return result;
      },
      completeOnce: (activityId) => {
        let result: Result = { ok: false, error: "Активность недоступна" };
        set((state) => {
          const user = person(state, state.currentUserId);
          const activity = state.activities.find((item) => item.id === activityId && item.kind === "once");
          if (!user || !activity || !activity.active) return;
          let row = findProgress(state, user.id, activity.id, "once");
          if (row?.rewarded) {
            result = { ok: false, error: "Награда за это задание уже получена" };
            return;
          }
          if (!row) {
            row = { userId: user.id, activityId: activity.id, period: "once", value: 1, rewarded: true };
            state.progress.push(row);
          } else {
            row.value = 1;
            row.rewarded = true;
          }
          result = rewardOnce(state, user, activity, activity.title);
          return;
        });
        return result;
      },
      submitQuiz: (correct) => {
        let result: Result = { ok: false, error: "Опрос недоступен" };
        set((state) => {
          const user = person(state, state.currentUserId);
          const activity = state.activities.find((item) => item.id === "act-quiz");
          if (!user || !activity || !activity.active) return;
          const row = findProgress(state, user.id, activity.id, "once");
          if (row?.rewarded) {
            result = { ok: false, error: "Опрос уже пройден" };
            return;
          }
          if (correct < 2) {
            result = { ok: false, error: "Нужно минимум 2 верных ответа. Можно попробовать ещё раз" };
            return;
          }
          state.progress.push({
            userId: user.id,
            activityId: activity.id,
            period: "once",
            value: correct,
            rewarded: true,
          });
          result = rewardOnce(state, user, activity, "Опрос «Сколько в тебе хайпа?»");
          return;
        });
        return result;
      },
      sendRecognition: async ({ toId, amount, message, asManager }) => {
        const textMessage = message.trim();
        if (textMessage.length > 120) return { ok: false as const, error: "Сообщение длиннее 120 символов" };
        const state = get();
        const sender = state.people.find((item) => item.id === state.currentUserId);
        const recipient = state.people.find((item) => item.id === toId);
        if (!sender || !recipient) return { ok: false as const, error: "Сотрудник не найден" };
        if (sender.id === recipient.id) return { ok: false as const, error: "Нельзя поблагодарить самого себя" };
        if (recipient.status !== "active") return { ok: false as const, error: "Этому сотруднику сейчас нельзя отправить" };
        if (!Number.isInteger(amount) || amount <= 0) return { ok: false as const, error: "Укажите сумму" };
        const body: Record<string, unknown> = { toUserId: toId, amount };
        if (textMessage) body.message = textMessage;
        if (!asManager) body.isPublic = true;
        return commit(set, async () => {
          await apex(asManager ? "/api/thanks/manager-bonus" : "/api/thanks", {
            method: "POST",
            body: JSON.stringify(body),
          });
        });
      },
      createTicket: (subject, text) => {
        const title = subject.trim();
        const body = text.trim();
        if (title.length < 3) return { ok: false, error: "Укажите тему" };
        if (body.length < 5) return { ok: false, error: "Опишите вопрос" };
        set((state) => {
          const user = person(state, state.currentUserId);
          if (!user) return;
          const now = new Date().toISOString();
          state.tickets.unshift({
            id: nextId(state, "t"),
            userId: user.id,
            subject: title,
            status: "open",
            createdAt: now,
            messages: [{ id: nextId(state, "tm"), authorId: user.id, text: body, createdAt: now }],
          });
          return;
        });
        return { ok: true };
      },
      replyTicket: (ticketId, text) => {
        const body = text.trim();
        if (body.length < 2) return { ok: false, error: "Введите ответ" };
        let result: Result = { ok: false, error: "Недостаточно прав" };
        set((state) => {
          const actor = person(state, state.currentUserId);
          if (!actor || !isAdminRole(actor.role)) return;
          const ticket = state.tickets.find((item) => item.id === ticketId);
          if (!ticket) {
            result = { ok: false, error: "Обращение не найдено" };
            return;
          }
          ticket.messages.push({
            id: nextId(state, "tm"),
            authorId: actor.id,
            text: body,
            createdAt: new Date().toISOString(),
          });
          ticket.status = "answered";
          pushNotice(state, ticket.userId, `${actor.name} ответила на обращение «${ticket.subject}».`);
          result = { ok: true };
          return;
        });
        return result;
      },
      setTicketStatus: (ticketId, status) => {
        let result: Result = { ok: false, error: "Недостаточно прав" };
        set((state) => {
          const actor = person(state, state.currentUserId);
          if (!actor || !isAdminRole(actor.role)) return;
          const ticket = state.tickets.find((item) => item.id === ticketId);
          if (!ticket) return;
          ticket.status = status;
          result = { ok: true };
          return;
        });
        return result;
      },
      setOrderStatus: async (orderId, status) =>
        commit(set, async () => {
          await apex(`/api/orders/${orderId}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: statusToApi(status) }),
          });
        }),
      saveProduct: async (product) => {
        if (!product.title.trim()) return { ok: false as const, error: "Укажите название" };
        if (product.price < 0 || !Number.isInteger(product.price)) {
          return { ok: false as const, error: "Цена должна быть целым числом" };
        }
        if (product.stock < 0 || !Number.isInteger(product.stock)) {
          return { ok: false as const, error: "Остаток должен быть целым числом" };
        }
        const categoryId = Number(product.category);
        const body = {
          categoryId: Number.isInteger(categoryId) ? categoryId : null,
          name: product.title.trim(),
          description: product.description.trim(),
          price: product.price,
          imageUrl: product.image.startsWith("http") ? product.image : "",
          stock: product.stock,
          isActive: product.active,
          isDigital: Boolean(product.isDigital),
        };
        const isNew = !product.id || product.id === "new" || product.id.startsWith("p-");
        return commit(set, async () => {
          await apex(isNew ? "/api/products" : `/api/products/${product.id}`, {
            method: isNew ? "POST" : "PUT",
            body: JSON.stringify(body),
          });
        });
      },
      adjustBalance: async ({ userId, amount, reason, balanceType }) => {
        const why = reason.trim();
        if (!why) return { ok: false as const, error: "Укажите причину" };
        if (!Number.isInteger(amount) || amount === 0) {
          return { ok: false as const, error: "Сумма — целое число, не ноль" };
        }
        return commit(set, async () => {
          await apex("/api/admin/balances/adjust", {
            method: "POST",
            body: JSON.stringify({
              userId,
              type: balanceType ?? "Personal",
              amount,
              transactionType: "AdminAdjustment",
              description: why,
            }),
          });
        });
      },
      setUserRole: async (userId, roleCode) => {
        if (!roleCode) return { ok: false as const, error: "Выберите роль" };
        return commit(set, async () => {
          await apex(`/api/users/${userId}/roles`, {
            method: "PUT",
            body: JSON.stringify({ roleCodes: [roleCode] }),
          });
        });
      },
      setUserStatus: async (userId, status) => {
        const state = get();
        const target = state.people.find((item) => item.id === userId);
        if (!target || target.id === state.currentUserId) {
          return { ok: false as const, error: "Этого сотрудника нельзя изменить" };
        }
        return commit(set, async () => {
          await apex(`/api/users/${userId}`, {
            method: "PATCH",
            body: JSON.stringify({
              firstName: target.firstName ?? "",
              lastName: target.lastName ?? "",
              middleName: target.middleName ?? "",
              avatarUrl: target.avatarUrl ?? "",
              department: target.department,
              position: target.position,
              isActive: status === "active",
            }),
          });
        });
      },
      saveActivity: (activity) =>
        set((state) => {
          const actor = person(state, state.currentUserId);
          if (!actor || !isAdminRole(actor.role)) return;
          const index = state.activities.findIndex((item) => item.id === activity.id);
          const next = {
            ...activity,
            title: activity.title.trim(),
            reward: Math.max(0, Math.round(activity.reward)),
          };
          if (!next.title) return;
          if (index >= 0) state.activities[index] = { ...state.activities[index], ...next };
          else state.activities.push({ ...next, kind: "once", builtin: false, target: 1 });
          return;
        }),
      markNoticesRead: () =>
        set((state) => {
          for (const notice of state.notices) {
            if (notice.userId === state.currentUserId) notice.read = true;
          }
          return;
        }),
    })),
    {
      name: "apex-device-v1",
      skipHydration: true,
      partialize: (state) => ({
        activities: state.activities,
        progress: state.progress,
        tickets: state.tickets,
        notices: state.notices,
        seq: state.seq,
      }),
    },
  ),
);

export function useRehydrate() {
  const rehydrate = useStore.persist.rehydrate;
  if (typeof window !== "undefined") {
    // call from effect in shell
  }
  return rehydrate;
}
