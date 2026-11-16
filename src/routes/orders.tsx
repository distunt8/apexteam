import { createFileRoute } from "@tanstack/react-router";
import { Pager, usePage } from "@/components/pager";
import { Shell } from "@/components/shell";
import { Panel } from "@/components/ui";
import { formatDateTime, formatPoints } from "@/lib/format";
import { orderStatusLabel } from "@/lib/labels";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

function OrdersPage() {
  const userId = useStore((state) => state.currentUserId);
  const allOrders = useStore((state) => state.orders);
  const orders = allOrders.filter((order) => order.userId === userId);
  const page = usePage(orders, 6);

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">Мои заказы</h1>
      <p className="mt-2 text-sm text-muted">Отмену делает администратор или мерчендайзер: апексы возвращаются на баланс.</p>
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
