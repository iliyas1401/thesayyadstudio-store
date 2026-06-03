import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { ProductGallery } from "@/components/ProductGallery";

export const Route = createFileRoute("/collections")({
  component: CollectionsPage,
});

function CollectionsPage() {
  const [filter, setFilter] = useState<string>("ALL");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  
  const { addToCart, setIsCheckoutOpen } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const handleAdd = (p: any) => {
    const size = selectedSizes[p.id] || (p.sizes ? p.sizes[0] : null);
    if (!size && p.sizes?.length > 0) return alert("Select size");
    addToCart(p, size);
  };

  const handleBuy = (p: any) => {
    const size = selectedSizes[p.id] || (p.sizes ? p.sizes[0] : null);
    if (!size && p.sizes?.length > 0) return alert("Select size");
    addToCart(p, size);
    setIsCheckoutOpen(true);
  };

  const filtered = filter === "ALL" ? products : products.filter((p) => p.category === filter || p.collection === filter);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="font-display text-7xl mb-10">Collections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filtered.map((p) => {
            // Safely handle legacy products that might only have an image_url
            const imageList = p.images?.length > 0 ? p.images : (p.image_url ? [p.image_url] : []);
            
            return (
              <div key={p.id} className="bg-white group">
                
                {/* THE NEW GALLERY COMPONENT */}
                <div className="mb-4">
                  <ProductGallery images={imageList} alt={p.title} />
                </div>

                <div className="pt-2">
                  <h3 className="font-display text-lg tracking-wide">{p.title}</h3>
                  <p className="text-sm font-medium mt-1">₹{p.price}</p>
                </div>

                <div className="flex flex-wrap gap-2 my-4">
                  {p.sizes?.map((s: string) => (
                    <button 
                      key={s} 
                      onClick={() => setSelectedSizes(prev => ({ ...prev, [p.id]: s }))} 
                      className={`border px-3 py-1.5 text-xs uppercase tracking-widest cursor-pointer transition-colors ${selectedSizes[p.id] === s ? 'bg-black text-white border-black' : 'hover:border-black text-gray-500'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button onClick={() => handleAdd(p)} className="border border-black py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-black hover:text-white transition-colors">
                    Add to Cart
                  </button>
                  <button onClick={() => handleBuy(p)} className="bg-black text-white py-3 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:bg-gray-900 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}