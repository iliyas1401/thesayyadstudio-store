import { Instagram, ArrowRight, MessageCircle, Phone } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/brand/logo.png";

export function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <footer className="bg-ink text-background mt-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-20">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-5">
            <p className="eyebrow text-accent">Subscribe</p>
            <h3 className="font-display text-3xl lg:text-5xl mt-4 leading-tight">
              Get 10% off your <em className="font-light">first purchase.</em>
            </h3>
            <p className="text-background/60 mt-4 max-w-md text-sm">
              Sign up for our newsletter for early access to new drops and exclusive offers.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email) setSent(true);
              }}
              className="mt-8 flex items-center border-b border-background/30 focus-within:border-accent transition"
            >
              <input
                type="email"
                required
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent py-3 text-background placeholder:text-background/40 outline-none"
              />
              <button
                type="submit"
                className="p-3 hover:translate-x-1 transition-transform text-accent"
                aria-label="Sign up"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            {sent && <p className="text-xs text-accent mt-3">Welcome to the studio.</p>}
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div>
              <p className="eyebrow text-background/40 mb-5">Studio</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/collections" className="hover:text-accent">
                    Collections
                  </a>
                </li>
                <li>
                  <a href="/lookbook" className="hover:text-accent">
                    Lookbook
                  </a>
                </li>
                <li>
                  <a href="/about" className="hover:text-accent">
                    Heritage
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-accent">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-background/40 mb-5">Hours</p>
              <ul className="space-y-3 text-sm text-background/70">
                <li>Mon – Sun</li>
                <li>09:00 am – 05:00 pm</li>
              </ul>
            </div>
            <div>
              <p className="eyebrow text-background/40 mb-5">Reach Us</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="tel:7972595126"
                    className="inline-flex items-center gap-2 hover:text-accent"
                  >
                    <Phone className="h-3.5 w-3.5" /> +91 79725 95126
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/917972595126"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-accent"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/thesayyadstudio/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 hover:text-accent"
                  >
                    <Instagram className="h-3.5 w-3.5" /> @thesayyadstudio
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-background/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className="h-8 w-auto opacity-90" />
            <p className="text-xs text-background/50">
              © {new Date().getFullYear()} The Sayyad Studio — All Rights Reserved.
            </p>
          </div>
          <div className="flex gap-6 text-xs text-background/40">
            <a href="#" className="hover:text-accent">
              Privacy
            </a>
            <a href="#" className="hover:text-accent">
              Shipping
            </a>
            <a href="#" className="hover:text-accent">
              Returns
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
