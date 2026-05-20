import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { cart } from "@/store/cart";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative">
      <div className="relative overflow-hidden bg-muted aspect-[3/4]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-background/95 backdrop-blur px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => cart.add(product)}
          className="absolute bottom-3 right-3 lg:bottom-4 lg:right-4 h-10 px-4 inline-flex items-center gap-1.5 bg-foreground text-background text-xs font-medium uppercase tracking-wider opacity-100 lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-foreground/90"
        >
          <Plus className="h-3.5 w-3.5" /> Quick Add
        </button>
      </div>
      <div className="pt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground truncate">{product.collection}</p>
          <h3 className="font-display text-lg mt-1 leading-snug truncate">{product.name}</h3>
        </div>
        <p className="text-sm font-medium whitespace-nowrap">${product.price}</p>
      </div>
    </div>
  );
}
