import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu, X, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/store/cart";
import logo from "@/assets/brand/logo.png";

const links = [
  { to: "/collections", label: "Collections" },
  { to: "/lookbook", label: "Lookbook" },
  { to: "/about", label: "Heritage" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const items = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border text-foreground"
          : "bg-transparent text-current"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 lg:h-20 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="The Sayyad Studio" className="h-10 lg:h-12 w-auto" />
          <span className="hidden sm:block font-display text-base lg:text-lg leading-none tracking-tight">
            The Sayyad<br /><span className="italic font-light text-xs lg:text-sm">Studio</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-10">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
              activeProps={{ className: "opacity-100" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 lg:gap-3">
          <a href="tel:7972595126" className="hidden md:inline-flex items-center gap-2 text-xs font-medium opacity-80 hover:opacity-100 px-3">
            <Phone className="h-3.5 w-3.5" />
            +91 79725 95126
          </a>
          <Link to="/collections" className="relative h-10 w-10 flex items-center justify-center hover:opacity-70 transition" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute top-1 right-1 h-4 min-w-4 px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            className="lg:hidden h-10 w-10 flex items-center justify-center"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background text-foreground">
          <nav className="px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-lg font-display">
                {l.label}
              </Link>
            ))}
            <a href="tel:7972595126" className="text-sm text-muted-foreground pt-3 border-t border-border">
              Call +91 79725 95126
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
