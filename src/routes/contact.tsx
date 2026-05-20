import { createFileRoute } from "@tanstack/react-router";
import { Phone, MessageCircle, Instagram, Clock, MapPin } from "lucide-react";
import { Layout } from "@/components/Layout";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — The Sayyad Studio" },
      { name: "description", content: "Get in touch with The Sayyad Studio. Call, WhatsApp, or visit us during business hours." },
      { property: "og:title", content: "Contact — The Sayyad Studio" },
      { property: "og:description", content: "Get in touch with The Sayyad Studio." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-6 lg:px-10 pt-16 lg:pt-24 pb-16 text-center">
        <p className="eyebrow text-accent">Contact Us</p>
        <h1 className="font-display text-5xl lg:text-7xl mt-4 leading-[1]">
          Better yet, <em className="font-light">see us in person.</em>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-muted-foreground">
          We love our customers, so feel free to visit during normal business hours.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 lg:px-10 pb-24">
        <div className="grid md:grid-cols-2 gap-6">
          <a href="tel:7972595126" className="group p-8 bg-bone border border-border hover:border-primary transition">
            <Phone className="h-6 w-6 text-primary" />
            <p className="eyebrow mt-6 text-muted-foreground">Call</p>
            <p className="font-display text-2xl mt-2 group-hover:text-primary">+91 79725 95126</p>
          </a>
          <a href="https://wa.me/917972595126" target="_blank" rel="noreferrer" className="group p-8 bg-bone border border-border hover:border-primary transition">
            <MessageCircle className="h-6 w-6 text-primary" />
            <p className="eyebrow mt-6 text-muted-foreground">WhatsApp</p>
            <p className="font-display text-2xl mt-2 group-hover:text-primary">Message us instantly</p>
          </a>
          <a href="https://www.instagram.com/thesayyadstudio/" target="_blank" rel="noreferrer" className="group p-8 bg-bone border border-border hover:border-primary transition">
            <Instagram className="h-6 w-6 text-primary" />
            <p className="eyebrow mt-6 text-muted-foreground">Instagram</p>
            <p className="font-display text-2xl mt-2 group-hover:text-primary">@thesayyadstudio</p>
          </a>
          <div className="p-8 bg-bone border border-border">
            <Clock className="h-6 w-6 text-primary" />
            <p className="eyebrow mt-6 text-muted-foreground">Hours</p>
            <p className="font-display text-2xl mt-2">Open today</p>
            <p className="text-sm text-muted-foreground mt-1">09:00 am – 05:00 pm</p>
          </div>
        </div>

        <div className="mt-10 p-10 lg:p-14 bg-primary text-primary-foreground text-center">
          <MapPin className="h-6 w-6 mx-auto text-accent" />
          <h2 className="font-display text-3xl lg:text-4xl mt-5">The Sayyad Studio</h2>
          <p className="mt-3 text-primary-foreground/70 max-w-lg mx-auto">
            Drop in, say hello, and see the craft up close. We'd love to show you around the studio.
          </p>
        </div>
      </section>
    </Layout>
  );
}
