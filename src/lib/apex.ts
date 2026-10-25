import type {
  BoardRow,
  CartItem,
  CategoryRow,
  FeedItem,
  LedgerEntry,
  Order,
  OrderItem,
  Person,
  Product,
  Role,
  RoleOption,
  Ticket,
  TicketStatus,
} from "@/lib/store";

const TOKEN_KEY = "apex.token";

export class ApexError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function readToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function writeToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export async function apex(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  const token = readToken();
  if (token) headers.set("authorization", `Bearer ${token}`);
  if (init?.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  let response: Response;
  try {
    response = await fetch(`/api/apex${path}`, { ...init, headers });
  } catch {
    throw new ApexError("Нет связи с сервером. Повторите ещё раз.", 0);
  }
  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  if (!response.ok) throw new ApexError(errorText(data, response.status), response.status);
  return data;
}

export function errorText(data: unknown, status: number) {
  if (status === 401) return "Неверный email или пароль, либо сессия закончилась.";
  if (status === 403) return "Недостаточно прав для этого действия.";
  if (status === 404) return "На сервере нет таких данных.";
  if (status === 409) return "Данные уже изменились. Обновите и повторите.";
  if (status === 502 || status === 503 || status === 0) {
    return "Сервер не ответил. Повторите ещё раз.";
  }
  const message = serverMessage(data);
  return message || `Сервер ответил ошибкой ${status}.`;
}

function serverMessage(data: unknown): string {
  if (typeof data === "string" && data.trim()) return data.trim().slice(0, 280);
  if (!data || typeof data !== "object") return "";
  const record = data as Record<string, unknown>;
  for (const key of ["message", "detail", "title", "error"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  if (record.errors && typeof record.errors === "object") {
    const parts: string[] = [];
    for (const value of Object.values(record.errors as Record<string, unknown>)) {
      if (Array.isArray(value)) parts.push(...value.map(String));
      else if (typeof value === "string") parts.push(value);
    }
    if (parts.length) return parts.join(" ");
  }
  return "";
}

export function extractToken(data: unknown): string | null {
  const direct = digToken(data, 0);
  return direct;
}

function digToken(data: unknown, depth: number): string | null {
  if (depth > 5 || data == null) return null;
  if (typeof data === "string") {
    const value = data.trim();
    if (value.length > 20 && !value.includes(" ")) return value;
    return null;
  }
  if (typeof data !== "object") return null;
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = digToken(item, depth + 1);
      if (found) return found;
    }
    return null;
  }
  const record = data as Record<string, unknown>;
  for (const key of ["accessToken", "access_token", "token", "jwt", "bearerToken", "idToken"]) {
    const value = record[key];
    if (typeof value === "string" && value.trim().length > 20) return value.trim();
    if (value && typeof value === "object") {
      const nested = digToken(value, depth + 1);
      if (nested) return nested;
    }
  }
  for (const value of Object.values(record)) {
    const found = digToken(value, depth + 1);
    if (found) return found;
  }
  return null;
}

export function shapeOf(data: unknown) {
  if (data == null) return "пусто";
  if (Array.isArray(data)) return `массив из ${data.length}`;
  if (typeof data !== "object") return typeof data;
  const keys = Object.keys(data as object);
  return keys.length ? keys.slice(0, 10).join(", ") : "пустой объект";
}

function obj(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asArray(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  const record = obj(data);
  if (!record) return [];
  for (const key of [
    "items",
    "data",
    "results",
    "value",
    "products",
    "orders",
    "users",
    "categories",
    "transactions",
    "cartItems",
    "lines",
    "entries",
    "leaderboard",
    "thanks",
  ]) {
    if (Array.isArray(record[key])) return record[key] as unknown[];
  }
  for (const value of Object.values(record)) {
    if (Array.isArray(value)) return value;
  }
  if (record.data) return asArray(record.data);
  return [];
}

function str(value: unknown) {
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function num(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function noteList(data: unknown, label: string, warnings: string[]) {
  const list = asArray(data);
  if (list.length === 0 && data && typeof data === "object" && !Array.isArray(data)) {
    const keys = Object.keys(data as object);
    const wrappers = new Set(["items", "data", "results", "value"]);
    if (keys.length > 0 && !keys.every((key) => wrappers.has(key))) {
      warnings.push(`${label}: не разобрал ответ (${shapeOf(data)}).`);
    }
  }
  return list;
}

const FALLBACKS = [
  "/rewards/hoodie.jpg",
  "/rewards/tshirt.jpg",
  "/rewards/card-a.jpg",
  "/rewards/card-b.jpg",
  "/rewards/card-c.jpg",
  "/rewards/headphones.jpg",
  "/rewards/dayoff.jpg",
  "/rewards/cooking.jpg",
  "/rewards/balloon.jpg",
];

function mapRole(codes: string[], canAdmin: boolean): Role {
  const folded = codes.map((code) => code.toLowerCase());
  if (folded.some((code) => /chief|super|owner|director|главн/.test(code))) return "chief";
  if (canAdmin || folded.some((code) => code.includes("admin"))) return "admin";
  if (folded.some((code) => /manager|lead|supervisor|hr|руковод/.test(code))) return "manager";
  return "employee";
}

const ROLE_TITLE: Record<Role, string> = {
  employee: "Сотрудник",
  manager: "Руководитель",
  admin: "Администратор",
  chief: "Главный администратор",
};

function fullName(record: Record<string, unknown>) {
  const parts = [record.lastName, record.firstName, record.middleName].map(str).filter(Boolean);
  if (parts.length) return parts.join(" ");
  return str(record.name || record.fullName || "Сотрудник");
}

function mapUser(raw: unknown, balance = 0, score = 0, budget = 0): Person | null {
  const record = obj(raw);
  if (!record || record.id == null) return null;
  const codes = Array.isArray(record.roles) ? record.roles.map(str).filter(Boolean) : [];
  const names = Array.isArray(record.roleNames) ? record.roleNames.map(str) : [];
  const role = mapRole(codes, Boolean(record.canAccessAdminPanel));
  return {
    id: str(record.id),
    name: fullName(record),
    firstName: str(record.firstName),
    lastName: str(record.lastName),
    middleName: str(record.middleName),
    avatarUrl: str(record.avatarUrl),
    position: str(record.position),
    department: str(record.department),
    role,
    roleCodes: codes,
    roleTitle: names.filter(Boolean).join(", ") || ROLE_TITLE[role],
    balance,
    score,
    budget,
    budgetLimit: 0,
    status: record.isActive === false ? "blocked" : "active",
  };
}

function mapCategory(raw: unknown): CategoryRow | null {
  const record = obj(raw);
  if (!record || record.id == null) return null;
  return { id: str(record.id), name: str(record.name || "Категория"), sort: num(record.sortOrder) };
}

function mapProduct(raw: unknown, index: number, names: Map<string, string>): Product | null {
  const record = obj(raw);
  if (!record) return null;
  const id = record.id ?? record.productId;
  if (id == null) return null;
  const category = obj(record.category);
  const categoryId = record.categoryId ?? category?.id;
  const categoryName = str(record.categoryName || category?.name || names.get(str(categoryId)) || "");
  const image = str(record.imageUrl || record.image);
  return {
    id: str(id),
    category: categoryId == null ? "" : str(categoryId),
    categoryName,
    title: str(record.name || record.title || "Товар"),
    description: str(record.description),
    price: num(record.price),
    stock: record.stock == null ? (record.isDigital ? 99 : 0) : num(record.stock),
    active: record.isActive !== false && record.active !== false,
    image: image || FALLBACKS[index % FALLBACKS.length] || "/rewards/card-a.jpg",
    popular: index < 3,
    isDigital: Boolean(record.isDigital),
  };
}

function mapCartItem(raw: unknown): CartItem | null {
  const record = obj(raw);
  if (!record) return null;
  const product = obj(record.product);
  const productId = record.productId ?? product?.id;
  if (productId == null) return null;
  const lineId = record.id ?? record.cartItemId ?? record.itemId;
  return {
    lineId: lineId == null ? "" : str(lineId),
    productId: str(productId),
    qty: Math.max(1, num(record.quantity ?? record.qty ?? 1)),
  };
}

function mapStatus(value: string) {
  const key = value.trim().toLowerCase();
  const table: Record<string, string> = {
    created: "created",
    new: "created",
    pending: "created",
    processing: "processing",
    inprogress: "processing",
    in_progress: "processing",
    ready: "ready",
    issued: "issued",
    completed: "issued",
    done: "issued",
    delivered: "issued",
    cancelled: "cancelled",
    canceled: "cancelled",
  };
  return table[key] ?? (value || "created");
}

export function statusToApi(status: string) {
  const table: Record<string, string> = {
    created: "Created",
    processing: "Processing",
    ready: "Ready",
    issued: "Issued",
    cancelled: "Cancelled",
  };
  return table[status] ?? status;
}

function mapOrder(raw: unknown, fallbackUserId: string): Order | null {
  const record = obj(raw);
  if (!record) return null;
  const id = record.id ?? record.orderId;
  if (id == null) return null;
  const items = asArray(record.items ?? record.lines ?? record.orderItems ?? record.products)
    .map((item) => {
      const line = obj(item);
      if (!line) return null;
      const product = obj(line.product);
      const mapped: OrderItem = {
        productId: str(line.productId ?? product?.id ?? ""),
        title: str(line.name || line.title || product?.name || "Товар"),
        price: num(line.price ?? line.unitPrice ?? product?.price),
        qty: Math.max(1, num(line.quantity ?? line.qty ?? 1)),
      };
      return mapped;
    })
    .filter((item): item is OrderItem => Boolean(item));
  const computed = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return {
    id: str(id),
    userId: str(record.userId || fallbackUserId),
    items,
    total: record.total != null || record.totalPrice != null ? num(record.total ?? record.totalPrice) : computed,
    status: mapStatus(str(record.status || record.orderStatus || "created")),
    createdAt: str(record.createdAt || new Date().toISOString()),
  };
}

function mapEntryType(amount: number, hint: string): LedgerEntry["type"] {
  const blob = hint.toLowerCase();
  if (/refund|возврат/.test(blob)) return "refund";
  if (/purchase|order|заказ/.test(blob)) return amount < 0 ? "purchase" : "refund";
  if (/manager|bonus|поощр/.test(blob)) return amount < 0 ? "recognition_sent" : "manager_award";
  if (/thank|благодар/.test(blob)) return amount < 0 ? "recognition_sent" : "recognition_received";
  if (/admin|коррект|adjust/.test(blob)) return "admin_adjustment";
  if (/activity|achievement|daily|актив|достиж/.test(blob)) return "activity_reward";
  return amount < 0 ? "purchase" : "activity_reward";
}

function mapTransaction(raw: unknown, userId: string): LedgerEntry | null {
  const record = obj(raw);
  if (!record || record.id == null) return null;
  const amount = num(record.amount);
  const description = str(record.description);
  const related = str(record.relatedEntityType);
  return {
    id: str(record.id),
    userId,
    type: mapEntryType(amount, `${related} ${description}`),
    amount,
    reason: description || related || "Операция",
    counterpartyId: record.relatedUserId ? str(record.relatedUserId) : undefined,
    createdAt: str(record.createdAt || new Date().toISOString()),
  };
}

function personName(raw: unknown) {
  const record = obj(raw);
  if (!record) return "";
  return fullName(record);
}

function mapThank(raw: unknown): FeedItem | null {
  const record = obj(raw);
  if (!record) return null;
  const id = record.id ?? record.thankId;
  if (id == null) return null;
  const kindBlob = str(record.type || record.kind || record.thankType).toLowerCase();
  const from = obj(record.fromUser || record.sender || record.author);
  const to = obj(record.toUser || record.recipient);
  return {
    id: str(id),
    fromId: str(record.fromUserId || record.senderId || record.fromId || from?.id || ""),
    toId: str(record.toUserId || record.recipientId || record.toId || to?.id || ""),
    fromName: personName(from),
    toName: personName(to),
    amount: num(record.amount ?? record.points),
    message: str(record.message || record.text),
    kind: /manager|bonus|поощр/.test(kindBlob) ? "manager" : "peer",
    createdAt: str(record.createdAt || new Date().toISOString()),
  };
}

function mapBoard(raw: unknown): BoardRow | null {
  const record = obj(raw);
  if (!record) return null;
  const user = obj(record.user);
  const id = str(record.userId || user?.id || record.id || "");
  if (!id) return null;
  const nested = user ? fullName(user) : "";
  return {
    id,
    name: str(record.fullName || record.name || record.userName || nested || "Сотрудник"),
    score: num(
      record.thanksCount ??
        record.thanks ??
        record.score ??
        record.points ??
        record.totalPoints ??
        record.total ??
        record.amount ??
        record.value,
    ),
  };
}

function amountOf(data: unknown) {
  if (typeof data === "number") return data;
  const record = obj(data);
  if (!record) return 0;
  if (record.amount != null) return num(record.amount);
  if (record.balance != null) return num(record.balance);
  return 0;
}

async function optional(path: string) {
  try {
    return { ok: true as const, data: await apex(path) };
  } catch (error) {
    return { ok: false as const, error };
  }
}

export interface Workspace {
  currentUserId: string;
  people: Person[];
  products: Product[];
  categories: CategoryRow[];
  cart: CartItem[];
  orders: Order[];
  ledger: LedgerEntry[];
  feed: FeedItem[];
  roleCatalog: RoleOption[];
  leaderboard: BoardRow[];
  rewardBalance: number | null;
  mustChangePassword: boolean;
  apiWarnings: string[];
}

export async function loadWorkspace(): Promise<Workspace> {
  const warnings: string[] = [];
  const meRaw = await apex("/api/users/me");
  const me = mapUser(meRaw);
  if (!me) {
    throw new ApexError(`Профиль пришёл в неожиданном виде (${shapeOf(meRaw)}).`, 200);
  }

  const mayReadRoles = me.role === "admin" || me.role === "chief";
  const [
    usersRes,
    personalRes,
    rewardRes,
    txRes,
    productsRes,
    categoriesRes,
    cartRes,
    ordersRes,
    inRes,
    outRes,
    boardRes,
    rolesRes,
  ] = await Promise.all([
    optional("/api/users"),
    optional("/api/balances/me"),
    me.role === "manager"
      ? optional("/api/admin/balances/me")
      : Promise.resolve({ ok: false as const, error: null }),
    optional("/api/balances/me/transactions?skip=0&take=50"),
    optional("/api/products"),
    optional("/api/categories"),
    optional("/api/cart"),
    optional("/api/orders"),
    optional("/api/thanks/for-me"),
    optional("/api/thanks/from-me"),
    optional("/api/leaderboard?limit=20"),
    mayReadRoles ? optional("/api/roles") : Promise.resolve({ ok: false as const, error: null }),
  ]);

  const personal = personalRes.ok ? amountOf(personalRes.data) : 0;
  if (!personalRes.ok && personalRes.error instanceof ApexError && personalRes.error.status !== 404) {
    warnings.push(`Личный баланс: ${personalRes.error.message}`);
  }

  let rewardBalance: number | null = null;
  if (rewardRes.ok) rewardBalance = amountOf(rewardRes.data);
  else if (rewardRes.error instanceof ApexError && rewardRes.error.status !== 403 && rewardRes.error.status !== 404) {
    warnings.push(`Рабочий баланс: ${rewardRes.error.message}`);
  }

  me.balance = personal;
  me.budget = rewardBalance ?? 0;

  const people = new Map<string, Person>();
  if (usersRes.ok) {
    const list = noteList(usersRes.data, "Сотрудники", warnings);
    for (const item of list) {
      const person = mapUser(item);
      if (person) people.set(person.id, person);
    }
  } else if (usersRes.error instanceof ApexError && usersRes.error.status !== 404) {
    warnings.push(`Список сотрудников: ${usersRes.error.message}`);
  }
  const self = people.get(me.id);
  people.set(me.id, { ...(self ?? me), ...me, balance: personal, budget: rewardBalance ?? 0 });

  const categories = categoriesRes.ok
    ? noteList(categoriesRes.data, "Категории", warnings)
        .map(mapCategory)
        .filter((item): item is CategoryRow => Boolean(item))
        .sort((a, b) => a.sort - b.sort)
    : [];
  if (!categoriesRes.ok && categoriesRes.error instanceof ApexError && categoriesRes.error.status !== 404) {
    warnings.push(`Категории: ${categoriesRes.error.message}`);
  }
  const categoryNames = new Map(categories.map((item) => [item.id, item.name]));

  const products = productsRes.ok
    ? noteList(productsRes.data, "Товары", warnings)
        .map((item, index) => mapProduct(item, index, categoryNames))
        .filter((item): item is Product => Boolean(item))
    : [];
  if (!productsRes.ok && productsRes.error instanceof ApexError && productsRes.error.status !== 404) {
    warnings.push(`Каталог: ${productsRes.error.message}`);
  }

  const cart = cartRes.ok
    ? noteList(cartRes.data, "Корзина", warnings)
        .map(mapCartItem)
        .filter((item): item is CartItem => Boolean(item))
    : [];
  if (!cartRes.ok && cartRes.error instanceof ApexError) warnings.push(`Корзина: ${cartRes.error.message}`);
  if (cart.some((item) => !item.lineId)) {
    warnings.push("Корзина: у строки нет id, количество может не сохраниться.");
  }

  const orders = ordersRes.ok
    ? noteList(ordersRes.data, "Заказы", warnings)
        .map((item) => mapOrder(item, me.id))
        .filter((item): item is Order => Boolean(item))
    : [];
  if (!ordersRes.ok && ordersRes.error instanceof ApexError) warnings.push(`Заказы: ${ordersRes.error.message}`);

  const ledger = txRes.ok
    ? noteList(txRes.data, "Транзакции", warnings)
        .map((item) => mapTransaction(item, me.id))
        .filter((item): item is LedgerEntry => Boolean(item))
    : [];
  if (!txRes.ok && txRes.error instanceof ApexError && txRes.error.status !== 404) {
    warnings.push(`История баланса: ${txRes.error.message}`);
  }

  const feedMap = new Map<string, FeedItem>();
  for (const pack of [inRes, outRes]) {
    if (!pack.ok) {
      if (pack.error instanceof ApexError && pack.error.status !== 404) {
        warnings.push(`Благодарности: ${pack.error.message}`);
      }
      continue;
    }
    for (const item of noteList(pack.data, "Благодарности", warnings)) {
      const thank = mapThank(item);
      if (thank) feedMap.set(thank.id, thank);
    }
  }
  const feed = [...feedMap.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  for (const item of feed) {
    if (!item.fromName) item.fromName = people.get(item.fromId)?.name;
    if (!item.toName) item.toName = people.get(item.toId)?.name;
  }

  const leaderboard = boardRes.ok
    ? noteList(boardRes.data, "Лидерборд", warnings)
        .map(mapBoard)
        .filter((item): item is BoardRow => Boolean(item))
    : [];
  if (!boardRes.ok && boardRes.error instanceof ApexError) warnings.push(`Лидерборд: ${boardRes.error.message}`);
  for (const row of leaderboard) {
    const person = people.get(row.id);
    if (person) person.score = row.score;
    else if (!row.name || row.name === "Сотрудник") row.name = "Сотрудник";
  }

  const roleCatalog = rolesRes.ok
    ? noteList(rolesRes.data, "Роли", warnings)
        .map((item) => {
          const record = obj(item);
          if (!record || !record.code) return null;
          return { code: str(record.code), name: str(record.name || record.code) };
        })
        .filter((item): item is RoleOption => Boolean(item))
    : [];
  if (
    mayReadRoles &&
    !rolesRes.ok &&
    rolesRes.error instanceof ApexError &&
    rolesRes.error.status !== 403 &&
    rolesRes.error.status !== 404
  ) {
    warnings.push(`Роли: ${rolesRes.error.message}`);
  }

  const titled = people.get(me.id);
  if (titled && roleCatalog.length) {
    const names = (titled.roleCodes ?? [])
      .map((code) => roleCatalog.find((role) => role.code === code)?.name)
      .filter((name): name is string => Boolean(name));
    if (names.length) titled.roleTitle = names.join(", ");
  }

  return {
    currentUserId: me.id,
    people: [...people.values()],
    products,
    categories,
    cart,
    orders,
    ledger,
    feed,
    roleCatalog,
    leaderboard,
    rewardBalance,
    mustChangePassword: passwordChangeRequired(meRaw),
    apiWarnings: warnings,
  };
}

export interface QuestStepView {
  id: string;
  title: string;
  description: string;
  completionType: string;
  sortOrder: number;
  required: boolean;
  completed: boolean;
  proofStatus: string;
  proofComment: string;
}

export interface QuestView {
  id: string;
  title: string;
  description: string;
  reward: number;
  startAt: string;
  endAt: string;
  status: string;
  rewardClaimed: boolean;
  steps: QuestStepView[];
}

export interface SurveyQuestionView {
  id: string;
  text: string;
  type: string;
  options: string[];
  required: boolean;
  sortOrder: number;
}

export interface SurveyView {
  id: string;
  title: string;
  description: string;
  questionsCount: number;
  hasResponded: boolean;
  canRespond: boolean;
  allowMultiple: boolean;
  questions: SurveyQuestionView[];
}

export interface EventView {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  location: string;
  maxParticipants: number | null;
  registeredCount: number;
  reward: number;
  status: string;
  rewardClaimed: boolean;
  open: boolean;
}

export interface AchievementView {
  id: string;
  code: string;
  name: string;
  description: string;
  reward: number;
  conditionType: string;
  earned: boolean;
  earnedAt: string;
}

export interface ActivitiesBundle {
  quests: QuestView[];
  surveys: SurveyView[];
  events: EventView[];
  achievements: AchievementView[];
  warnings: string[];
}

export async function loadActivitiesBundle(userId: string): Promise<ActivitiesBundle> {
  const warnings: string[] = [];
  const [questsRes, surveysRes, eventsRes, achievementsRes, mineRes] = await Promise.all([
    optional("/api/quests?page=1&pageSize=50"),
    optional("/api/surveys?page=1&pageSize=50"),
    optional("/api/events?page=1&pageSize=50"),
    optional("/api/achievements"),
    optional(`/api/achievements/users/${userId}`),
  ]);
  noteFailure(questsRes, "Квесты", warnings);
  noteFailure(surveysRes, "Опросы", warnings);
  noteFailure(eventsRes, "Мероприятия", warnings);
  noteFailure(achievementsRes, "Достижения", warnings);
  noteFailure(mineRes, "Ваши достижения", warnings);

  const questList = questsRes.ok ? asArray(questsRes.data) : [];
  const surveyList = surveysRes.ok ? asArray(surveysRes.data) : [];
  const eventList = eventsRes.ok ? asArray(eventsRes.data) : [];

  const [questDetails, surveyDetails, eventDetails] = await Promise.all([
    Promise.all(questList.map((item) => detailOf(item, "quests"))),
    Promise.all(surveyList.map((item) => detailOf(item, "surveys"))),
    Promise.all(eventList.map((item) => detailOf(item, "events"))),
  ]);

  const earnedAt = new Map<string, string>();
  if (mineRes.ok) {
    for (const item of asArray(mineRes.data)) {
      const record = obj(item);
      if (!record) continue;
      const id = str(record.achievementId || obj(record.achievement)?.id);
      if (id) earnedAt.set(id, str(record.earnedAt));
    }
  }

  return {
    quests: questList
      .map((item, index) => mapQuest(item, questDetails[index]))
      .filter((item): item is QuestView => Boolean(item)),
    surveys: surveyList
      .map((item, index) => mapSurvey(item, surveyDetails[index]))
      .filter((item): item is SurveyView => Boolean(item)),
    events: eventList
      .map((item, index) => mapEvent(item, eventDetails[index]))
      .filter((item): item is EventView => Boolean(item)),
    achievements: (achievementsRes.ok ? asArray(achievementsRes.data) : [])
      .map((item) => mapAchievement(item, earnedAt))
      .filter((item): item is AchievementView => Boolean(item)),
    warnings,
  };
}

function noteFailure(
  result: { ok: true; data: unknown } | { ok: false; error: unknown },
  label: string,
  warnings: string[],
) {
  if (result.ok) return;
  if (result.error instanceof ApexError && result.error.status === 401) throw result.error;
  if (result.error instanceof ApexError && result.error.status !== 404) {
    warnings.push(`${label}: ${result.error.message}`);
  }
}

async function detailOf(item: unknown, kind: "quests" | "surveys" | "events") {
  const id = str(obj(item)?.id);
  if (!id) return null;
  const result = await optional(`/api/${kind}/${id}`);
  return result.ok ? result.data : null;
}

function mapQuest(item: unknown, details: unknown): QuestView | null {
  const record = obj(details) ?? obj(item);
  if (!record || record.id == null) return null;
  const participation = obj(record.participation);
  const steps = asArray(record.steps)
    .map((step) => {
      const row = obj(step);
      if (!row || row.id == null) return null;
      return {
        id: str(row.id),
        title: str(row.title || "Шаг"),
        description: str(row.description),
        completionType: str(row.completionType || "manual"),
        sortOrder: num(row.sortOrder),
        required: row.isRequired !== false,
        completed: Boolean(row.isCompleted),
        proofStatus: str(row.proofStatus),
        proofComment: str(row.proofComment),
      };
    })
    .filter((step): step is QuestStepView => Boolean(step))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    id: str(record.id),
    title: str(record.title || "Квест"),
    description: str(record.description),
    reward: num(record.rewardAmount),
    startAt: str(record.startAt),
    endAt: str(record.endAt),
    status: str(participation?.status || record.participationStatus),
    rewardClaimed: Boolean(participation?.rewardClaimed),
    steps,
  };
}

function mapSurvey(item: unknown, details: unknown): SurveyView | null {
  const list = obj(item);
  const record = obj(details) ?? list;
  if (!record || record.id == null) return null;
  const questions = asArray(record.questions)
    .map((question) => {
      const row = obj(question);
      if (!row || row.id == null) return null;
      return {
        id: str(row.id),
        text: str(row.questionText || "Вопрос"),
        type: str(row.questionType || "text"),
        options: asArray(row.options).map((option) => str(option)).filter(Boolean),
        required: row.isRequired !== false,
        sortOrder: num(row.sortOrder),
      };
    })
    .filter((question): question is SurveyQuestionView => Boolean(question))
    .sort((a, b) => a.sortOrder - b.sortOrder);
  return {
    id: str(record.id),
    title: str(record.title || list?.title || "Опрос"),
    description: str(record.description || list?.description),
    questionsCount: questions.length || num(list?.questionsCount),
    hasResponded: Boolean(list?.hasResponded) || asArray(record.responses).length > 0,
    canRespond: list?.canRespond != null ? Boolean(list.canRespond) : record.canRespond !== false,
    allowMultiple: Boolean(record.allowMultipleResponses ?? list?.allowMultipleResponses),
    questions,
  };
}

function mapEvent(item: unknown, details: unknown): EventView | null {
  const list = obj(item);
  const record = obj(details) ?? list;
  if (!record || record.id == null) return null;
  const registration = obj(record.registration);
  const max = record.maxParticipants ?? list?.maxParticipants;
  return {
    id: str(record.id),
    title: str(record.title || "Мероприятие"),
    description: str(record.description),
    startAt: str(record.startAt),
    endAt: str(record.endAt),
    location: str(record.location),
    maxParticipants: max == null || max === "" ? null : num(max),
    registeredCount: num(record.registeredCount),
    reward: num(record.rewardAmount),
    status: str(registration?.status || record.registrationStatus || list?.registrationStatus),
    rewardClaimed: Boolean(registration?.rewardClaimed),
    open: record.isOpen == null ? true : Boolean(record.isOpen),
  };
}

function mapAchievement(item: unknown, earnedAt: Map<string, string>): AchievementView | null {
  const record = obj(item);
  if (!record || record.id == null || record.isActive === false) return null;
  const id = str(record.id);
  return {
    id,
    code: str(record.code),
    name: str(record.name || "Достижение"),
    description: str(record.description),
    reward: num(record.rewardAmount),
    conditionType: str(record.conditionType),
    earned: earnedAt.has(id),
    earnedAt: earnedAt.get(id) ?? "",
  };
}

export function passwordChangeRequired(data: unknown) {
  const record = obj(data);
  if (!record) return false;
  const keys = [
    "mustChangePassword",
    "must_change_password",
    "passwordChangeRequired",
    "requirePasswordChange",
    "isTemporaryPassword",
  ];
  if (keys.some((key) => record[key] === true)) return true;
  const meta = obj(record.user_metadata) ?? obj(record.userMetadata);
  return Boolean(meta && keys.some((key) => meta[key] === true));
}

export function mapTicket(raw: unknown): Ticket | null {
  const record = obj(raw);
  if (!record || record.id == null) return null;
  const messages = asArray(record.messages)
    .map((item) => {
      const row = obj(item);
      if (!row) return null;
      return {
        id: str(row.id || `${record.id}-${row.createdAt}`),
        authorId: str(row.userId),
        authorName: str(row.userName) || joinName(row),
        text: str(row.message || row.text),
        createdAt: str(row.createdAt),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  return {
    id: str(record.id),
    userId: str(record.userId),
    userName: str(record.userName) || joinName(record, "user"),
    subject: str(record.subject || "Обращение"),
    status: mapTicketStatus(record.status),
    createdAt: str(record.createdAt),
    messages,
  };
}

function joinName(record: Record<string, unknown>, prefix = "") {
  const last = str(record[prefix ? `${prefix}LastName` : "lastName"] || record.userLastName);
  const first = str(record[prefix ? `${prefix}FirstName` : "firstName"] || record.userFirstName);
  const middle = str(record[prefix ? `${prefix}MiddleName` : "middleName"] || record.userMiddleName);
  return [last, first, middle].filter(Boolean).join(" ");
}

function mapTicketStatus(value: unknown): TicketStatus {
  const raw = str(value).toLowerCase().replace(/[\s_-]/g, "");
  if (raw === "inprogress") return "in_progress";
  if (raw === "resolved") return "resolved";
  if (raw === "closed") return "closed";
  return "open";
}

export function ticketStatusToApi(status: TicketStatus) {
  if (status === "in_progress") return "InProgress";
  if (status === "resolved") return "Resolved";
  if (status === "closed") return "Closed";
  return "Open";
}
