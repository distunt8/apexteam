import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Field, NumericInput, TextArea, TextInput } from "@/components/ui";
import { apex } from "@/lib/apex";
import { useStore } from "@/lib/store";

type Row = Record<string, unknown>;

function list(data: unknown): Row[] {
  const source = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items;
  return Array.isArray(source) ? source.filter((item): item is Row => Boolean(item) && typeof item === "object") : [];
}

export function ProductTools({ productId, onVariantCount }: { productId: string; onVariantCount?: (count: number) => void }) {
  const [variants, setVariants] = useState<Row[]>([]);
  const [categories, setCategories] = useState<Row[]>([]);
  const [badges, setBadges] = useState<Row[]>([]);
  const [assigned, setAssigned] = useState<Row[]>([]);
  const [discounts, setDiscounts] = useState<Row[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [stock, setStock] = useState("1");
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [badgeName, setBadgeName] = useState("");
  const [badgeColor, setBadgeColor] = useState("#306cc0");
  const [discount, setDiscount] = useState(10);
  const [targetVariant, setTargetVariant] = useState("");
  const reloadCatalog = useStore((state) => state.refresh);

  async function reload() {
    const [variantRows, categoryRows, badgeRows, assignedRows, discountRows] = await Promise.all([
      apex(`/api/products/${productId}/variants`).catch(() => []),
      apex("/api/products/variant-categories").catch(() => []),
      apex("/api/badges").catch(() => []),
      apex(`/api/products/${productId}/badges`).catch(() => []),
      apex(`/api/products/${productId}/discounts`).catch(() => []),
    ]);
    setVariants(list(variantRows));
    setCategories(list(categoryRows));
    setBadges(list(badgeRows));
    setAssigned(list(assignedRows));
    setDiscounts(list(discountRows));
    onVariantCount?.(list(variantRows).length);
  }

  useEffect(() => {
    void reload();
  }, [productId]);

  return (
    <div className="mt-4 space-y-4 rounded-xl border border-line bg-surface p-4 shadow-sm">
      <h3 className="font-bold">Варианты товара</h3>
      {variants.length === 0 ? <p className="text-sm text-muted">Вариантов нет — у товара общее фото и общий остаток.</p> : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="text-xs text-muted">
              <tr>
                <th className="py-2 pr-2 font-medium">Изображение</th>
                <th className="py-2 pr-2 font-medium">Название</th>
                <th className="py-2 pr-2 font-medium">Цена</th>
                <th className="py-2 pr-2 font-medium">Остаток</th>
                <th className="py-2 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {variants.map((item) => (
                <tr key={String(item.id)} className="border-t border-line">
                  <td className="py-2 pr-2">
                    {item.imageUrl ? <img src={String(item.imageUrl)} alt="" className="h-10 w-14 rounded object-cover" /> : <span className="text-xs text-muted">нет</span>}
                  </td>
                  <td className="py-2 pr-2">{String(item.name)}</td>
                  <td className="py-2 pr-2">{String(item.price ?? "")}</td>
                  <td className="py-2 pr-2">{String(item.stock ?? "")}</td>
                  <td className="py-2">
                    <button
                      type="button"
                      className="font-semibold text-danger"
                      onClick={() => {
                        void apex(`/api/products/${productId}/variants/${item.id}`, { method: "DELETE" })
                          .then(() => {
                            toast.success("Вариант удалён");
                            return reload();
                          })
                          .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
                      }}
                    >
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="grid gap-2">
        <TextInput value={name} onChange={(event) => setName(event.target.value)} placeholder="Название варианта" />
        <div className="grid grid-cols-2 gap-2">
          <NumericInput value={Number(price) || 0} onChange={(value) => setPrice(String(value))} placeholder="Цена" />
          <NumericInput value={Number(stock) || 0} onChange={(value) => setStock(String(value))} placeholder="Остаток" />
        </div>
        <select className="h-11 rounded-md border border-line bg-surface px-3 text-sm" value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
          <option value="">Без категории</option>
          {categories.map((item) => (
            <option key={String(item.id)} value={String(item.id)}>{String(item.name)}</option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="line"
            onClick={() => {
              void apex(`/api/products/${productId}/variants`, {
                method: "POST",
                body: JSON.stringify({ name, categoryId: categoryId ? Number(categoryId) : null, price: Number(price), stock: Number(stock) }),
              }).then(() => {
                setName("");
                setPrice("0");
                setStock("1");
                setCategoryId("");
                toast.success("Вариант создан");
                return reload();
              }).catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
            }}
          >
            Добавить вариант
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setName("");
              setPrice("0");
              setStock("1");
              setCategoryId("");
            }}
          >
            Отмена
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
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
          <Button type="button" variant="ghost" onClick={() => setCategoryName("")}>Отмена</Button>
        </div>
      </div>
      <h3 className="font-bold">Бейджи и скидки</h3>
      {variants.length > 0 ? (
        <select className="h-11 w-full rounded-md border border-line bg-surface px-3 text-sm" value={targetVariant} onChange={(event) => setTargetVariant(event.target.value)} aria-label="Вариант для бейджа и скидки">
          <option value="">Выберите вариант</option>
          {variants.map((variant) => (
            <option key={String(variant.id)} value={String(variant.id)}>{String(variant.name)}</option>
          ))}
        </select>
      ) : (
        <p className="text-sm text-muted">Вариантов нет — бейдж и скидка будут на весь товар.</p>
      )}
      <ul className="space-y-1 text-sm">
        {assigned.length === 0 ? <li className="text-muted">На товаре бейджей нет.</li> : null}
        {assigned.map((item) => (
          <li key={`a-${String(item.id)}`} className="flex items-center justify-between gap-2">
            <span>{String(item.name || item.badgeName || "Бейдж")}</span>
            <button
              type="button"
              className="text-xs font-semibold text-danger"
              onClick={() => {
                void apex(`/api/products/${productId}/badges/${item.id}`, { method: "DELETE" })
                  .then(() => {
                    toast.success("Бейдж снят с товара");
                    return reload();
                  })
                  .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
              }}
            >
              Снять
            </button>
          </li>
        ))}
        {badges.map((item) => (
          <li key={String(item.id)} className="flex flex-wrap items-center justify-between gap-2">
            <span className="rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ background: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(String(item.color || "")) ? String(item.color) : "#306cc0" }}>{String(item.name)}</span>
            <span className="flex gap-2">
              <button
                type="button"
                className="text-xs font-semibold text-brand"
                onClick={() => {
                  if (variants.length > 0 && !targetVariant) {
                    toast.error("Выберите вариант");
                    return;
                  }
                  const body = variants.length > 0
                    ? { badgeId: Number(item.id), productVariantId: Number(targetVariant) }
                    : { badgeId: Number(item.id), productVariantId: null };
                  void apex(`/api/products/${productId}/badges`, { method: "POST", body: JSON.stringify(body) })
                    .then(() => {
                      toast.success(variants.length > 0 ? "Бейдж назначен выбранному варианту" : "Бейдж назначен товару");
                      return reload();
                    })
                    .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
                }}
              >
                Назначить
              </button>
              <button
                type="button"
                className="text-xs font-semibold text-danger"
                onClick={() => {
                  void apex(`/api/badges/${item.id}`, { method: "DELETE" })
                    .then(() => {
                      toast.success("Бейдж удалён");
                      return reload();
                    })
                    .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
                }}
              >
                Удалить
              </button>
            </span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
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
          Сохранить бейдж
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setBadgeName("");
            setBadgeColor("#306cc0");
          }}
        >
          Отмена
        </Button>
      </div>
      <ul className="space-y-1 text-sm">
        {discounts.length === 0 ? <li className="text-muted">Скидок у этого товара нет.</li> : null}
        {discounts.map((item) => (
          <li key={String(item.id)} className="flex items-center justify-between gap-2">
            <span>{String(item.discountPercent)}%{item.productVariantId ? ` · вариант ${String(item.productVariantId)}` : ""}</span>
            <button
              type="button"
              className="text-xs font-semibold text-danger"
              onClick={() => {
                void apex(`/api/discounts/${item.id}`, { method: "DELETE" })
                  .then(() => {
                    toast.success("Скидка удалена");
                    return Promise.all([reload(), reloadCatalog()]);
                  })
                  .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
              }}
            >
              Удалить скидку
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2">
        <NumericInput value={discount} onChange={setDiscount} placeholder="Процент" />
        <Button
          variant="line"
          onClick={() => {
            if (variants.length > 0 && !targetVariant) {
              toast.error("Выберите вариант");
              return;
            }
            const body = {
              discountPercent: discount,
              startsAt: new Date().toISOString(),
              isActive: true,
              productVariantId: variants.length > 0 ? Number(targetVariant) : null,
            };
            void apex(`/api/products/${productId}/discounts`, { method: "POST", body: JSON.stringify(body) })
              .then(() => {
                toast.success(variants.length > 0 ? "Скидка сохранена для выбранного варианта" : "Скидка сохранена на весь товар");
                return Promise.all([reload(), reloadCatalog()]);
              })
              .catch((error: unknown) => toast.error(error instanceof Error ? error.message : "Не получилось"));
          }}
        >
          Сохранить скидку
        </Button>
        <Button type="button" variant="ghost" onClick={() => setDiscount(10)}>Отмена</Button>
      </div>
    </div>
  );
}

export function NewsDesk() {
  const uploadImage = useStore((state) => state.uploadImage);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [items, setItems] = useState<Row[]>([]);

  function clear() {
    setTitle("");
    setSummary("");
    setContent("");
    setImageUrl("");
  }

  function load() {
    void apex("/api/company-news?page=1&pageSize=20").then((data) => setItems(list(data))).catch(() => setItems([]));
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
      <form
        className="space-y-3 rounded-xl border-2 border-brand bg-brand-wash p-4 shadow-md"
        onSubmit={(event) => {
          event.preventDefault();
          void apex("/api/company-news", {
            method: "POST",
            body: JSON.stringify({ title, summary, content, imageUrl: imageUrl || null }),
          })
            .then(() => {
              clear();
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
        <Field label="Обложка">
          {imageUrl ? <img src={imageUrl} alt="" className="mb-2 aspect-[16/9] w-full rounded-md object-cover" /> : null}
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
                if (!file) return;
                setUploading(true);
                void uploadImage(file, "news").then((result) => {
                  setUploading(false);
                  if (!result.ok || !result.url) toast.error(result.ok ? "Сервер не вернул ссылку" : result.error);
                  else setImageUrl(result.url);
                });
              }}
            />
          </label>
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={uploading}>Опубликовать</Button>
          <Button type="button" variant="line" onClick={clear}>Отмена</Button>
        </div>
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
