import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import heroImg from "@/assets/hero.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import lookbook3 from "@/assets/lookbook-3.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TheSayyadStudio — Travel-Inspired Premium Apparel" },
      { name: "description", content: "Cinematic apparel and lookbooks from TheSayyadStudio. Travel-inspired collections crafted with precision." },
      { property: "og:title", content: "TheSayyadStudio — Travel-Inspired Premium Apparel" },
      { property: "og:description", content: "Cinematic apparel and lookbooks from TheSayyadStudio." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.slice(0, 4);
  const marqueeItems = ["Ladakh Expedition", "Goa Summer", "European Heritage", "Tokyo Drift", "Marrakech Souk", "Rajasthan Dunes"];

  return (
    <Layout transparentNav>
      {/* HERO */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <img src={heroImg} alt="TheSayyadStudio Hero" width={1920} height={1080} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80" />

        <div className="relative h-full mx-auto max-w-7xl px-6 lg:px-10 flex flex-col justify-end pb-20 lg:pb-28">
          <div className="max-w-3xl text-white animate-fade-up">
            <p className="eyebrow text-white/80">Spring / Summer Volume 04</p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl mt-5 leading-[0.95] tracking-tight">
              Worn between<br /><em className="font-light">latitudes.</em>
            </h1>
            <p className="mt-6 text-base lg:text-lg text-white/80 max-w-lg leading-relaxed">
              A studio of travel-inspired apparel. Cut for the road, the city, and everywhere in between.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 bg-white text-ink px-7 py-3.5 text-sm font-medium uppercase tracking-wider hover:bg-white/90 transition-colors"
              >
                Shop the Collection <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/lookbook"
                className="inline-flex items-center gap-2 text-white text-sm font-medium uppercase tracking-wider hover:gap-3 transition-all"
              >
                <Play className="h-4 w-4" /> Watch the Film
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-[10px] uppercase tracking-[0.3em]">Scroll</div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border py-5 overflow-hidden bg-bone">
        <div className="flex whitespace-nowrap animate-marquee gap-12">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((m, i) => (
            <span key={i} className="font-display italic text-2xl lg:text-4xl text-foreground/80">
              {m} <span className="text-foreground/30 mx-6">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div>
            <p className="eyebrow text-muted-foreground">Featured</p>
            <h2 className="font-display text-4xl lg:text-6xl mt-3 max-w-2xl leading-tight">
              The new arrivals.
            </h2>
          </div>
          <Link to="/collections" className="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 self-start">
            View all collections <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      <section className="bg-ink text-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <p className="eyebrow text-background/50">Our Heritage</p>
            <h2 className="font-display text-4xl lg:text-6xl mt-4 leading-[1.05]">
              Sayyad. <br /><em className="font-light">The Master.</em>
            </h2>
            <p className="mt-6 text-background/70 leading-relaxed max-w-md">
              The name translates to <em>Master</em>. For generations, it has stood for
              precision, focus, and skill — qualities we cut into every stitch.
              We treat each piece as a passport stamp: a moment, a mood, a place.
            </p>
            <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-wider border-b border-background pb-1">
              Read the studio story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
            <img src={lookbook3} alt="Lookbook portrait" loading="lazy" className="aspect-[3/4] object-cover translate-y-8" />
            <img src={lookbook2} alt="Lookbook landscape" loading="lazy" className="aspect-[3/4] object-cover" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32 text-center">
        <p className="eyebrow text-muted-foreground">Explore</p>
        <h2 className="font-display text-4xl lg:text-7xl mt-4 max-w-3xl mx-auto leading-[1.05]">
          Latest styles & <em className="font-light">timeless classics.</em>
        </h2>
        <Link to="/collections" className="mt-10 inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition">
          Enter the Studio <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </Layout>
  );
}
