import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/Layout";
import heritage from "@/assets/brand/heritage.jpg";
import heroTees from "@/assets/brand/hero-tees.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Heritage — The Sayyad Studio" },
      {
        name: "description",
        content:
          "The name Sayyad translates to 'Master' — embodying precision, focus, and skill in every stitch.",
      },
      { property: "og:title", content: "Heritage — The Sayyad Studio" },
      { property: "og:description", content: "The name Sayyad translates to 'Master'." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-6 lg:px-10 pt-16 lg:pt-24 pb-16 text-center">
        <p className="eyebrow text-accent">Our Heritage</p>
        <h1 className="font-display text-5xl lg:text-7xl mt-6 leading-[1] tracking-tight">
          The mark of
          <br />
          <em className="font-light">a Master.</em>
        </h1>
        <p className="mt-10 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The name <strong className="text-foreground font-medium">Sayyad</strong> translates to
          <em> 'Master'</em> and embodies precision, focus, and skill. For generations, we have
          upheld this legacy in every stitch and detail of our clothing.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 grid lg:grid-cols-2 gap-4 lg:gap-6 pb-24">
        <img
          src={heritage}
          alt="Our Heritage"
          loading="lazy"
          className="w-full h-auto object-cover"
        />
        <img
          src={heroTees}
          alt="The Sayyad Studio collection"
          loading="lazy"
          className="w-full h-auto object-cover lg:translate-y-16"
        />
      </section>

      <section className="bg-primary text-primary-foreground py-24 lg:py-32">
        <div className="mx-auto max-w-5xl px-6 lg:px-10">
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                n: "01",
                t: "Precision",
                d: "Every cut, every seam — measured and intentional. Nothing left to chance.",
              },
              {
                n: "02",
                t: "Focus",
                d: "Small, considered drops. We make less so each piece carries more meaning.",
              },
              {
                n: "03",
                t: "Skill",
                d: "Generations of craft, refined into garments built to be lived in and remembered.",
              },
            ].map((b) => (
              <div key={b.n}>
                <p className="font-display text-5xl text-accent">{b.n}</p>
                <h3 className="font-display text-2xl mt-4">{b.t}</h3>
                <p className="text-primary-foreground/70 mt-3 leading-relaxed text-sm">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 lg:px-10 py-24 lg:py-32 text-center">
        <h2 className="font-display text-4xl lg:text-6xl leading-tight">
          Elevate your
          <br />
          <em className="font-light">everyday style.</em>
        </h2>
        <Link
          to="/collections"
          className="mt-10 inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-ink transition rounded-full"
        >
          Shop Now for Luxury Fashion <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </Layout>
  );
}
