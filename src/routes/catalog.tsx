import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button, Chip, TextInput } from "@/components/ui";
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
  const [pending, setPending] = useState(false);

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

  function take(product: Product) {
    setPending(true);
    void addToCart(product.id).then((result) => {
      setPending(false);
      if (!result.ok) toast.error(result.error);
      else toast.success(`«${product.title}» в корзине`);
    });
  }

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">Каталог наград</h1>
      <p className="mt-2 text-sm text-muted">Выбирайте награды и оплачивайте их баллами.</p>

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

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <Chip key={item.id} active={filter === item.id} onClick={() => setFilter(item.id)}>
            {item.label}
          </Chip>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="mt-10 text-sm text-muted">Ничего не нашлось. Измените фильтр или запрос.</p>
      ) : (
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((product) => (
            <li key={product.id} className="flex flex-col rounded-lg bg-card p-3">
              <div className="overflow-hidden rounded-md bg-brand-soft">
                <img src={product.image} alt="" className="aspect-[16/10] w-full object-cover sm:aspect-[5/3]" />
              </div>
              <p className="mt-3 text-xs font-medium text-brand">
                {categoryLabel(product.category, product.categoryName)}
              </p>
              <h2 className="mt-1 font-bold">{product.title}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{product.description}</p>
              <p className="mt-3 text-sm">{formatPoints(product.price)}</p>
              <p className="text-xs text-muted">
                {product.stock > 0 ? `В наличии: ${product.stock}` : "Нет в наличии"}
              </p>
              <Button className="mt-3 w-full" disabled={product.stock <= 0 || pending} onClick={() => take(product)}>
                В корзину
              </Button>
            </li>
          ))}
        </ul>
      )}
    </Shell>
  );
}
