import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CheckoutModal } from "./CheckoutModal"; // Import the checkout modal

export function Layout({ children, transparentNav = false }: { children: React.ReactNode; transparentNav?: boolean }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className={transparentNav ? "" : "pt-20 lg:pt-24"}>{children}</main>
      <Footer />
      
      {/* Global Checkout Window overlay listener */}
      <CheckoutModal />
    </div>
  );
}