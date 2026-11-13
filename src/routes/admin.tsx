import { AdminActivities } from "@/components/admin-activities";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Pager, usePage } from "@/components/pager";
import { Shell } from "@/components/shell";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { categoryLabel, ORDER_FLOW, orderStatusLabel, roleCodeLabel, TICKET_STATUS } from "@/lib/labels";
import {
  canManageActivities,
  canManageShop,
  canOpenAdmin,
  useStore,
  type Product,
  type Role,
  type TicketStatus,
} from "@/lib/store";

export const Route = createFileRoute("/admin")({ component: AdminPage });

const TABS = ["Товары", "Заказы", "Сотрудники", "Активности", "Экономика", "Обращения"] as const;
type AdminTab = (typeof TABS)[number];

function tabsFor(role: Role): AdminTab[] {
  if (role === "hr") return ["Активности"];
  if (role === "merchandiser") return ["Товары", "Заказы"];
  if (role === "support") return ["Обращения"];
  if (role === "manager") return ["Сотрудники"];
  return [...TABS];
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
      </div>
    </Shell>
  );
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
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const page = usePage(products, 8);

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-card text-xs text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Название</th>
              <th className="px-3 py-2 font-medium">Категория</th>
              <th className="px-3 py-2 font-medium">Цена</th>
              <th className="px-3 py-2 font-medium">Остаток</th>
              <th className="px-3 py-2 font-medium">Статус</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {page.items.map((product) => (
              <tr key={product.id} className="border-t border-line">
                <td className="px-3 py-2">{product.title}</td>
                <td className="px-3 py-2">{categoryLabel(product.category, product.categoryName)}</td>
                <td className="px-3 py-2 tabular">{formatNumber(product.price)}</td>
                <td className="px-3 py-2 tabular">{product.stock}</td>
                <td className="px-3 py-2">{product.active ? "В каталоге" : "Скрыт"}</td>
                <td className="px-3 py-2 text-right">
                  <button type="button" className="font-semibold text-brand" onClick={() => setDraft(product)}>
                    Изменить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pager page={page.page} pages={page.pages} total={page.total} onPage={page.setPage} />
      </div>
      <form
        className="space-y-3 rounded-lg bg-card p-4"
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
        <div className="flex items-center justify-between">
          <h2 className="font-bold">{draft ? "Карточка товара" : "Товар"}</h2>
          <button type="button" className="text-sm font-semibold text-brand" onClick={() => setDraft(emptyProduct())}>
            Новый
          </button>
        </div>
        {draft ? (
          <>
            <Field label="Название">
              <TextInput value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
            </Field>
            <Field label="Описание">
              <TextArea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
            </Field>
            <Field label="Фото">
              {draft.image.startsWith("http") ? (
                <img src={draft.image} alt="" className="mb-2 h-24 w-24 rounded-md object-cover" />
              ) : null}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="block w-full text-sm"
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
              <p className="mt-1 text-xs text-muted">{uploading ? "Загружаем фото…" : "JPEG, PNG или WebP, до 2 МБ."}</p>
            </Field>
            <Field label="Категория">
              {categories.length === 0 ? (
                <TextInput
                  value={draft.category}
                  inputMode="numeric"
                  placeholder="id категории"
                  onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                />
              ) : (
                <select
                  className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm"
                  value={draft.category}
                  onChange={(event) => setDraft({ ...draft, category: event.target.value })}
                >
                  <option value="">Без категории</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Цена, апексы">
                <TextInput
                  inputMode="numeric"
                  value={draft.price}
                  onChange={(event) => setDraft({ ...draft, price: Number(event.target.value) })}
                />
              </Field>
              <Field label="Остаток">
                <TextInput
                  inputMode="numeric"
                  value={draft.stock}
                  onChange={(event) => setDraft({ ...draft, stock: Number(event.target.value) })}
                />
              </Field>
            </div>
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(event) => setDraft({ ...draft, active: event.target.checked })}
              />
              Показывать в каталоге
            </label>
            <Button type="submit" className="w-full" disabled={saving || uploading}>
              {saving ? "Сохраняем…" : "Сохранить"}
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted">Выберите товар или создайте новый.</p>
        )}
      </form>
    </div>
  );
}

function Orders() {
  const orders = useStore((state) => state.allOrders);
  const people = useStore((state) => state.people);
  const setStatus = useStore((state) => state.setOrderStatus);
  const loadAllOrders = useStore((state) => state.loadAllOrders);
  const [error, setError] = useState("");
  const page = usePage(orders, 8);
  useEffect(() => {
    void loadAllOrders().catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "Не удалось загрузить заказы");
    });
  }, [loadAllOrders]);
  return (
    <div>
      {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
      {orders.length === 0 && !error ? <p className="mb-3 text-sm text-muted">Заказов пока нет.</p> : null}
      <div className="overflow-x-auto rounded-lg border border-line">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-card text-xs text-muted">
          <tr>
            <th className="px-3 py-2 font-medium">Заказ</th>
            <th className="px-3 py-2 font-medium">Сотрудник</th>
            <th className="px-3 py-2 font-medium">Состав</th>
            <th className="px-3 py-2 font-medium">Сумма</th>
            <th className="px-3 py-2 font-medium">Статус</th>
          </tr>
        </thead>
        <tbody>
          {page.items.map((order) => (
            <tr key={order.id} className="border-t border-line">
              <td className="px-3 py-2">{order.id}</td>
              <td className="px-3 py-2">{people.find((person) => person.id === order.userId)?.name ?? "Сотрудник"}</td>
              <td className="px-3 py-2">{order.items.map((item) => `${item.title} ×${item.qty}`).join(", ")}</td>
              <td className="px-3 py-2 tabular">{formatNumber(order.total)}</td>
              <td className="px-3 py-2">
                <select
                  className="h-10 rounded-md border border-line bg-surface px-2"
                  value={order.status}
                  onChange={(event) => {
                    void setStatus(order.id, event.target.value).then((result) => {
                      if (!result.ok) toast.error(result.error);
                      else toast.success(event.target.value === "cancelled" ? "Заказ отменён, апексы вернулись на баланс" : "Статус заказа обновлён");
                    });
                  }}
                >
                  {!ORDER_FLOW.includes(order.status as (typeof ORDER_FLOW)[number]) ? (
                    <option value={order.status}>{orderStatusLabel(order.status)}</option>
                  ) : null}
                  {ORDER_FLOW.map((status) => (
                    <option key={status} value={status}>
                      {orderStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <Pager page={page.page} pages={page.pages} total={page.total} onPage={page.setPage} />
    </div>
  );
}

function People() {
  const people = useStore((state) => state.people);
  const me = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const departmentIds = useStore((state) => state.departmentIds);
  const visible = me?.role === "manager" ? people.filter((person) => departmentIds.includes(person.id)) : people;
  const peoplePage = usePage(visible, 8);
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
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
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

  return (
    <div>
      {canCreate ? (
      <form
        className="mb-4 grid gap-3 rounded-lg bg-card p-4 sm:grid-cols-2"
        onSubmit={(event) => {
          event.preventDefault();
          setPending(true);
          void createEmployee({ email, password, firstName, lastName, middleName, department, position }).then((result) => {
            setPending(false);
            if (!result.ok) toast.error(result.error);
            else {
              toast.success("Сотрудник создан. При первом входе он должен сменить пароль.");
              setEmail("");
              setPassword("");
              setFirstName("");
              setLastName("");
              setMiddleName("");
            }
          });
        }}
      >
        <h2 className="text-lg font-bold sm:col-span-2">Новый сотрудник</h2>
        <Field label="Почта">
          <TextInput type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </Field>
        <Field label="Временный пароль">
          <TextInput type="text" value={password} onChange={(event) => setPassword(event.target.value)} required />
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
        <OptionField label="Отдел" value={department} options={[...new Set(people.map((person) => person.department.trim()).filter(Boolean))].sort()} onChange={setDepartment} />
        <OptionField label="Должность" value={position} options={[...new Set(people.map((person) => person.position.trim()).filter(Boolean))].sort()} onChange={setPosition} />
        <Button type="submit" disabled={pending} className="sm:col-span-2 sm:w-auto">
          Создать
        </Button>
      </form>
      ) : null}
      {editing ? (
        <form
          className="mb-4 grid gap-3 rounded-lg bg-card p-4 sm:grid-cols-2"
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
                    <p className="font-medium">{person.name}</p>
                    <p className="text-xs text-muted">{person.position}</p>
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
  const [userId, setUserId] = useState(people[0]?.id ?? "");
  const [amount, setAmount] = useState(100);
  const [reason, setReason] = useState("");
  const [balanceType, setBalanceType] = useState<"Personal" | "Reward">("Personal");
  const [error, setError] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const ledgerPage = usePage(ledger, 8);
  useEffect(() => {
    void loadAllLedger().catch((reason: unknown) => {
      setError(reason instanceof Error ? reason.message : "Не удалось загрузить транзакции");
    });
  }, [loadAllLedger]);
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
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
          <TextInput inputMode="numeric" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
        </Field>
        <Field label="Причина">
          <TextInput value={reason} onChange={(event) => setReason(event.target.value)} placeholder="За что корректировка" />
        </Field>
        <Button type="submit" className="w-full" disabled={adjusting}>
          {adjusting ? "Проводим…" : "Провести"}
        </Button>
      </form>
      <div>
        {error ? <p className="mb-3 text-sm text-danger">{error}</p> : null}
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
  const ticketPage = usePage(tickets, 8);
  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);
  return (
    <div>
      <p className="mb-3 text-sm text-muted">Ответ пишется в карточке обращения.</p>
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
