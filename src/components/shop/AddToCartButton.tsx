import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  name: string;
  price?: number | null;
  image?: string | null;
  className?: string;
};

export function AddToCartButton({ id, name, price, image, className }: Props) {
  const { add, setOpen } = useCart();
  if (!id || !price || price <= 0) return null;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add({ id, name, price, image: image ?? null });
        setOpen(true);
        toast.success(`${name} ajouté au panier`);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 font-display text-xs font-bold uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90",
        className,
      )}
    >
      <ShoppingCart className="h-4 w-4" />
      Ajouter au panier
    </button>
  );
}
