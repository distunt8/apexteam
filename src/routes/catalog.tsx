import { createFileRoute } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Pager, usePage } from "@/components/pager";
import { Shell } from "@/components/shell";
import { Button, Chip, TextInput } from "@/components/ui";
import { apex, listOf } from "@/lib/apex";
import { formatPoints } from "@/lib/format";
import { categoryLabel } from "@/lib/labels";
import { useStore, type Product } from "@/lib/store";

export const Route = createFileRoute("/catalog")({ component: CatalogPage });

const SORTS = ["popular", "asc", "desc"] as const;

function CatalogPage() {
  const products = useStore((state) => state.products);
  const categories = useStore((state) => state.categories);
  const addToCart = useStore((state) => state.addToCart);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("popular");
  const [pendingId, setPendingId] = useState("");
  const [opened, setOpened] = useState<Product | null>(null);

  const filters = [
    { id: "all", label: "Все" },
    ...categories.map((category) => ({ id: category.id, label: category.name })),
  ];

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const next = products.filter((product) => {
      if (!product.active) return false;
      if (filter !== "all" && product.category !== filter) return false;
      if (!needle) return true;
      return `${product.title} ${product.description}`.toLowerCase().includes(needle);
    });
    if (sort === "asc") next.sort((a, b) => a.price - b.price);
    if (sort === "desc") next.sort((a, b) => b.price - a.price);
    return next;
  }, [products, query, filter, sort]);
  const page = usePage(list, 6, `${filter}|${sort}|${query}`);

  function take(product: Product) {
    if (pendingId) return;
    setPendingId(product.id);
    void addToCart(product.id).then((result) => {
      setPendingId("");
      if (!result.ok) toast.error(result.error);
      else toast.success(`«${product.title}» в корзине`);
    });
  }

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">Каталог наград</h1>
      <p className="mt-2 text-sm text-muted">Выбирайте награды и оплачивайте их апексами.</p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
          <TextInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск по каталогу"
            className="pl-9"
            aria-label="Поиск по каталогу"
          />
        </div>
        <label className="text-sm text-muted">
          <span className="sr-only">Сортировка</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as typeof sort)}
            className="h-11 rounded-md border border-line bg-surface px-3 text-sm text-ink"
          >
            <option value="popular">Сначала популярные</option>
            <option value="asc">Сначала дешевле</option>
            <option value="desc">Сначала дороже</option>
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {filters.map((item) => (
          <Chip key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-sm text-muted">Ничего не нашлось. Измените фильтр или запрос.</p>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {page.items.map((product) => (
            <li key={product.id} className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition hover:-translate-y-0.5 hover:border-brand-mid">
              <button type="button" className="text-left" onClick={() => setOpened(product)}>
                <div className="overflow-hidden bg-brand-soft">
                  <img src={product.image} alt="" className="aspect-[4/3] w-full object-cover" />
                </div>
                <div className="p-4 pb-0">
                  <p className="text-xs font-medium text-brand">{categoryLabel(product.category, product.categoryName)}</p>
                  <div className="mt-1 flex items-start justify-between gap-3">
                    <h2 className="font-bold">{product.title}</h2>
                    <p className="shrink-0 text-sm font-bold text-brand">{formatPoints(product.price)}</p>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
                  <p className="mt-3 text-xs text-muted">{product.stock > 0 ? `В наличии: ${product.stock}` : "Нет в наличии"}</p>
                </div>
              </button>
              <div className="mt-auto p-4">
                <Button className="w-full" disabled={product.stock <= 0 || pendingId !== ""} onClick={() => take(product)}>
                  {pendingId === product.id ? "Добавляем…" : "В корзину"}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page.page} pages={page.pages} total={page.total} onPage={page.setPage} />
      {opened ? (
        <ProductCard
          product={opened}
          pending={pendingId === opened.id}
          locked={pendingId !== ""}
          onClose={() => setOpened(null)}
          onTake={() => take(opened)}
        />
      ) : null}
    </Shell>
  );
}

function ProductCard({
  product,
  pending,
  locked,
  onClose,
  onTake,
}: {
  product: Product;
  pending: boolean;
  locked: boolean;
  onClose: () => void;
  onTake: () => void;
}) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedId, setSelectedId] = useState("");
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  useEffect(() => {
    let ignore = false;
    setVariants([]);
    setSelectedId("");
    void Promise.all([
      apex(`/api/products/${product.id}/variants`).catch(() => null),
      apex(`/api/products/${product.id}`).catch(() => null),
    ]).then(([listed, details]) => {
      if (ignore) return;
      const source = listed ?? (details && typeof details === "object" ? (details as { variants?: unknown }).variants : null);
      const next = listOf(source)
        .map(mapVariant)
        .filter((item): item is ProductVariant => item != null && item.active);
      setVariants(next);
      const same = next.find((item) => item.image && item.image === product.image) ?? next[0];
      if (same) setSelectedId(same.id);
    });
    return () => {
      ignore = true;
    };
  }, [product.id]);

  const selected = variants.find((item) => item.id === selectedId) ?? null;
  const image = selected?.image || product.image;
  const price = selected?.price ?? product.price;
  const stock = selected?.stock ?? product.stock;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-card-title"
        className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-surface shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="bg-brand-soft">
            <img src={image} alt="" className="aspect-square w-full object-cover md:h-full md:aspect-auto" />
          </div>
          <div className="relative p-5 sm:p-6">
            <button
              type="button"
              className="absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-card"
              aria-label="Закрыть"
              onClick={onClose}
            >
              <X className="size-4" />
            </button>
            <p className="pr-12 text-xs font-semibold text-brand">{categoryLabel(product.category, product.categoryName)}</p>
            <h2 id="product-card-title" className="mt-2 pr-12 text-2xl font-bold">
              {product.title}
            </h2>
            <p className="mt-3 text-2xl font-bold text-brand">{formatPoints(price)}</p>
            <p className="mt-4 text-sm leading-6">{product.description || "Описание пока не добавлено."}</p>
            {variants.length > 0 ? (
              <div className="mt-4">
                <p className="text-xs text-muted">Вариант</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {variants.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className={`min-h-9 rounded-full px-3 text-sm font-medium ${selectedId === item.id ? "bg-brand text-white" : "bg-card"}`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Наличие</dt>
                <dd className="font-medium">{stock > 0 ? `${stock} шт.` : "Нет в наличии"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Формат</dt>
                <dd className="font-medium">{product.isDigital ? "Цифровой" : "Физический"}</dd>
              </div>
            </dl>
            <Button className="mt-6 w-full" disabled={stock <= 0 || locked} onClick={onTake}>
              {pending ? "Добавляем…" : "В корзину"}
            </Button>
          </div>
        </div>
      </article>
    </div>
  );
}

type ProductVariant = {
  id: string;
  name: string;
  image: string;
  price: number | null;
  stock: number | null;
  active: boolean;
};

function mapVariant(raw: unknown): ProductVariant | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const id = record.id ?? record.variantId;
  if (id == null) return null;
  const price = record.price == null || record.price === "" ? null : Number(record.price);
  const stock = record.stock == null || record.stock === "" ? null : Number(record.stock);
  const image = record.imageUrl || record.image;
  return {
    id: String(id),
    name: String(record.name || record.title || "Вариант"),
    image: typeof image === "string" ? image : "",
    price: Number.isFinite(price) ? price : null,
    stock: Number.isFinite(stock) ? stock : null,
    active: record.isActive !== false && record.active !== false,
  };
}
