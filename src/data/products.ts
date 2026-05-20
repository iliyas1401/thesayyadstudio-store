import ladakh from "@/assets/product-ladakh.jpg";
import goa from "@/assets/product-goa.jpg";
import europe from "@/assets/product-europe.jpg";
import hoodie from "@/assets/product-hoodie.jpg";
import rajasthan from "@/assets/product-rajasthan.jpg";
import tokyo from "@/assets/product-tokyo.jpg";
import marrakech from "@/assets/product-marrakech.jpg";

export type Product = {
  id: string;
  name: string;
  collection: string;
  price: number;
  image: string;
  badge?: "New Arrival" | "Bestseller" | "Limited";
};

export const products: Product[] = [
  { id: "lk-01", name: "Himalayan Sentinel Tee", collection: "Ladakh Expedition Series", price: 89, image: ladakh, badge: "Bestseller" },
  { id: "go-01", name: "Sunset Palms Tee", collection: "Goa Summer Line", price: 64, image: goa, badge: "New Arrival" },
  { id: "eu-01", name: "Pillars of Athens Tee", collection: "European Heritage Collection", price: 78, image: europe },
  { id: "lk-02", name: "Sayyad Crest Hoodie", collection: "Ladakh Expedition Series", price: 145, image: hoodie, badge: "Limited" },
  { id: "rj-01", name: "Caravan of Thar Tee", collection: "Rajasthan Dunes Series", price: 72, image: rajasthan, badge: "New Arrival" },
  { id: "tk-01", name: "Great Wave Oversize", collection: "Tokyo Drift Capsule", price: 92, image: tokyo, badge: "Bestseller" },
  { id: "mr-01", name: "Medina Linen Shirt", collection: "Marrakech Souk Edit", price: 118, image: marrakech },
  { id: "go-02", name: "Coastal Drift Tee", collection: "Goa Summer Line", price: 64, image: goa },
];

export const collections = [
  "All",
  "Ladakh Expedition Series",
  "Goa Summer Line",
  "European Heritage Collection",
  "Rajasthan Dunes Series",
  "Tokyo Drift Capsule",
  "Marrakech Souk Edit",
];
