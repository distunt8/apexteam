import { i as __toESM } from "../_runtime.mjs";
import { X as require_react, w as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Search, n as X } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { E as TextInput, S as Chip, f as useStore, m as listOf, p as apex, v as formatPoints, x as Button } from "./router-Dr41VdEz.mjs";
import { a as Shell, c as categoryLabel } from "./shell-1JLU4O9d.mjs";
import { n as usePage, t as Pager } from "./pager-DvNdDOo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-D0BuFbhT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CatalogPage() {
	const products = useStore((state) => state.products);
	const categories = useStore((state) => state.categories);
	const addToCart = useStore((state) => state.addToCart);
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("popular");
	const [pendingId, setPendingId] = (0, import_react.useState)("");
	const [opened, setOpened] = (0, import_react.useState)(null);
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
	const page = usePage(list, 6, `${filter}|${sort}|${query}`);
	function take(product, variantId) {
		if (pendingId) return;
		setPendingId(product.id);
		addToCart(product.id, variantId).then((result) => {
			setPendingId("");
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
				children: "Выбирайте награды и оплачивайте их апексами."
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
				className: "mt-4 flex flex-wrap gap-2",
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
				className: "mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
				children: page.items.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex flex-col overflow-hidden rounded-xl border border-line bg-surface transition hover:-translate-y-0.5 hover:border-brand-mid",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "text-left",
						onClick: () => setOpened(product),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative overflow-hidden bg-brand-soft",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: product.image,
									alt: "",
									className: "aspect-[4/3] w-full object-cover"
								}),
								product.badges && product.badges.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-2 left-2 flex flex-wrap gap-1",
									children: product.badges.map((badge) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full px-2 py-0.5 text-[11px] font-semibold text-white",
										style: { background: badge.color },
										children: badge.name
									}, badge.name))
								}) : null,
								product.discountPercent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "absolute top-2 right-2 rounded-full bg-rose-600 px-2 py-0.5 text-[11px] font-semibold text-white",
									children: [
										"−",
										product.discountPercent,
										"%"
									]
								}) : null
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 pb-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium text-brand",
									children: categoryLabel(product.category, product.categoryName)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-bold",
										children: product.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "shrink-0 text-right text-sm font-bold text-brand",
										children: [product.originalPrice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "mr-1 text-xs font-medium text-muted line-through",
											children: formatPoints(product.originalPrice)
										}) : null, formatPoints(product.price)]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 line-clamp-2 text-sm text-muted",
									children: product.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-muted",
									children: product.stock > 0 ? `В наличии: ${product.stock}` : "Нет в наличии"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-auto p-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "w-full",
							disabled: product.stock <= 0 || pendingId !== "",
							onClick: () => take(product),
							children: pendingId === product.id ? "Добавляем…" : "В корзину"
						})
					})]
				}, product.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pager, {
				page: page.page,
				pages: page.pages,
				total: page.total,
				onPage: page.setPage
			}),
			opened ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
				product: opened,
				pending: pendingId === opened.id,
				locked: pendingId !== "",
				onClose: () => setOpened(null),
				onTake: (variantId) => take(opened, variantId)
			}) : null
		]
	});
}
function ProductCard({ product, pending, locked, onClose, onTake }) {
	const [variants, setVariants] = (0, import_react.useState)([]);
	const [selectedId, setSelectedId] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		function onKey(event) {
			if (event.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	(0, import_react.useEffect)(() => {
		let ignore = false;
		setVariants([]);
		setSelectedId("");
		Promise.all([apex(`/api/products/${product.id}/variants`).catch(() => null), apex(`/api/products/${product.id}`).catch(() => null)]).then(([listed, details]) => {
			if (ignore) return;
			const source = listed ?? (details && typeof details === "object" ? details.variants : null);
			const next = listOf(source).map(mapVariant).filter((item) => item != null && item.active);
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-center bg-black/50 p-4",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "product-card-title",
			className: "max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-surface shadow-xl",
			onClick: (event) => event.stopPropagation(),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "bg-brand-soft",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: image,
						alt: "",
						className: "aspect-square w-full object-cover md:h-full md:aspect-auto"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative p-5 sm:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "absolute top-3 right-3 grid size-10 place-items-center rounded-full bg-card",
							"aria-label": "Закрыть",
							onClick: onClose,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pr-12 text-xs font-semibold text-brand",
							children: categoryLabel(product.category, product.categoryName)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							id: "product-card-title",
							className: "mt-2 pr-12 text-2xl font-bold",
							children: product.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-2xl font-bold text-brand",
							children: formatPoints(price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-6",
							children: product.description || "Описание пока не добавлено."
						}),
						variants.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Вариант"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-2",
								children: variants.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setSelectedId(item.id),
									className: `min-h-9 rounded-full px-3 text-sm font-medium ${selectedId === item.id ? "bg-brand text-white" : "bg-card"}`,
									children: item.name
								}, item.id))
							})]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-5 space-y-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Наличие"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium",
									children: stock > 0 ? `${stock} шт.` : "Нет в наличии"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: "Формат"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "font-medium",
									children: product.isDigital ? "Цифровой" : "Физический"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-6 w-full",
							disabled: stock <= 0 || locked,
							onClick: () => onTake(selected?.id),
							children: pending ? "Добавляем…" : "В корзину"
						})
					]
				})]
			})
		})
	});
}
function mapVariant(raw) {
	if (!raw || typeof raw !== "object") return null;
	const record = raw;
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
		active: record.isActive !== false && record.active !== false
	};
}
//#endregion
export { CatalogPage as component };
