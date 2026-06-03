import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { cart } from "@/store/cart";
import { ProductGallery } from "@/components/ProductGallery";

// Using 'any' here temporarily allows a smooth transition between your
// static frontend arrays and your dynamic Supabase database objects
export function ProductCard({ product }: { product: any }) {
  // Safely extract images whether it's the old static string or the new DB array
  const imageList =
    product.images?.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : product.image
          ? [product.image]
          : [];

  // Safely handle naming differences between static data and DB
  const displayTitle = product.title || product.name;
  const displayCategory = product.category || product.collection;

  return (
    <div className="group relative bg-white">
      <div className="relative">
        {/* REPLACED STATIC IMAGE WITH PRODUCT GALLERY */}
        <ProductGallery images={imageList} alt={displayTitle} />

        {product.badge && (
          <span className="absolute top-3 left-3 bg-background/95 backdrop-blur px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest z-10 pointer-events-none shadow-sm">
            {product.badge}
          </span>
        )}

        {/* QUICK ADD BUTTON */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents the image modal from opening when clicking Add to Cart
            cart.add(product);
          }}
          // Positioned at bottom-20 to ensure it sits above the new gallery thumbnails
          className="absolute bottom-20 right-3 lg:bottom-20 lg:right-4 h-10 px-4 inline-flex items-center gap-1.5 bg-foreground text-background text-xs font-medium uppercase tracking-wider opacity-100 lg:opacity-0 lg:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-foreground/90 z-10 cursor-pointer shadow-md"
        >
          <Plus className="h-3.5 w-3.5" /> Quick Add
        </button>
      </div>

      {/* PRODUCT DETAILS */}
      <div className="pt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground truncate">
            {displayCategory}
          </p>
          <h3 className="font-display text-lg mt-1 leading-snug truncate">{displayTitle}</h3>
        </div>
        <p className="text-sm font-medium whitespace-nowrap">
          {/* Format price depending on if it already has a currency symbol */}
          {String(product.price).includes("$") || String(product.price).includes("₹")
            ? product.price
            : `₹${product.price}`}
        </p>
      </div>
    </div>
  );
}
