import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import lb1 from "@/assets/lookbook-1.jpg";
import lb3 from "@/assets/lookbook-3.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — TheSayyadStudio" },
      { name: "description", content: "The story behind TheSayyadStudio — a travel-inspired apparel studio rooted in craft and intent." },
      { property: "og:title", content: "About — TheSayyadStudio" },
      { property: "og:description", content: "The story behind TheSayyadStudio." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-6 lg:px-10 pt-16 lg:pt-28 pb-20 text-center">
        <p className="eyebrow text-muted-foreground">About the Studio</p>
        <h1 className="font-display text-5xl lg:text-8xl mt-6 leading-[1] tracking-tight">
          A studio built<br /><em className="font-light">on the road.</em>
        </h1>
        <p className="mt-10 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          TheSayyadStudio is a small apparel house designing pieces that carry the weight of a place.
          Sayyad means <em>master</em> — a word we earn one stitch at a time.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-4 lg:gap-6 pb-24">
        <img src={lb3} alt="Studio editorial" loading="lazy" className="aspect-[4/5] object-cover w-full" />
        <img src={lb1} alt="Studio editorial" loading="lazy" className="aspect-[4/5] object-cover w-full lg:translate-y-16" />
      </section>

      <section className="bg-bone py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {[
              { n: "01", t: "Travel as research", d: "Every collection begins as a notebook from somewhere. We design from real places, not mood boards." },
              { n: "02", t: "Small batches", d: "Limited runs, hand-finished, numbered. When a piece is gone, it's gone." },
              { n: "03", t: "Quiet craft", d: "Heavyweight cottons, considered prints, garment-dyed. No logos shouting." },
            ].map((b) => (
              <div key={b.n}>
                <p className="font-display text-5xl text-foreground/20">{b.n}</p>
                <h3 className="font-display text-2xl mt-4">{b.t}</h3>
                <p className="text-muted-foreground mt-3 leading-relaxed text-sm">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 lg:px-10 py-24 lg:py-32 text-center">
        <h2 className="font-display text-4xl lg:text-6xl leading-tight">
          Wear what you've <em className="font-light">been through.</em>
        </h2>
        <Link to="/collections" className="mt-10 inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 text-sm font-medium uppercase tracking-wider hover:bg-foreground/90 transition">
          Shop the studio <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </Layout>
  );
}
