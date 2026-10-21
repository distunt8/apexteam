import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Search } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as formatPoints, d as Button, f as Chip, g as TextInput, i as useStore } from "./router-CTHYymUA.mjs";
import { i as Shell, o as categoryLabel } from "./shell-BtVB375X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-DYpEkn0B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CatalogPage() {
	const products = useStore((state) => state.products);
	const categories = useStore((state) => state.categories);
	const addToCart = useStore((state) => state.addToCart);
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("popular");
	const [pending, setPending] = (0, import_react.useState)(false);
	const filters = [{
		id: "all",
		label: "Все"
	}, ...categories.map((category) => ({
		id: category.id,
		label: category.name
	}))];
	const list = (0, import_react.useMemo)(() => {
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
	}, [
		products,
		query,
		filter,
		sort
	]);
	function take(product) {
		setPending(true);
		addToCart(product.id).then((result) => {
			setPending(false);
			if (!result.ok) toast.error(result.error);
			else toast.success(`«${product.title}» в корзине`);
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, {
		mode: "shop",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Каталог наград"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Выбирайте награды и оплачивайте их баллами."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 flex flex-col gap-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Поиск по каталогу",
						className: "pl-9",
						"aria-label": "Поиск по каталогу"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "sr-only",
						children: "Сортировка"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: sort,
						onChange: (event) => setSort(event.target.value),
						className: "h-11 rounded-md border border-line bg-surface px-3 text-sm text-ink",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "popular",
								children: "Сначала популярные"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "asc",
								children: "Сначала дешевле"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "desc",
								children: "Сначала дороже"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: filters.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: filter === item.id,
					onClick: () => setFilter(item.id),
					children: item.label
				}, item.id))
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 text-sm text-muted",
				children: "Ничего не нашлось. Измените фильтр или запрос."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
				children: list.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col rounded-lg bg-card p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-md bg-brand-soft",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: product.image,
								alt: "",
								className: "aspect-[16/10] w-full object-cover sm:aspect-[5/3]"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs font-medium text-brand",
							children: categoryLabel(product.category, product.categoryName)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-bold",
							children: product.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 line-clamp-2 text-sm text-muted",
							children: product.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm",
							children: formatPoints(product.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: product.stock > 0 ? `В наличии: ${product.stock}` : "Нет в наличии"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-3 w-full",
							disabled: product.stock <= 0 || pending,
							onClick: () => take(product),
							children: "В корзину"
						})
					]
				}, product.id))
			})
		]
	});
}
//#endregion
export { CatalogPage as component };
