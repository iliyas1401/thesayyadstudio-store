import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";

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

  const filtered = filter === "ALL" ? products : products.filter((p) => p.collection === filter);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="font-display text-7xl mb-10">Collections</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white p-4 rounded-xl shadow-sm border border-border/50">
              <img src={p.image_url} alt={p.title} className="w-full aspect-[4/5] object-cover rounded-lg mb-4" />
              <h3 className="font-display text-lg">{p.title}</h3>
              <div className="flex flex-wrap gap-2 my-4">
                {p.sizes?.map((s: string) => (
                  <button key={s} onClick={() => setSelectedSizes(prev => ({ ...prev, [p.id]: s }))} className={`border px-2 py-1 text-[10px] ${selectedSizes[p.id] === s ? 'bg-black text-white' : ''}`}>{s}</button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => handleAdd(p)} className="border py-2 text-[10px] font-bold uppercase cursor-pointer">Add</button>
                <button onClick={() => handleBuy(p)} className="bg-primary text-white py-2 text-[10px] font-bold uppercase cursor-pointer">Buy Now</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}