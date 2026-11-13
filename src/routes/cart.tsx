import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Shell } from "@/components/shell";
import { Button, Panel } from "@/components/ui";
import { formatNumber, formatPoints } from "@/lib/format";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const cart = useStore((state) => state.cart);
  const products = useStore((state) => state.products);
  const balance = useStore(
    (state) => state.people.find((person) => person.id === state.currentUserId)?.balance ?? 0,
  );
  const setQty = useStore((state) => state.setQty);
  const checkout = useStore((state) => state.checkout);
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  const lines = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product ? { ...item, product } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const total = lines.reduce((sum, line) => sum + line.product.price * line.qty, 0);
  const short = total > balance;

  function change(productId: string, qty: number) {
    void setQty(productId, qty).then((result) => {
      if (!result.ok) toast.error(result.error);
    });
  }

  return (
    <Shell mode="shop">
      <h1 className="text-3xl font-bold tracking-tight">Корзина</h1>
      {lines.length === 0 ? (
        <Panel className="mt-6">
          <p className="text-sm text-muted">Пока пусто. Награды ждут в каталоге.</p>
          <Link to="/catalog" className="mt-4 inline-block">
            <Button>В каталог</Button>
          </Link>
        </Panel>
      ) : (
        <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          <ul className="space-y-3">
            {lines.map((line) => (
              <li key={line.lineId || line.productId} className="flex gap-3 rounded-lg bg-card p-3">
                <img src={line.product.image} alt="" className="size-20 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{line.product.title}</p>
                  <p className="mt-1 text-sm text-muted">{formatPoints(line.product.price)}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      className="grid size-11 place-items-center rounded-md border border-line"
                      aria-label="Уменьшить"
                      onClick={() => change(line.productId, line.qty - 1)}
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="tabular w-6 text-center text-sm font-semibold">{line.qty}</span>
                    <button
                      type="button"
                      className="grid size-11 place-items-center rounded-md border border-line"
                      aria-label="Увеличить"
                      onClick={() => change(line.productId, line.qty + 1)}
                    >
                      <Plus className="size-4" />
                    </button>
                    <button
                      type="button"
                      className="ml-auto grid size-11 place-items-center rounded-md text-danger"
                      aria-label="Удалить"
                      onClick={() => change(line.productId, 0)}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Panel>
            <p className="text-sm text-muted">К оплате</p>
            <p className="mt-1 text-2xl font-bold text-brand">{formatPoints(total)}</p>
            <p className="mt-2 text-sm text-muted">На балансе {formatNumber(balance)}</p>
            {short ? <p className="mt-3 text-sm text-danger">Недостаточно апексов. Уберите позицию или заработайте ещё.</p> : null}
            <Button
              className="mt-4 w-full"
              disabled={short || pending}
              onClick={() => {
                if (pending) return;
                setPending(true);
                void checkout().then((result) => {
                  setPending(false);
                  if (!result.ok) toast.error(result.error);
                  else {
                    toast.success("Заказ оформлен");
                    void navigate({ to: "/orders" });
                  }
                });
              }}
            >
              {pending ? "Оформляем…" : "Оплатить апексами"}
            </Button>
          </Panel>
        </div>
      )}
    </Shell>
  );
}
