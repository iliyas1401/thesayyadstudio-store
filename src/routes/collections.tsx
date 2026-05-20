import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products, collections } from "@/data/products";

export const Route = createFileRoute("/collections")({
  head: () => ({
    meta: [
      { title: "Collections — TheSayyadStudio" },
      { name: "description", content: "Browse travel-inspired apparel collections — Ladakh, Goa, European Heritage, Tokyo, Marrakech and more." },
      { property: "og:title", content: "Collections — TheSayyadStudio" },
      { property: "og:description", content: "Travel-inspired apparel from TheSayyadStudio." },
    ],
  }),
  component: CollectionsPage,
});

function CollectionsPage() {
  const [filter, setFilter] = useState<string>("All");
  const filtered = filter === "All" ? products : products.filter((p) => p.collection === filter);

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 lg:px-10 pt-12 lg:pt-20 pb-10">
        <p className="eyebrow text-muted-foreground">Catalog</p>
        <h1 className="font-display text-5xl lg:text-7xl mt-4 leading-[1.05] max-w-3xl">
          The full <em className="font-light">collection.</em>
        </h1>
        <p className="mt-5 text-muted-foreground max-w-xl">
          {filtered.length} pieces. Cut, printed, and finished in small batches.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 sticky top-16 lg:top-20 z-30 bg-background/90 backdrop-blur-lg py-4 border-y border-border">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {collections.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`whitespace-nowrap px-4 py-2 text-xs uppercase tracking-wider border transition-all ${
                filter === c
                  ? "bg-foreground text-background border-foreground"
                  : "bg-transparent text-foreground/70 border-border hover:border-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-14 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14">
          {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </Layout>
  );
}
