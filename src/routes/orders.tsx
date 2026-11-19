import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Pager, usePage } from "@/components/pager";
import { Shell } from "@/components/shell";
import { Button, Panel } from "@/components/ui";
import { formatDateTime, formatPoints } from "@/lib/format";
import { orderStatusLabel } from "@/lib/labels";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

function OrdersPage() {
  const userId = useStore((state) => state.currentUserId);
  const allOrders = useStore((state) => state.orders);
  const orders = allOrders.filter((order) => order.userId === userId);
  const [sort, setSort] = useState<"new" | "old">("new");
  const [pending, setPending] = useState("");
  const cancelOrder = useStore((state) => state.setOrderStatus);
  const refresh = useStore((state) => state.refresh);
  const ordered = [...orders].sort((a, b) =>
    sort === "new" ? b.createdAt.localeCompare(a.createdAt) : a.createdAt.localeCompare(b.createdAt),
  );
  const page = usePage(ordered, 6, sort);

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">Мои заказы</h1>
      <p className="mt-2 text-sm text-muted">Пока заказ обрабатывается, его можно отменить — апексы вернутся на баланс.</p>
      <label className="mt-4 block text-sm text-muted">
        <span className="sr-only">Сортировка заказов</span>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as "new" | "old")}
          className="h-11 rounded-md border border-line bg-surface px-3 text-sm text-ink"
        >
          <option value="new">Сначала новые</option>
          <option value="old">Сначала старые</option>
        </select>
      </label>
      {orders.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Заказов пока нет.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {page.items.map((order) => (
            <li key={order.id}>
              <Panel>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-bold">{formatDateTime(order.createdAt)}</h2>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone(order.status)}`}>
                    {orderStatusLabel(order.status)}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-sm">
                  {order.items.map((item, index) => (
                    <li key={`${item.productId}-${item.variantName}-${index}`} className="flex justify-between gap-3">
                      <span>
                        {item.title}
                        {item.variantName ? <span className="text-brand"> · {item.variantName}</span> : null} × {item.qty}
                      </span>
                      <span className="tabular text-muted">{formatPoints(item.price * item.qty)}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-sm font-semibold">Итого {formatPoints(order.total)}</p>
                {order.status === "processing" ? (
                  <Button
                    className="mt-3"
                    variant="line"
                    disabled={pending === order.id}
                    onClick={() => {
                      setPending(order.id);
                      void cancelOrder(order.id, "cancelled").then(async (result) => {
                        if (!result.ok) toast.error(result.error);
                        else {
                          toast.success("Заказ отменён, апексы вернулись на баланс");
                          await refresh();
                        }
                        setPending("");
                      });
                    }}
                  >
                    {pending === order.id ? "Отменяем…" : "Отменить заказ"}
                  </Button>
                ) : null}
              </Panel>
            </li>
          ))}
        </ul>
      )}
      <Pager page={page.page} pages={page.pages} total={page.total} onPage={page.setPage} />
    </Shell>
  );
}

function statusTone(status: string) {
  if (status === "cancelled") return "bg-red-100 text-red-800";
  if (status === "issued" || status === "completed") return "bg-emerald-100 text-emerald-800";
  if (status === "processing" || status === "ready") return "bg-amber-100 text-amber-900";
  return "bg-brand-wash text-brand-deep";
}
