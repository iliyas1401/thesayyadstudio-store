import { Instagram, Youtube, Twitter, ArrowRight } from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="bg-ink text-background mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="eyebrow text-background/60">Newsletter</p>
            <h3 className="font-display text-3xl lg:text-5xl mt-4 leading-tight">
              Dispatches from the studio.
            </h3>
            <p className="text-background/60 mt-4 max-w-md">
              Early access to drops, lookbooks, and travel stories. No noise.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
              className="mt-8 flex items-center border-b border-background/30 focus-within:border-background transition"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent py-3 text-background placeholder:text-background/40 outline-none"
              />
              <button type="submit" className="p-3 hover:translate-x-1 transition-transform" aria-label="Subscribe">
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            {sent && <p className="text-xs text-background/60 mt-3">Welcome aboard.</p>}
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <p className="eyebrow text-background/40 mb-5">Shop</p>
              <ul className="space-y-3 text-sm">
                <li><a href="/collections" className="hover:text-background/70">All Collections</a></li>
                <li><a href="/collections" className="hover:text-background/70">New Arrivals</a></li>
                <li><a href="/collections" className="hover:text-background/70">Bestsellers</a></li>
                <li><a href="/collections" className="hover:text-background/70">Gift Cards</a></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-background/40 mb-5">Studio</p>
              <ul className="space-y-3 text-sm">
                <li><a href="/about" className="hover:text-background/70">Our Story</a></li>
                <li><a href="/lookbook" className="hover:text-background/70">Lookbook</a></li>
                <li><a href="#" className="hover:text-background/70">Journal</a></li>
                <li><a href="#" className="hover:text-background/70">Press</a></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-background/40 mb-5">Help</p>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-background/70">Shipping</a></li>
                <li><a href="#" className="hover:text-background/70">Returns</a></li>
                <li><a href="#" className="hover:text-background/70">Size Guide</a></li>
                <li><a href="#" className="hover:text-background/70">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-background/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} TheSayyadStudio. Crafted with intent.
          </p>
          <div className="flex items-center gap-5 text-background/60">
            <a href="#" aria-label="Instagram" className="hover:text-background"><Instagram className="h-4 w-4" /></a>
            <a href="#" aria-label="YouTube" className="hover:text-background"><Youtube className="h-4 w-4" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-background"><Twitter className="h-4 w-4" /></a>
          </div>
          <div className="flex gap-6 text-xs text-background/40">
            <a href="#" className="hover:text-background/70">Privacy</a>
            <a href="#" className="hover:text-background/70">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
