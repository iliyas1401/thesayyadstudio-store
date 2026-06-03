import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/CartContext";
import { ProductGallery } from "@/components/ProductGallery";

import heroTees from "@/assets/brand/hero-tees.jpg";
import heritage from "@/assets/brand/heritage.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState("All");

  const { addToCart, cartItemCount, setIsCartOpen, setIsCheckoutOpen } = useCart();

  useEffect(() => {
    // GLOBAL DEPENDENCY CHECK: Dynamically inject Razorpay runtime script if missing
    if (!window.hasOwnProperty("Razorpay")) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay SDK initialized successfully.");
      script.onerror = () => console.error("Failed to load Razorpay payment SDK.");
      document.head.appendChild(script);
    }

    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleAdd = (p: any) => {
    const size = selectedSizes[p.id] || (p.sizes ? p.sizes[0] : null);
    if (!size && p.sizes?.length > 0) return alert("Please select a size");
    addToCart(p, size);
  };

  const handleBuy = (p: any) => {
    const size = selectedSizes[p.id] || (p.sizes ? p.sizes[0] : null);
    if (!size && p.sizes?.length > 0) return alert("Please select a size");

    // Add to cart first, then open checkout modal
    addToCart(p, size);
    setIsCheckoutOpen(true);
  };

  const categories = [
    "All",
    ...Array.from(new Set(products.map((p) => p.category || "Uncategorized"))),
  ];
  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => (p.category || "Uncategorized") === activeCategory);

  return (
    <Layout transparentNav>
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-8 right-8 z-40 flex items-center gap-3 bg-primary text-primary-foreground px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-all cursor-pointer"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="font-bold uppercase text-sm">Cart ({cartItemCount})</span>
      </button>

      <section className="relative min-h-screen bg-bone overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bone via-bone to-secondary" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-28 lg:pt-32 pb-16 grid lg:grid-cols-12 gap-10 items-center min-h-screen">
          <div className="lg:col-span-5 text-center lg:text-left">
            <h1 className="font-display text-5xl lg:text-7xl leading-[1] tracking-tight text-foreground">
              Elevate Your
              <br />
              <em className="font-light text-primary">Everyday Style.</em>
            </h1>
            <div className="mt-10">
              <a
                href="#collections"
                className="inline-flex bg-primary text-primary-foreground px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] rounded-full cursor-pointer"
              >
                Shop The Collection
              </a>
            </div>
          </div>
          <div className="lg:col-span-7 relative">
            <img
              src={heroTees}
              alt="Premium tees"
              className="w-full h-auto object-cover shadow-2xl rounded-md"
            />
          </div>
        </div>
      </section>

      <section id="collections" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-4 mb-14">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 text-xs font-bold uppercase rounded-full border cursor-pointer ${activeCategory === cat ? "bg-primary text-primary-foreground" : "border-border"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                // Safely handle multiple images vs single image
                const imageList =
                  p.images?.length > 0 ? p.images : p.image_url ? [p.image_url] : [];

                return (
                  <div
                    key={p.id}
                    className="bg-white p-5 rounded-xl shadow-sm border border-border/50 group"
                  >
                    {/* Product Gallery replaces the standard <img> tag */}
                    <div className="mb-4">
                      <ProductGallery images={imageList} alt={p.title} />
                    </div>

                    <h3 className="font-display text-lg">{p.title}</h3>

                    {/* Price Explicitly Rendered */}
                    <p className="text-sm font-medium mt-1">₹{p.price}</p>

                    <div className="flex flex-wrap gap-2 my-4">
                      {p.sizes?.map((s: string) => (
                        <button
                          key={s}
                          onClick={() => setSelectedSizes((prev) => ({ ...prev, [p.id]: s }))}
                          className={`border px-2 py-1 text-[10px] transition-colors cursor-pointer ${selectedSizes[p.id] === s ? "bg-black text-white" : "hover:bg-gray-100"}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleAdd(p)}
                        className="border py-2 text-[10px] font-bold uppercase cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => handleBuy(p)}
                        className="bg-primary text-white py-2 text-[10px] font-bold uppercase cursor-pointer hover:opacity-90 transition-opacity"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
