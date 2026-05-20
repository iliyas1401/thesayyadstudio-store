import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";
import heroTees from "@/assets/brand/hero-tees.jpg";
import heritage from "@/assets/brand/heritage.jpg";
import logo from "@/assets/brand/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Sayyad Studio — Elevate Your Everyday Style" },
      { name: "description", content: "The Sayyad Studio — luxury fashion crafted with precision, focus, and skill. Elevate your everyday style." },
      { property: "og:title", content: "The Sayyad Studio — Elevate Your Everyday Style" },
      { property: "og:description", content: "Luxury fashion crafted with precision, focus, and skill." },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = products.slice(0, 4);

  return (
    <Layout transparentNav>
      {/* HERO */}
      <section className="relative min-h-screen bg-bone overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bone via-bone to-secondary" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-10 pt-28 lg:pt-32 pb-16 grid lg:grid-cols-12 gap-10 items-center min-h-screen">
          <div className="lg:col-span-5 text-center lg:text-left animate-fade-up">
            <img src={logo} alt="The Sayyad Studio" className="h-28 lg:h-36 w-auto mx-auto lg:mx-0 mb-8" />
            <p className="eyebrow text-primary">The Sayyad Studio</p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl mt-5 leading-[1] tracking-tight text-foreground">
              Elevate Your<br /><em className="font-light text-primary">Everyday Style.</em>
            </h1>
            <p className="mt-6 text-base lg:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
              Luxury fashion rooted in heritage. Crafted with precision, focus, and skill — the mark of a Sayyad.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-ink transition-colors rounded-full"
              >
                Shop Now for Luxury Fashion <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/917972595126"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-foreground text-xs font-medium uppercase tracking-wider hover:gap-3 transition-all"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us
              </a>
            </div>
            <a href="tel:7972595126" className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
              <Phone className="h-3.5 w-3.5" /> +91 79725 95126
            </a>
          </div>

          <div className="lg:col-span-7 relative animate-fade-up">
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 via-transparent to-accent/20 blur-2xl" />
            <img
              src={heroTees}
              alt="The Sayyad Studio premium tees collection"
              width={1400}
              height={900}
              className="relative w-full h-auto object-cover shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="border-y border-border py-5 overflow-hidden bg-primary text-primary-foreground">
        <div className="flex whitespace-nowrap animate-marquee gap-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="font-display italic text-2xl lg:text-4xl">
              Elevate Your Everyday Style <span className="text-accent mx-6">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* DISCOVER + HERITAGE */}
      <section className="mx-auto max-w-7xl px-6 lg:px-10 py-24 lg:py-32">
        <div className="text-center mb-16">
          <p className="eyebrow text-accent">Discover</p>
          <h2 className="font-display text-4xl lg:text-6xl mt-4">
            Discover <em className="font-light">The Sayyad Studio</em>
          </h2>
          <div className="mx-auto mt-6 h-px w-16 bg-foreground/30" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <img src={heritage} alt="Our Heritage" loading="lazy" className="w-full h-auto object-cover" />
          </div>
          <div>
            <p className="eyebrow text-muted-foreground">Our Heritage</p>
            <h3 className="font-display text-3xl lg:text-5xl mt-4 leading-tight">
              The mark of a <em className="font-light">Master.</em>
            </h3>
            <p className="mt-6 text-muted-foreground leading-relaxed text-base lg:text-lg">
              The name <strong className="text-foreground font-medium">Sayyad</strong> translates to
              <em> 'Master'</em> and embodies precision, focus, and skill. For generations, we have upheld
              this legacy in every stitch and detail of our clothing.
            </p>
            <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-wider text-primary font-semibold border-b border-primary pb-1">
              Read our story <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-bone py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="text-center mb-14">
            <p className="eyebrow text-accent">Featured Products</p>
            <h2 className="font-display text-4xl lg:text-6xl mt-4">
              Explore our latest styles<br />
              <em className="font-light">and timeless classics.</em>
            </h2>
            <div className="mx-auto mt-6 h-px w-16 bg-foreground/30" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>

          <div className="text-center mt-16">
            <Link to="/collections" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-ink transition rounded-full">
              View All Collections <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* WELCOME */}
      <section className="mx-auto max-w-3xl px-6 lg:px-10 py-24 lg:py-32 text-center">
        <p className="eyebrow text-accent">Welcome</p>
        <h2 className="font-display text-4xl lg:text-6xl mt-4 leading-tight">
          There's much to <em className="font-light">see here.</em>
        </h2>
        <p className="mt-6 text-muted-foreground leading-relaxed max-w-xl mx-auto">
          So, take your time, look around, and learn all there is to know about us.
          We hope you enjoy our site and take a moment to drop us a line.
        </p>
        <Link to="/about" className="mt-10 inline-flex items-center gap-2 text-sm uppercase tracking-wider text-primary font-semibold border-b border-primary pb-1">
          Find Out More <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto max-w-5xl px-6 lg:px-10 py-20 lg:py-28 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="eyebrow text-accent">Contact Us</p>
            <h2 className="font-display text-3xl lg:text-5xl mt-4 leading-tight">
              Better yet, <em className="font-light">see us in person.</em>
            </h2>
            <p className="mt-5 text-primary-foreground/70 max-w-md">
              We love our customers, so feel free to visit during normal business hours.
              Open today 09:00 am – 05:00 pm.
            </p>
          </div>
          <div className="flex flex-col gap-4 md:items-end">
            <a href="https://wa.me/917972595126" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:opacity-90 transition rounded-full">
              <MessageCircle className="h-4 w-4" /> Connect on WhatsApp
            </a>
            <a href="tel:7972595126" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-accent text-sm">
              <Phone className="h-4 w-4" /> +91 79725 95126
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
