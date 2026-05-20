import { createFileRoute } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { Layout } from "@/components/Layout";
import lb1 from "@/assets/lookbook-1.jpg";
import lb2 from "@/assets/lookbook-2.jpg";
import lb3 from "@/assets/lookbook-3.jpg";
import lb4 from "@/assets/lookbook-4.jpg";

export const Route = createFileRoute("/lookbook")({
  head: () => ({
    meta: [
      { title: "Video Lookbook — TheSayyadStudio" },
      { name: "description", content: "Cinematic short films and brand videos from TheSayyadStudio." },
      { property: "og:title", content: "Video Lookbook — TheSayyadStudio" },
      { property: "og:description", content: "Cinematic short films from TheSayyadStudio." },
    ],
  }),
  component: LookbookPage,
});

const films = [
  { title: "Ladakh: Above the Clouds", series: "Expedition Series", duration: "3:42", cover: lb4, span: "lg:col-span-2 lg:row-span-2" },
  { title: "Goa After Sunset", series: "Summer Line", duration: "2:18", cover: lb2, span: "lg:col-span-2" },
  { title: "Marrakech Alleys", series: "Souk Edit", duration: "1:54", cover: lb1, span: "" },
  { title: "European Squares", series: "Heritage Collection", duration: "4:06", cover: lb3, span: "" },
];

function Tile({ film, large }: { film: typeof films[number]; large?: boolean }) {
  return (
    <div className={`group relative overflow-hidden cursor-pointer bg-muted ${film.span}`}>
      <img
        src={film.cover}
        alt={film.title}
        loading="lazy"
        className={`w-full ${large ? "h-full min-h-[400px]" : "aspect-[4/5]"} object-cover transition-transform duration-700 group-hover:scale-105`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
        <div className="h-16 w-16 rounded-full bg-white/95 backdrop-blur flex items-center justify-center">
          <Play className="h-6 w-6 text-ink fill-ink ml-0.5" />
        </div>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-6 lg:p-8 text-white">
        <p className="eyebrow text-white/70">{film.series} · {film.duration}</p>
        <h3 className={`font-display mt-2 ${large ? "text-3xl lg:text-5xl" : "text-xl lg:text-2xl"}`}>
          {film.title}
        </h3>
      </div>
    </div>
  );
}

function LookbookPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-6 lg:px-10 pt-12 lg:pt-20 pb-14">
        <p className="eyebrow text-muted-foreground">Video Lookbook</p>
        <h1 className="font-display text-5xl lg:text-7xl mt-4 leading-[1.05] max-w-4xl">
          Short films, <em className="font-light">long roads.</em>
        </h1>
        <p className="mt-6 max-w-xl text-muted-foreground leading-relaxed">
          Each capsule is shot on location. Real places. Real light. The garments come second.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:auto-rows-[260px]">
          {films.map((f, i) => <Tile key={f.title} film={f} large={i === 0} />)}
        </div>
      </section>

      {/* Featured player */}
      <section className="bg-ink text-background py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
            <div>
              <p className="eyebrow text-background/50">Now Playing</p>
              <h2 className="font-display text-3xl lg:text-5xl mt-3">Volume 04 — Director's Cut</h2>
            </div>
            <p className="text-background/60 text-sm max-w-sm">A 6 minute meditation on the road between Manali and Leh, shot on 16mm.</p>
          </div>
          <div className="relative aspect-video overflow-hidden bg-background/5 group cursor-pointer">
            <img src={lb4} alt="Director's cut" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-80 transition" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-20 w-20 lg:h-24 lg:w-24 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="h-7 w-7 lg:h-9 lg:w-9 text-ink fill-ink ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
