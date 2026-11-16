import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Field, TextArea, TextInput } from "@/components/ui";
import { apex } from "@/lib/apex";

type Row = Record<string, unknown>;

function list(data: unknown): Row[] {
  const source = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items;
  return Array.isArray(source) ? source.filter((item): item is Row => Boolean(item) && typeof item === "object") : [];
}

export function ProductTools({ productId }: { productId: string }) {
  const [variants, setVariants] = useState<Row[]>([]);
  const [categories, setCategories] = useState<Row[]>([]);
  const [badges, setBadges] = useState<Row[]>([]);
  const [discounts, setDiscounts] = useState<Row[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [stock, setStock] = useState("1");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [badgeName, setBadgeName] = useState("");
  const [badgeColor, setBadgeColor] = useState("#306cc0");
  const [discount, setDiscount] = useState("10");

  async function reload() {
    const [variantRows, categoryRows, badgeRows, discountRows] = await Promise.all([
      apex(`/api/products/${productId}/variants`).catch(() => []),
      apex("/api/products/variant-categories").catch(() => []),
      apex("/api/badges").catch(() => []),
      apex(`/api/products/${productId}/discounts`).catch(() => []),
    ]);
    setVariants(list(variantRows));
    setCategories(list(categoryRows));
    setBadges(list(badgeRows));
    setDiscounts(list(discountRows));
  }

  useEffect(() => {
    void reload();
  }, [productId]);

  return (
    <div className="mt-4 space-y-4 rounded-xl border border-line bg-surface p-4 shadow-sm">
      <h3 className="font-bold">Варианты</h3>
      <ul className="space-y-1 text-sm">
        {variants.map((item) => (
          <li key={String(item.id)} className="flex justify-between gap-2">
            <span>{String(item.name)}</span>
            <span className="text-muted">{String(item.price ?? "")} · {String(item.stock ?? "")}</span>
          </li>
        ))}
        {variants.length === 0 ? <li className="text-muted">Вариантов нет.</li> : null}
      </ul>
      <div className="grid gap-2">
        <TextInput value={name} onChange={(event) => setName(event.target.value)} placeholder="Название варианта" />
        <div className="grid grid-cols-2 gap-2">
          <TextInput value={price} onChange={(event) => setPrice(event.target.value)} placeholder="Цена" />
          <TextInput value={stock} onChange={(event) => setStock(event.target.value)} placeholder="Остаток" />
        </div>
        <select className="h-11 rounded-md border border-line bg-surface px-3 text-sm" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">Без категории</option>
          {categories.map((item) => (
            <option key={String(item.id)} value={String(item.id)}>{String(item.name)}</option>
          ))}
        </select>
        <Button
          variant="line"
          onClick={() => {
            void apex(`/api/products/${productId}/variants`, {
              method: "POST",
              body: JSON.stringify({ name, categoryId: categoryId ? Number(categoryId) : null, price: Number(price), stock: Number(stock) }),
            }).then(() => {
              setName("");
              toast.success("Вариант создан");
              return reload();
            }).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
          }}
        >
          Добавить вариант
        </Button>
        <div className="flex gap-2">
          <TextInput value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="Новая категория вариантов" />
          <Button
            variant="line"
            onClick={() => {
              void apex("/api/products/variant-categories", { method: "POST", body: JSON.stringify({ name: categoryName }) })
                .then(() => {
                  setCategoryName("");
                  toast.success("Категория создана");
                  return reload();
                })
                .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
            }}
          >
            Создать
          </Button>
        </div>
      </div>
      <h3 className="font-bold">Бейджи и скидки</h3>
      <ul className="space-y-1 text-sm">
        {badges.map((item) => (
          <li key={String(item.id)} className="flex items-center justify-between gap-2">
            <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ background: String(item.color || "#306cc0") }}>{String(item.name)}</span>
            <button
              type="button"
              className="text-xs font-semibold text-brand"
              onClick={() => {
                void apex(`/api/products/${productId}/badges`, { method: "POST", body: JSON.stringify({ badgeId: Number(item.id) }) })
                  .then(() => toast.success("Бейдж назначен"))
                  .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
              }}
            >
              Назначить
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <TextInput value={badgeName} onChange={(event) => setBadgeName(event.target.value)} placeholder="Новый бейдж" />
        <input aria-label="Цвет бейджа" type="color" value={badgeColor} onChange={(event) => setBadgeColor(event.target.value)} className="size-11" />
        <Button
          variant="line"
          onClick={() => {
            void apex("/api/badges", {
              method: "POST",
              body: JSON.stringify({ name: badgeName, color: badgeColor, code: badgeName.toLowerCase().replace(/\s+/g, "-"), isActive: true, sortOrder: 0, assignmentType: "manual" }),
            }).then(() => {
              setBadgeName("");
              toast.success("Бейдж создан");
              return reload();
            }).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
          }}
        >
          Бейдж
        </Button>
      </div>
      <p className="text-sm text-muted">Скидки: {discounts.map((item) => `${item.discountPercent}%`).join(", ") || "нет"}</p>
      <div className="flex gap-2">
        <TextInput value={discount} onChange={(event) => setDiscount(event.target.value)} placeholder="Процент" />
        <Button
          variant="line"
          onClick={() => {
            void apex(`/api/products/${productId}/discounts`, {
              method: "POST",
              body: JSON.stringify({ discountPercent: Number(discount), startsAt: new Date().toISOString(), isActive: true }),
            }).then(() => {
              toast.success("Скидка сохранена");
              return reload();
            }).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
          }}
        >
          Скидка
        </Button>
      </div>
    </div>
  );
}

export function NewsDesk() {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [items, setItems] = useState<Row[]>([]);

  function load() {
    void apex("/api/company-news?page=1&pageSize=20").then((data) => setItems(list(data))).catch(() => setItems([]));
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <form
        className="space-y-3 rounded-xl border border-line bg-surface p-4 shadow-sm"
        onSubmit={(event) => {
          event.preventDefault();
          void apex("/api/company-news", { method: "POST", body: JSON.stringify({ title, summary, content }) })
            .then(() => {
              setTitle("");
              setSummary("");
              setContent("");
              toast.success("Новость опубликована");
              load();
            })
            .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
        }}
      >
        <h2 className="font-bold">Новая новость</h2>
        <Field label="Заголовок"><TextInput value={title} onChange={(event) => setTitle(event.target.value)} required /></Field>
        <Field label="Коротко"><TextInput value={summary} onChange={(event) => setSummary(event.target.value)} /></Field>
        <Field label="Текст"><TextArea value={content} onChange={(event) => setContent(event.target.value)} /></Field>
        <Button type="submit">Опубликовать</Button>
      </form>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={String(item.id)} className="rounded-xl border border-line bg-gradient-to-r from-brand-wash to-surface px-4 py-3">
            <p className="font-semibold">{String(item.title)}</p>
            <p className="mt-1 text-sm text-muted">{String(item.summary || "")}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
