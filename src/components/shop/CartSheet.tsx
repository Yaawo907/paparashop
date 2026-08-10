import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatXOF, useCart } from "@/lib/cart";

export function CartButton() {
  const { count, setOpen } = useCart();
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Ouvrir le panier"
      className="relative rounded-md p-2 text-white transition-colors hover:text-accent"
    >
      <ShoppingCart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-primary">
          {count}
        </span>
      )}
    </button>
  );
}

export function CartSheet() {
  const { lines, total, open, setOpen, setQuantity, remove } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display">Votre panier</SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <p className="mt-8 text-sm text-muted-foreground">Votre panier est vide.</p>
        ) : (
          <>
            <ul className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-3 rounded-lg border border-border p-3">
                  {l.image ? (
                    <img
                      src={l.image}
                      alt={l.name}
                      className="h-16 w-16 shrink-0 rounded-md object-cover"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{formatXOF(l.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Diminuer"
                        onClick={() => setQuantity(l.id, l.quantity - 1)}
                        className="rounded border border-border p-1"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">{l.quantity}</span>
                      <button
                        type="button"
                        aria-label="Augmenter"
                        onClick={() => setQuantity(l.id, l.quantity + 1)}
                        className="rounded border border-border p-1"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        aria-label="Retirer"
                        onClick={() => remove(l.id)}
                        className="ml-auto rounded p-1 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Total</span>
                <span className="font-display text-lg text-primary">{formatXOF(total)}</span>
              </div>
              <Link
                to="/panier"
                onClick={() => setOpen(false)}
                className="mt-4 block rounded-md bg-accent px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-wider text-primary"
              >
                Passer commande
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
