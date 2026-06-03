import { useSyncExternalStore } from "react";
import type { Product } from "@/data/products";

type CartItem = { product: Product; qty: number };
let items: CartItem[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const cart = {
  add(product: Product) {
    const existing = items.find((i) => i.product.id === product.id);
    if (existing) existing.qty += 1;
    else items = [...items, { product, qty: 1 }];
    emit();
  },
  remove(id: string) {
    items = items.filter((i) => i.product.id !== id);
    emit();
  },
  get() {
    return items;
  },
  count() {
    return items.reduce((s, i) => s + i.qty, 0);
  },
  total() {
    return items.reduce((s, i) => s + i.qty * i.product.price, 0);
  },
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useCart() {
  return useSyncExternalStore(cart.subscribe, cart.get, cart.get);
}
