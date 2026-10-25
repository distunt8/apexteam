import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { categoryLabel, ORDER_FLOW, orderStatusLabel, TICKET_STATUS } from "@/lib/labels";
import {
  isAdminRole,
  useStore,
  type Product,
  type TicketStatus,
} from "@/lib/store";

export const Route = createFileRoute("/admin")({ component: AdminPage });

const TABS = ["Товары", "Заказы", "Сотрудники", "Активности", "Экономика", "Обращения"] as const;

function AdminPage() {
  const user = useStore((state) => state.people.find((person) => person.id === state.currentUserId));
  const [tab, setTab] = useState<(typeof TABS)[number]>("Товары");
  if (!user) return null;
  if (!isAdminRole(user.role)) {
    return (
      <Shell mode="top">
        <h1 className="text-3xl font-bold">Недостаточно прав</h1>
        <p className="mt-2 text-sm text-muted">Администрирование доступно администратору и главному администратору.</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-brand">
          На главную
        </Link>
      </Shell>
    );
  }

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">Администрирование</h1>
      <p className="mt-2 text-sm text-muted">
        Вы вошли как {user.name}. Роли, балансы, товары, заказы и обращения пишутся в базу.
      </p>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`min-h-11 shrink-0 rounded-md px-3 text-sm font-semibold ${
              tab === item ? "bg-brand text-white" : "bg-card"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="mt-5">{tab === "Товары" ? <Products /> : null}</div>
      <div>{tab === "Заказы" ? <Orders /> : null}</div>
      <div>{tab === "Сотрудники" ? <People /> : null}</div>
      <div>{tab === "Активности" ? <Activities /> : null}</div>
      <div>{tab === "Экономика" ? <Economy /> : null}</div>
      <div>{tab === "Обращения" ? <Tickets /> : null}</div>
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
  const [draft, setDraft] = useState<Product | null>(null);

  return (
    <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
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
            {products.map((product) => (
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
      <form
        className="space-y-3 rounded-lg bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!draft) return;
          void save(draft).then((result) => {
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
              <Field label="Цена, баллы">
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
            <Button type="submit" className="w-full">
              Сохранить
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
  const orders = useStore((state) => state.orders);
  const people = useStore((state) => state.people);
  const setStatus = useStore((state) => state.setOrderStatus);
  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        Сервер отдаёт историю заказов текущего пользователя. Общей очереди всех сотрудников в описании API нет — если
        здесь только ваши заказы, так и задумано.
      </p>
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
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-line">
              <td className="px-3 py-2">{order.id}</td>
              <td className="px-3 py-2">{people.find((person) => person.id === order.userId)?.name}</td>
              <td className="px-3 py-2">{order.items.map((item) => `${item.title} ×${item.qty}`).join(", ")}</td>
              <td className="px-3 py-2 tabular">{formatNumber(order.total)}</td>
              <td className="px-3 py-2">
                <select
                  className="h-10 rounded-md border border-line bg-surface px-2"
                  value={ORDER_FLOW.includes(order.status as (typeof ORDER_FLOW)[number]) ? order.status : order.status}
                  onChange={(event) => {
                    void setStatus(order.id, event.target.value).then((result) => {
                      if (!result.ok) toast.error(result.error);
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
    </div>
  );
}

function People() {
  const people = useStore((state) => state.people);
  const me = useStore((state) => state.currentUserId);
  const roles = useStore((state) => state.roleCatalog);
  const setRole = useStore((state) => state.setUserRole);
  const setStatus = useStore((state) => state.setUserStatus);
  const createEmployee = useStore((state) => state.createEmployee);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [pending, setPending] = useState(false);

  return (
    <div>
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
        <Field label="Отдел">
          <TextInput value={department} onChange={(event) => setDepartment(event.target.value)} required />
        </Field>
        <Field label="Должность">
          <TextInput value={position} onChange={(event) => setPosition(event.target.value)} required />
        </Field>
        <Button type="submit" disabled={pending} className="sm:col-span-2 sm:w-auto">
          Создать
        </Button>
      </form>
      <p className="mb-3 text-sm text-muted">
        В списке виден только ваш личный баланс: чужие суммы сервер отдельно не отдаёт. Роль новому сотруднику можно назначить ниже.
      </p>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-card text-xs text-muted">
            <tr>
              <th className="px-3 py-2 font-medium">Сотрудник</th>
              <th className="px-3 py-2 font-medium">Отдел</th>
              <th className="px-3 py-2 font-medium">Личный баланс</th>
              <th className="px-3 py-2 font-medium">Роль</th>
              <th className="px-3 py-2 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => {
              const code = person.roleCodes?.[0] ?? "";
              return (
                <tr key={person.id} className="border-t border-line">
                  <td className="px-3 py-2">
                    <p className="font-medium">{person.name}</p>
                    <p className="text-xs text-muted">{person.position}</p>
                  </td>
                  <td className="px-3 py-2">{person.department}</td>
                  <td className="px-3 py-2 tabular">{person.id === me ? formatNumber(person.balance) : "—"}</td>
                  <td className="px-3 py-2">
                    <select
                      className="h-10 max-w-48 rounded-md border border-line bg-surface px-2"
                      value={code}
                      onChange={(event) => {
                        void setRole(person.id, event.target.value).then((result) => {
                          if (!result.ok) toast.error(result.error);
                        });
                      }}
                    >
                      {code && !roles.some((role) => role.code === code) ? <option value={code}>{code}</option> : null}
                      {roles.map((role) => (
                        <option key={role.code} value={role.code}>
                          {role.name}
                        </option>
                      ))}
                    </select>
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
    </div>
  );
}

function Activities() {
  return (
    <p className="max-w-2xl text-sm text-muted">
      Квесты, опросы и мероприятия сотрудники видят во вкладке «Активности». Они приходят с сервера. Создавать и править их пока нужно через API.
    </p>
  );
}

function Economy() {
  const people = useStore((state) => state.people);
  const ledgerAll = useStore((state) => state.ledger);
  const ledger = ledgerAll.slice(0, 12);
  const adjust = useStore((state) => state.adjustBalance);
  const [userId, setUserId] = useState(people[0]?.id ?? "");
  const [amount, setAmount] = useState(100);
  const [reason, setReason] = useState("");
  const [balanceType, setBalanceType] = useState<"Personal" | "Reward">("Personal");
  return (
    <div className="grid items-start gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <form
        className="space-y-3 rounded-lg bg-card p-4"
        onSubmit={(event) => {
          event.preventDefault();
          void adjust({ userId, amount, reason, balanceType }).then((result) => {
            if (!result.ok) toast.error(result.error);
            else {
              toast.success("Баланс обновлён");
              setReason("");
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
        <Field label="Сумма" hint="Отрицательная списывает баллы. Баланс ниже нуля невозможен.">
          <TextInput inputMode="numeric" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
        </Field>
        <Field label="Причина">
          <TextInput value={reason} onChange={(event) => setReason(event.target.value)} placeholder="За что корректировка" />
        </Field>
        <Button type="submit" className="w-full">
          Провести
        </Button>
      </form>
      <ul className="divide-y divide-line rounded-lg border border-line">
        {ledger.map((entry) => (
          <li key={entry.id} className="px-3 py-2 text-sm">
            <span className="font-medium">{people.find((person) => person.id === entry.userId)?.name}</span>
            <span className="text-muted"> · {entry.reason}</span>
            <span className="float-right tabular font-semibold">
              {entry.amount > 0 ? "+" : ""}
              {formatNumber(entry.amount)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Tickets() {
  const tickets = useStore((state) => state.tickets);
  const ticketsError = useStore((state) => state.ticketsError);
  const loadTickets = useStore((state) => state.loadTickets);
  const setStatus = useStore((state) => state.setTicketStatus);
  useEffect(() => {
    void loadTickets();
  }, [loadTickets]);
  return (
    <div>
      <p className="mb-3 text-sm text-muted">Ответ пишется в карточке обращения.</p>
      {ticketsError ? <p className="mb-3 text-sm text-danger">{ticketsError}</p> : null}
      <ul className="space-y-2">
        {tickets.map((ticket) => (
          <li key={ticket.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-card px-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{ticket.subject}</p>
              <p className="text-xs text-muted">{ticket.userName}</p>
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
            <Link to="/support" className="text-sm font-semibold text-brand">
              Открыть
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
