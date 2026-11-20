import { AdminActivities } from "@/components/admin-activities";
import { AdminAi } from "@/components/admin-ai";
import { AdminAnalytics } from "@/components/admin-analytics";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pager, usePage } from "@/components/pager";
import { NewsDesk, ProductTools } from "@/components/product-tools";
import { UserAvatar } from "@/components/user-avatar";
import { Shell } from "@/components/shell";
import { Button, Field, NumericInput, TextArea, TextInput } from "@/components/ui";
import { apex } from "@/lib/apex";
import { formatNumber } from "@/lib/format";
import { categoryLabel, ENTRY_LABEL, ORDER_FLOW, orderStatusLabel, ROLE_LABEL, roleCodeLabel, TICKET_STATUS } from "@/lib/labels";
import {
  canManageActivities,
  canManageShop,
  canOpenAdmin,
  useStore,
  type EntryType,
  type Product,
  type Role,
  type TicketStatus,
} from "@/lib/store";

export const Route = createFileRoute("/admin")({ component: AdminPage });

const TABS = ["Товары", "Заказы", "Сотрудники", "Активности", "Экономика", "Обращения", "Лента", "Аналитика", "Нейросеть"] as const;
type AdminTab = (typeof TABS)[number];

function tabsFor(role: Role): AdminTab[] {
  if (role === "hr") return ["Активности"];
  if (role === "merchandiser") return ["Товары", "Заказы"];
  if (role === "support") return ["Обращения"];
  if (role === "manager") return ["Сотрудники"];
  if (role === "admin" || role === "chief") return [...TABS];
  return TABS.filter((item) => item !== "Лента" && item !== "Аналитика" && item !== "Нейросеть");
}

function AdminPage() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const allowed = user ? tabsFor(user.role) : [];
  const [tab, setTab] = useState<AdminTab>(allowed[0] ?? "Товары");
  if (!user) return null;
  if (!canOpenAdmin(user.role) || allowed.length === 0) {
    return (
      <Shell mode="top">
        <h1 className="text-3xl font-bold">Недостаточно прав</h1>
        <p className="mt-2 text-sm text-muted">Этот раздел доступен по роли: магазин, активности, сотрудники отдела или обращения.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand">
          На главную
        </Link>
      </Shell>
    );
  }
  const current = allowed.includes(tab) ? tab : allowed[0];

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">
        {user.role === "support"
          ? "Обращения"
          : user.role === "manager"
            ? "Сотрудники"
            : canManageActivities(user.role) && !canManageShop(user.role)
              ? "Активности"
              : canManageShop(user.role) && !canManageActivities(user.role)
                ? "Магазин"
                : "Администрирование"}
      </h1>
      <p className="mt-2 text-sm text-muted">Вы вошли как {user.name}.</p>
      {allowed.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-1 rounded-lg bg-card p-1" role="tablist">
          {allowed.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={current === item}
              onClick={() => setTab(item)}
              className={`min-h-10 rounded-md px-3 text-sm font-semibold ${
                current === item ? "bg-brand text-white" : "text-ink hover:bg-surface"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      ) : null}
      <div className="mt-5">
        {current === "Товары" ? <Products /> : null}
        {current === "Заказы" ? <Orders /> : null}
        {current === "Сотрудники" ? <People /> : null}
        {current === "Активности" ? <Activities /> : null}
        {current === "Экономика" ? <Economy /> : null}
        {current === "Обращения" ? <Tickets /> : null}
        {current === "Лента" ? <NewsDesk /> : null}
        {current === "Аналитика" ? <AdminAnalytics /> : null}
        {current === "Нейросеть" ? <AdminAi /> : null}
      </div>
    </Shell>
  );
}

function orderTone(status: string) {
  if (status === "cancelled") return "bg-rose-100 text-rose-800";
  if (status === "ready") return "bg-emerald-100 text-emerald-800";
  if (status === "processing") return "bg-amber-100 text-amber-950";
  return "bg-sky-100 text-sky-900";
}

function emptyProduct(): Product {
  return {
    id: "new",
    category: "",
    title: "",
    description: "",
    price: 500,
    stock: 1,
    active: true,
    image: "/rewards/card-c.jpg",
  };
}

function Products() {
  const products = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);
  const save = useStore((state) => state.saveProduct);
  const uploadImage = useStore((state) => state.uploadImage);
  const [draft, setDraft] = useState<Product | null>(null);
  const [variantCount, setVariantCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [onlyActive, setOnlyActive] = useState<"all" | "yes" | "no">("all");
  const [categoryId, setCategoryId] = useState("all");
  const filtered = products.filter((product) => {
    const needle = query.trim().toLowerCase();
    const text = `${product.title} ${product.categoryName ?? ""} ${categoryLabel(product.category, product.categoryName)}`.toLowerCase();
    if (needle && !text.includes(needle)) return false;
    if (onlyActive === "yes" && !product.active) return false;
    if (onlyActive === "no" && product.active) return false;
    if (categoryId !== "all" && product.category !== categoryId) return false;
    return true;
  });
  const page = usePage(filtered, 8, `${query}|${onlyActive}|${categoryId}`);

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-2">
        <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск товара" aria-label="Поиск товара" className="max-w-xs" />
        <select className="h-11 rounded-md border border-line bg-surface px-3 text-sm" value={onlyActive} onChange={(event) => setOnlyActive(event.target.value as "all" | "yes" | "no")}>
          <option value="all">Все статусы</option>
          <option value="yes">В каталоге</option>
          <option value="no">Скрытые</option>
        </select>
        <select className="h-11 rounded-md border border-line bg-surface px-3 text-sm" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} aria-label="Категория товара">
          <option value="all">Все категории</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        <Button variant="line" onClick={() => { setVariantCount(0); setDraft(emptyProduct()); }}>Новый товар</Button>
      </div>
      {draft?.id === "new" ? <div className="mb-3 rounded-xl border-2 border-brand bg-brand-wash p-4 shadow-md">{productEditor()}</div> : null}
      <ul className="grid gap-3 sm:grid-cols-2">
        {page.items.map((product) => {
          const open = draft?.id === product.id;
          return (
            <li key={product.id} className={open ? "sm:col-span-2" : ""}>
              <div className={open ? "rounded-xl border-2 border-brand bg-brand-wash p-3 shadow-md" : "rounded-xl border border-line bg-surface p-3 shadow-sm"}>
                <div className="flex items-center gap-3">
                  <img src={product.image} alt="" className="size-14 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold">{product.title}</p>
                    <p className="text-xs text-muted">{categoryLabel(product.category, product.categoryName)}</p>
                    <p className="text-sm">{formatNumber(product.price)} апексов · {product.stock} шт.</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${product.active ? "bg-emerald-100 text-emerald-800" : "bg-card text-muted"}`}>{product.active ? "В каталоге" : "Скрыт"}</span>
                  <button type="button" className="grid size-10 place-items-center rounded-full border border-line hover:border-brand hover:text-brand" aria-label={`Редактировать ${product.title}`} onClick={() => setDraft(open ? null : product)}>
                    <Pencil className="size-4" />
                  </button>
                </div>
                {open ? <div className="mt-3 border-t border-line pt-3">{productEditor()}</div> : null}
              </div>
            </li>
          );
        })}
      </ul>
      <Pager page={page.page} pages={page.pages} total={page.total} onPage={page.setPage} />
    </div>
  );

  function productEditor() {
    if (!draft) return null;
    return (
      <form
        className="grid gap-3 lg:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft || saving) return;
          setSaving(true);
          void save(draft).then((result) => {
            setSaving(false);
            if (!result.ok) toast.error(result.error);
            else {
              toast.success("Товар сохранён");
              setDraft(null);
            }
          });
        }}
      >
        <Field label="Название">
          <TextInput value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </Field>
        <Field label="Категория">
          {categories.length === 0 ? (
            <TextInput value={draft.category} inputMode="numeric" placeholder="id категории" onChange={(event) => setDraft({ ...draft, category: event.target.value })} />
          ) : (
            <select className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>
              <option value="">Без категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          )}
        </Field>
        <div className="lg:col-span-2">
          <Field label="Описание">
            <TextArea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
          </Field>
        </div>
        <Field label="Фото">
          {variantCount > 0 ? (
            <p className="text-sm text-muted">Общее фото скрыто: у товара есть варианты, картинка задаётся у каждого.</p>
          ) : (
            <>
          {draft.image ? <img src={draft.image} alt="" className="mb-2 h-24 w-24 rounded-md object-cover" /> : null}
          <label className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-line bg-surface px-4 text-sm font-semibold hover:border-brand-mid">
            {uploading ? "Загружаем…" : "Выбрать файл"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = "";
                if (!file || !draft) return;
                setUploading(true);
                void uploadImage(file, "products").then((result) => {
                  setUploading(false);
                  if (!result.ok || !result.url) toast.error(result.ok ? "Сервер не вернул ссылку" : result.error);
                  else setDraft({ ...draft, image: result.url });
                });
              }}
            />
          </label>
            </>
          )}
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Цена, апексы">
            <NumericInput value={draft.price} onChange={(price) => setDraft({ ...draft, price })} />
          </Field>
          {variantCount > 0 ? (
            <p className="self-end text-sm text-muted">Общий остаток скрыт: он складывается из вариантов.</p>
          ) : (
            <Field label="Остаток">
              <NumericInput value={draft.stock} onChange={(stock) => setDraft({ ...draft, stock })} />
            </Field>
          )}
        </div>
        <label className="flex min-h-11 items-center gap-2 text-sm lg:col-span-2">
          <input type="checkbox" checked={draft.active} onChange={(event) => setDraft({ ...draft, active: event.target.checked })} />
          Показывать в каталоге
        </label>
        <div className="flex flex-wrap gap-2 lg:col-span-2">
          <Button type="submit" disabled={saving || uploading}>{saving ? "Сохраняем…" : "Сохранить"}</Button>
          <Button type="button" variant="line" onClick={() => setDraft(null)}>Отмена</Button>
        </div>
        {draft.id !== "new" ? <div className="lg:col-span-2"><ProductTools productId={draft.id} onVariantCount={setVariantCount} /></div> : null}
      </form>
    );
  }
}

function Orders() {
  const orders = useStore((state) => state.allOrders);
  const people = useStore((state) => state.people);
  const updateOrderStatus = useStore((state) => state.setOrderStatus);
  const loadAllOrders = useStore((state) => state.loadAllOrders);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [period, setPeriod] = useState("all");
  const [sort, setSort] = useState<"new" | "old">("new");
  const filtered = orders.filter((order) => {
    const person = people.find((item) => item.id === order.userId);
    const text = `${person?.name ?? ""} ${order.items.map((item) => `${item.title} ${item.variantName ?? ""}`).join(" ")}`.toLowerCase();
    if (query.trim() && !text.includes(query.trim().toLowerCase())) return false;
    if (status !== "all" && order.status !== status) return false;
    if (period !== "all") {
      const age = Date.now() - new Date(order.createdAt).getTime();
      const limit = period === "1" ? 86400000 : period === "7" ? 7 * 86400000 : 30 * 86400000;
      if (!Number.isFinite(age) || age > limit) return false;
    }
    return true;
  }).sort((a, b) => (sort === "new" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt)));
  const page = usePage(filtered, 8, `${query}|${status}|${period}|${sort}`);
  useEffect(() => {
    void loadAllOrders().catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "Не удалось загрузить заказы");
    });
  }, [loadAllOrders]);
  return (
    <div>
      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
      {orders.length === 0 && !error ? <p className="mb-3 text-sm text-muted">Заказов пока нет.</p> : null}
      <div className="mb-3 flex flex-wrap gap-2">
        <TextInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Сотрудник или товар" aria-label="Поиск заказа" className="max-w-xs" />
        <select className="h-11 rounded-md border border-line bg-surface px-3 text-sm" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">Все статусы</option>
          {ORDER_FLOW.map((item) => (
            <option key={item} value={item}>{orderStatusLabel(item)}</option>
          ))}
        </select>
        <select className="h-11 rounded-md border border-line bg-surface px-3 text-sm" value={period} onChange={(event) => setPeriod(event.target.value)} aria-label="Период заказов">
          <option value="all">За всё время</option>
          <option value="1">Сегодня</option>
          <option value="7">7 дней</option>
          <option value="30">30 дней</option>
        </select>
        <select className="h-11 rounded-md border border-line bg-surface px-3 text-sm" value={sort} onChange={(event) => setSort(event.target.value as "new" | "old")} aria-label="Сортировка заказов">
          <option value="new">Сначала новые</option>
          <option value="old">Сначала старые</option>
        </select>
      </div>
      <ul className="space-y-3">
        {page.items.map((order) => {
          const person = people.find((item) => item.id === order.userId);
          return (
            <li key={order.id} className="rounded-xl border border-line bg-gradient-to-b from-surface to-card p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                {person ? (
                  <Link to="/people/$userId" params={{ userId: person.id }} className="flex items-center gap-2 font-semibold hover:text-brand">
                    <UserAvatar user={person} className="size-9" />
                    {person.name}
                  </Link>
                ) : (
                  <span>Сотрудник</span>
                )}
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${orderTone(order.status)}`}>{orderStatusLabel(order.status)}</span>
              </div>
              <p className="mt-2 text-sm">{order.items.map((item) => `${item.title}${item.variantName ? ` (${item.variantName})` : ""} ×${item.qty}`).join(", ")}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold tabular">{formatNumber(order.total)} апексов</p>
                <select
                  className="h-10 rounded-md border border-line bg-surface px-2"
                  value={order.status}
                  onChange={(event) => {
                    void updateOrderStatus(order.id, event.target.value).then((result) => {
                      if (!result.ok) toast.error(result.error);
                      else toast.success(event.target.value === "cancelled" ? "Заказ отменён, апексы вернулись на баланс" : "Статус заказа обновлён");
                    });
                  }}
                >
                  {!ORDER_FLOW.includes(order.status as (typeof ORDER_FLOW)[number]) ? (
                    <option value={order.status}>{orderStatusLabel(order.status)}</option>
                  ) : null}
                  {ORDER_FLOW.map((item) => (
                    <option key={item} value={item}>{orderStatusLabel(item)}</option>
                  ))}
                </select>
              </div>
            </li>
          );
        })}
      </ul>
      <Pager page={page.page} pages={page.pages} total={page.total} onPage={page.setPage} />
    </div>
  );
}

function People() {
  const people = useStore((state) => state.people);
  const me = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const departmentIds = useStore((state) => state.departmentIds);
  const [peopleQuery, setPeopleQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const visible = (me?.role === "manager" ? people.filter((person) => departmentIds.includes(person.id)) : people).filter((person) => {
    const needle = peopleQuery.trim().toLowerCase();
    if (roleFilter !== "all" && person.role !== roleFilter) return false;
    if (!needle) return true;
    return `${person.name} ${person.department} ${person.position}`.toLowerCase().includes(needle);
  });
  const peoplePage = usePage(visible, 8, `${peopleQuery}|${roleFilter}`);
  const roles = useStore((state) => state.roleCatalog);
  const setRole = useStore((state) => state.setUserRole);
  const setStatus = useStore((state) => state.setUserStatus);
  const updateEmployee = useStore((state) => state.updateEmployee);
  const createEmployee = useStore((state) => state.createEmployee);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [directories, setDirectories] = useState<{ departments: { id: number; name: string }[]; positions: { id: number; name: string }[] }>({
    departments: [],
    positions: [],
  });
  const [pending, setPending] = useState(false);
  const [edit, setEdit] = useState({
    id: "",
    firstName: "",
    lastName: "",
    middleName: "",
    department: "",
    position: "",
  });
  const editing = people.find((person) => person.id === edit.id);
  const canCreate = me?.role !== "manager";

  useEffect(() => {
    if (!canCreate) return;
    let ignore = false;
    void Promise.all([apex("/api/departments"), apex("/api/positions")])
      .then(([departmentRows, positionRows]) => {
        if (ignore) return;
        const asOptions = (data: unknown) =>
          (Array.isArray(data) ? data : [])
            .flatMap((item) => {
              if (!item || typeof item !== "object") return [];
              const row = item as { id?: unknown; name?: unknown; isActive?: unknown };
              if (row.isActive === false || row.id == null) return [];
              return [{ id: Number(row.id), name: String(row.name || "") }];
            })
            .filter((item) => item.name && Number.isInteger(item.id));
        setDirectories({ departments: asOptions(departmentRows), positions: asOptions(positionRows) });
      })
      .catch(() => undefined);
    return () => {
      ignore = true;
    };
  }, [canCreate]);

  return (
    <div>
      {canCreate ? (
      <form
        className="mb-4 grid gap-3 rounded-xl border-2 border-brand bg-brand-wash p-4 shadow-md sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          setPending(true);
          void createEmployee({
            email,
            password,
            firstName,
            lastName,
            middleName,
            departmentId: Number(departmentId),
            positionId: Number(positionId),
          }).then((result) => {
            setPending(false);
            if (!result.ok) toast.error(result.error);
            else {
              toast.success("Сотрудник создан. При первом входе он должен сменить пароль.");
              setEmail("");
              setPassword("");
              setFirstName("");
              setLastName("");
              setMiddleName("");
              setDepartmentId("");
              setPositionId("");
            }
          });
        }}
      >
        <h2 className="text-lg font-bold sm:col-span-2">Новый сотрудник</h2>
        <Field label="Почта">
          <TextInput type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </Field>
        <Field label="Временный пароль">
          <div className="flex gap-2">
            <TextInput type="text" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <Button
              type="button"
              variant="line"
              className="shrink-0"
              onClick={() => {
                const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
                const bytes = new Uint32Array(10);
                crypto.getRandomValues(bytes);
                setPassword(Array.from(bytes, (value) => alphabet[value % alphabet.length]).join(""));
              }}
            >
              Сгенерировать пароль
            </Button>
          </div>
        </Field>
        <Field label="Фамилия">
          <TextInput value={lastName} onChange={(event) => setLastName(event.target.value)} required />
        </Field>
        <Field label="Имя">
          <TextInput value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
        </Field>
        <Field label="Отчество">
          <TextInput value={middleName} onChange={(event) => setMiddleName(event.target.value)} />
        </Field>
        <Field label="Отдел">
          <select className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm" value={departmentId} onChange={(event) => setDepartmentId(event.target.value)} required>
            <option value="">Выберите отдел</option>
            {directories.departments.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Должность">
          <select className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm" value={positionId} onChange={(event) => setPositionId(event.target.value)} required>
            <option value="">Выберите должность</option>
            {directories.positions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          <Button type="submit" disabled={pending} className="sm:w-auto">
            Создать
          </Button>
          <Button
            type="button"
            variant="line"
            onClick={() => {
              setEmail("");
              setPassword("");
              setFirstName("");
              setLastName("");
              setMiddleName("");
              setDepartmentId("");
              setPositionId("");
            }}
          >
            Отмена
          </Button>
        </div>
      </form>
      ) : null}
      {editing ? (
        <form
          className="mb-4 grid gap-3 rounded-xl border-2 border-brand bg-brand-wash p-4 shadow-md sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            void updateEmployee(edit).then((result) => {
              if (!result.ok) toast.error(result.error);
              else {
                toast.success("Данные сотрудника сохранены");
                setEdit({ id: "", firstName: "", lastName: "", middleName: "", department: "", position: "" });
              }
            });
          }}
        >
          <h2 className="text-lg font-bold sm:col-span-2">Данные: {editing.name}</h2>
          <Field label="Фамилия">
            <TextInput value={edit.lastName} onChange={(event) => setEdit({ ...edit, lastName: event.target.value })} required />
          </Field>
          <Field label="Имя">
            <TextInput value={edit.firstName} onChange={(event) => setEdit({ ...edit, firstName: event.target.value })} required />
          </Field>
          <Field label="Отчество">
            <TextInput value={edit.middleName} onChange={(event) => setEdit({ ...edit, middleName: event.target.value })} />
          </Field>
          <Field label="Отдел">
            <TextInput value={edit.department} onChange={(event) => setEdit({ ...edit, department: event.target.value })} required />
          </Field>
          <Field label="Должность">
            <TextInput value={edit.position} onChange={(event) => setEdit({ ...edit, position: event.target.value })} required />
          </Field>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit">Сохранить</Button>
            <Button
              type="button"
              variant="line"
              onClick={() => setEdit({ id: "", firstName: "", lastName: "", middleName: "", department: "", position: "" })}
            >
              Отмена
            </Button>
          </div>
        </form>
      ) : null}
      <div className="mb-3 flex flex-wrap gap-2">
        <TextInput value={peopleQuery} onChange={(event) => setPeopleQuery(event.target.value)} placeholder="Поиск сотрудника" aria-label="Поиск сотрудника" className="max-w-xs" />
        <select className="h-11 rounded-md border border-line bg-surface px-3 text-sm" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} aria-label="Роль">
          <option value="all">Все роли</option>
          {(Object.keys(ROLE_LABEL) as Role[]).map((role) => (
            <option key={role} value={role}>{ROLE_LABEL[role]}</option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-card text-xs text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Сотрудник</th>
              <th className="px-3 py-2 font-medium">Отдел</th>
              <th className="px-3 py-2 font-medium">Роль</th>
              <th className="px-3 py-2 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-muted" colSpan={4}>
                  В вашем отделе пока никого нет.
                </td>
              </tr>
            ) : null}
            {peoplePage.items.map((person) => {
              const code = person.roleCodes?.[0] ?? "";
              return (
                <tr key={person.id} className="border-t border-line">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <UserAvatar user={person} className="size-8" />
                      <div>
                        <p className="font-medium">{person.name}</p>
                        <p className="text-xs text-muted">{person.position}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="mt-1 text-xs font-semibold text-brand"
                      onClick={() => {
                        setEdit({
                          id: person.id,
                          firstName: person.firstName ?? "",
                          lastName: person.lastName ?? "",
                          middleName: person.middleName ?? "",
                          department: person.department,
                          position: person.position,
                        });
                      }}
                    >
                      Изменить данные
                    </button>
                  </td>
                  <td className="px-3 py-2">{person.department}</td>
                  <td className="px-3 py-2">
                    {me?.role === "manager" ? (
                      roleCodeLabel(code || person.role)
                    ) : (
                    <select
                      className="h-10 max-w-48 rounded-md border border-line bg-surface px-2"
                      value={code}
                      onChange={(event) => {
                        void setRole(person.id, event.target.value).then((result) => {
                          if (!result.ok) toast.error(result.error);
                        });
                      }}
                    >
                      {code && !roles.some((role) => role.code === code) ? (
                        <option value={code}>{roleCodeLabel(code)}</option>
                      ) : null}
                      {roles.map((role) => (
                        <option key={role.code} value={role.code}>
                          {roleCodeLabel(role.code)}
                        </option>
                      ))}
                    </select>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      className="font-semibold text-brand"
                      onClick={() =>
                        void setStatus(person.id, person.status === "active" ? "blocked" : "active").then((result) => {
                          if (!result.ok) toast.error(result.error);
                        })
                      }
                    >
                      {person.status === "active" ? "Активен" : "Заблокирован"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pager page={peoplePage.page} pages={peoplePage.pages} total={peoplePage.total} onPage={peoplePage.setPage} />
    </div>
  );
}

function Activities() {
  return <AdminActivities />;
}

function Economy() {
  const people = useStore((state) => state.people);
  const ledger = useStore((state) => state.allLedger);
  const loadAllLedger = useStore((state) => state.loadAllLedger);
  const adjust = useStore((state) => state.adjustBalance);
  const thanksAmount = useStore((state) => state.peerThanksAmount);
  const setThanksAmount = useStore((state) => state.setPeerThanksAmount);
  const [thanksDraft, setThanksDraft] = useState(thanksAmount);
  const [userId, setUserId] = useState(people[0]?.id ?? "");
  const [amount, setAmount] = useState(100);
  const [reason, setReason] = useState("");
  const [balanceType, setBalanceType] = useState<"Personal" | "Reward">("Personal");
  const [error, setError] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [ledgerQuery, setLedgerQuery] = useState("");
  const [ledgerType, setLedgerType] = useState<"all" | EntryType>("all");
  const sorted = [...ledger]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .filter((entry) => {
      if (ledgerType !== "all" && entry.type !== ledgerType) return false;
      const name = people.find((person) => person.id === entry.userId)?.name ?? "";
      return `${name} ${entry.reason}`.toLowerCase().includes(ledgerQuery.trim().toLowerCase());
    });
  const ledgerPage = usePage(sorted, 8, `${ledgerQuery}|${ledgerType}`);
  useEffect(() => {
    void loadAllLedger().catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "Не удалось загрузить транзакции");
    });
  }, [loadAllLedger]);
  return (
    <div className="space-y-4">
      <form
        className="space-y-3 rounded-lg bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!Number.isInteger(thanksDraft) || thanksDraft < 1) {
            toast.error("Укажите целое число апексов больше нуля");
            return;
          }
          setThanksAmount(thanksDraft);
          toast.success("Сумма благодарности сохранена");
        }}
      >
        <h2 className="font-bold">Личная благодарность</h2>
        <p className="text-sm text-muted">Сколько апексов получает коллега, когда ему говорят спасибо. С личного баланса отправителя ничего не списывается.</p>
        <Field label="Апексов за благодарность">
          <NumericInput value={thanksDraft} onChange={setThanksDraft} />
        </Field>
        <div className="flex gap-2">
          <Button type="submit">Сохранить</Button>
          <Button type="button" variant="line" onClick={() => setThanksDraft(thanksAmount)}>Отмена</Button>
        </div>
      </form>
      <form
        className="space-y-3 rounded-lg bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (adjusting) return;
          setAdjusting(true);
          void adjust({ userId, amount, reason, balanceType }).then((result) => {
            setAdjusting(false);
            if (!result.ok) toast.error(result.error);
            else {
              toast.success("Баланс обновлён");
              setReason("");
              void loadAllLedger();
            }
          });
        }}
      >
        <h2 className="font-bold">Корректировка</h2>
        <Field label="Какой баланс">
          <select
            className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
            value={balanceType}
            onChange={(event) => setBalanceType(event.target.value as "Personal" | "Reward")}
          >
            <option value="Personal">Личный</option>
            <option value="Reward">Рабочий, для поощрений</option>
          </select>
        </Field>
        <Field label="Сотрудник">
          <select
            className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          >
            {people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Сумма" hint="Отрицательная списывает апексы. Баланс ниже нуля невозможен.">
          <NumericInput value={amount} onChange={setAmount} />
        </Field>
        <Field label="Причина">
          <TextInput value={reason} onChange={(event) => setReason(event.target.value)} placeholder="За что корректировка" />
        </Field>
        <div className="flex gap-2">
          <Button type="submit" className="w-full" disabled={adjusting}>
            {adjusting ? "Проводим…" : "Провести"}
          </Button>
          <Button
            type="button"
            variant="line"
            onClick={() => {
              setAmount(100);
              setReason("");
              setBalanceType("Personal");
            }}
          >
            Отмена
          </Button>
        </div>
      </form>
      <div>
        {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
        <div className="mb-3 flex flex-wrap gap-2">
          <TextInput value={ledgerQuery} onChange={(event) => setLedgerQuery(event.target.value)} placeholder="Поиск по сотруднику или причине" aria-label="Поиск транзакций" className="max-w-sm" />
          <select className="h-11 rounded-md border border-line bg-surface px-3 text-sm" value={ledgerType} onChange={(event) => setLedgerType(event.target.value as "all" | EntryType)} aria-label="Тип операции">
            <option value="all">Все операции</option>
            {(Object.keys(ENTRY_LABEL) as EntryType[]).map((type) => (
              <option key={type} value={type}>{ENTRY_LABEL[type]}</option>
            ))}
          </select>
        </div>
        <ul className="divide-y divide-line rounded-lg border border-line">
          {ledger.length === 0 ? <li className="px-3 py-3 text-sm text-muted">Транзакций пока нет.</li> : null}
          {ledgerPage.items.map((entry) => (
            <li key={entry.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 px-3 py-2 text-sm">
              <p className="min-w-0 break-words">
                <span className="font-medium">{people.find((person) => person.id === entry.userId)?.name ?? "Сотрудник"}</span>
                <span className="text-muted"> · {entry.reason}</span>
              </p>
              <span className="shrink-0 tabular font-semibold">
                {entry.amount > 0 ? "+" : ""}
                {formatNumber(entry.amount)}
              </span>
            </li>
          ))}
        </ul>
        <Pager page={ledgerPage.page} pages={ledgerPage.pages} total={ledgerPage.total} onPage={ledgerPage.setPage} />
      </div>
    </div>
  );
}

function Tickets() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const tickets = useStore((state) => state.tickets);
  const ticketsError = useStore((state) => state.ticketsError);
  const loadTickets = useStore((state) => state.loadTickets);
  const setStatus = useStore((state) => state.setTicketStatus);
  const assignTicket = useStore((state) => state.assignTicket);
  const [ticketQuery, setTicketQuery] = useState("");
  const [ticketStatus, setTicketStatus] = useState<"all" | TicketStatus>("all");
  const filteredTickets = tickets.filter((ticket) => {
    if (ticketStatus !== "all" && ticket.status !== ticketStatus) return false;
    return `${ticket.subject ?? ""} ${ticket.id} ${ticket.userName ?? ""}`.toLowerCase().includes(ticketQuery.trim().toLowerCase());
  });
  const ticketPage = usePage(filteredTickets, 8, `${ticketQuery}|${ticketStatus}`);
  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);
  return (
    <div>
      <p className="mb-3 text-sm text-muted">Ответ пишется в карточке обращения.</p>
      <div className="mb-3 flex flex-wrap gap-2">
        <TextInput value={ticketQuery} onChange={(event) => setTicketQuery(event.target.value)} placeholder="Поиск обращения" aria-label="Поиск обращения" className="max-w-xs" />
        <select className="h-11 rounded-md border border-line bg-surface px-3 text-sm" value={ticketStatus} onChange={(event) => setTicketStatus(event.target.value as "all" | TicketStatus)} aria-label="Статус обращения">
          <option value="all">Все статусы</option>
          {(Object.keys(TICKET_STATUS) as TicketStatus[]).map((status) => (
            <option key={status} value={status}>{TICKET_STATUS[status]}</option>
          ))}
        </select>
      </div>
      {ticketsError ? <p className="mb-3 text-sm text-danger">{ticketsError}</p> : null}
      {tickets.length === 0 && !ticketsError ? <p className="text-sm text-muted">Обращений пока нет.</p> : null}
      <ul className="space-y-2">
        {ticketPage.items.map((ticket) => (
          <li key={ticket.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-card px-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{ticket.subject}</p>
              <p className="text-xs text-muted">
                {ticket.userName || "Сотрудник"}
                {ticket.assignedName ? ` · ведёт ${ticket.assignedName}` : " · не назначено"}
              </p>
            </div>
            <select
              className="h-10 rounded-md border border-line bg-surface px-2 text-sm"
              value={ticket.status}
              onChange={(event) => {
                void setStatus(ticket.id, event.target.value as TicketStatus).then((result) => {
                  if (!result.ok) toast.error(result.error);
                });
              }}
            >
              {(Object.keys(TICKET_STATUS) as TicketStatus[]).map((status) => (
                <option key={status} value={status}>
                  {TICKET_STATUS[status]}
                </option>
              ))}
            </select>
            {user && !ticket.assignedTo ? (
              <button
                type="button"
                className="text-sm font-semibold text-brand"
                onClick={() =>
                  void assignTicket(ticket.id, user.id).then((result) => {
                    if (!result.ok) toast.error(result.error);
                  })
                }
              >
                Взять
              </button>
            ) : null}
            <Link to="/support" className="text-sm font-semibold text-brand">
              Открыть
            </Link>
          </li>
        ))}
      </ul>
      <Pager page={ticketPage.page} pages={ticketPage.pages} total={ticketPage.total} onPage={ticketPage.setPage} />
    </div>
  );
}

function OptionField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [other, setOther] = useState(false);
  if (options.length === 0) {
    return (
      <Field label={label}>
        <TextInput value={value} onChange={(event) => onChange(event.target.value)} required />
      </Field>
    );
  }
  return (
    <Field label={label}>
      <select
        className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
        value={other ? "__custom" : value}
        onChange={(event) => {
          if (event.target.value === "__custom") {
            setOther(true);
            onChange("");
            return;
          }
          setOther(false);
          onChange(event.target.value);
        }}
        required={!other}
      >
        <option value="">Выберите</option>
        {options.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
        <option value="__custom">Другое</option>
      </select>
      {other ? (
        <TextInput className="mt-2" value={value} placeholder="Своё значение" onChange={(event) => onChange(event.target.value)} required />
      ) : null}
    </Field>
  );
}
