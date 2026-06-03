import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  Package,
  LogOut,
  Trash2,
  MapPin,
  Edit2,
  X,
  Plus,
  Clock,
  Truck,
  CheckCircle,
  Loader2,
} from "lucide-react";

// 1. Explicit TypeScript interfaces to satisfy strict type-checking parameters
interface OrderItem {
  id: string | number;
  product_id?: string;
  title?: string;
  product_title?: string;
  size: string;
  quantity: number;
  price?: number;
  price_at_time?: number | string;
}

interface Order {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  shipping_address?: string;
  order_items: OrderItem[];
}

interface ShippingProfile {
  id: string;
  label: string | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  user_id: string;
  created_at?: string;
}

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<ShippingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState<ShippingProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate({ to: "/login" });
        return;
      }
      setUser(session.user);

      const [orderRes, addrRes] = await Promise.all([
        supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("shipping_profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false }),
      ]);

      setOrders((orderRes.data as unknown as Order[]) || []);
      setAddresses((addrRes.data as unknown as ShippingProfile[]) || []);
      // FIXED: Removed the floating 'loading;' expression that triggered the linter errors
      setLoading(false);
    }
    fetchData();
  }, [navigate]);

  const saveAddress = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // FIXED: Strict guard clause guarantees 'user' context is authenticated, removing 'undefined' types
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const data = {
      label: formData.get("label") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      phone: formData.get("phone") as string,
      user_id: user.id, // Now recognized safely as a guaranteed string
    };

    if (editingAddr) {
      const { error } = await supabase
        .from("shipping_profiles")
        .update(data)
        .eq("id", editingAddr.id);
      if (!error) {
        setAddresses(addresses.map((a) => (a.id === editingAddr.id ? { ...a, ...data } : a)));
      }
    } else {
      const { data: newAddr, error } = await supabase
        .from("shipping_profiles")
        .insert([data])
        .select();
      if (!error && newAddr) {
        setAddresses([...(newAddr as unknown as ShippingProfile[]), ...addresses]);
      }
    }
    setIsModalOpen(false);
    setEditingAddr(null);
  };

  const deleteAddress = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    await supabase.from("shipping_profiles").delete().eq("id", id);
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "processing":
        return (
          <span className="flex items-center gap-1.5 text-yellow-700 bg-yellow-50 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-yellow-200">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
      case "shipped":
        return (
          <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-blue-200">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case "delivered":
        return (
          <span className="flex items-center gap-1.5 text-green-700 bg-green-50 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-green-200">
            <CheckCircle className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-gray-700 bg-gray-100 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border border-gray-200">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin " />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-6 py-24">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 border-b border-gray-200 pb-8">
          <div>
            <h1 className="font-display text-4xl mb-2 text-gray-900">My Account</h1>
            <p className="text-gray-500 text-sm tracking-wide">{user?.email}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/" }))}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* LEFT COLUMN: ADDRESSES */}
          <div className="lg:col-span-4 space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-widest">
                <MapPin className="w-5 h-5" /> Addresses
              </h2>
              <button
                onClick={() => {
                  setEditingAddr(null);
                  setIsModalOpen(true);
                }}
                className="text-[10px] uppercase font-bold tracking-widest flex items-center gap-1 hover:text-gray-500 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add New
              </button>
            </div>

            <div className="space-y-4">
              {addresses.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
                  <p className="text-sm text-gray-500">No addresses saved yet.</p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="border border-gray-200 p-5 rounded-xl bg-white hover:border-black transition-colors group relative"
                  >
                    <div className="mb-4">
                      <span className="bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                        {addr.label || "Address"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {addr.address}
                      <br />
                      {addr.city}, {addr.state} {addr.pincode}
                    </p>
                    <p className="text-sm font-medium mt-3 text-gray-900">Ph: {addr.phone}</p>

                    {/* Action Buttons */}
                    <div className="absolute top-5 right-5 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingAddr(addr);
                          setIsModalOpen(true);
                        }}
                        className="text-gray-400 hover:text-black cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: ORDERS */}
          <div className="lg:col-span-8 space-y-8">
            <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-widest">
              <Package className="w-5 h-5" /> Recent Orders
            </h2>

            {orders.length === 0 ? (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500 mb-6 text-sm">You haven't placed any orders yet.</p>
                <button
                  onClick={() => navigate({ to: "/collections" })}
                  className="bg-black text-white px-6 py-3 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="bg-gray-50 p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-lg text-gray-900">₹{order.total_amount}</p>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6 bg-white">
                      <div className="space-y-4">
                        {order.order_items?.map((item: OrderItem) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-sm group"
                          >
                            <span className="font-medium text-gray-800">
                              {item.quantity}x {item.product_title || "Premium Apparel"}
                              <span className="text-gray-400 ml-2 font-normal">({item.size})</span>
                            </span>

                            <span className="text-gray-600 font-medium">
                              ₹
                              {(
                                (Number(item.price_at_time) || 0) * (Number(item.quantity) || 1)
                              ).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ADDRESS MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900">
                  {editingAddr ? "Edit Address" : "Add New Address"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-black transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={saveAddress} className="p-6 space-y-4 bg-white">
                <div>
                  <input
                    name="label"
                    defaultValue={editingAddr?.label || ""}
                    placeholder="Label (e.g. Home, Office)"
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-md text-sm outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
                    required
                  />
                </div>
                <div>
                  <input
                    name="address"
                    defaultValue={editingAddr?.address || ""}
                    placeholder="Street Address"
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-md text-sm outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="city"
                    defaultValue={editingAddr?.city || ""}
                    placeholder="City"
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-md text-sm outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
                    required
                  />
                  <input
                    name="state"
                    defaultValue={editingAddr?.state || ""}
                    placeholder="State"
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-md text-sm outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="pincode"
                    defaultValue={editingAddr?.pincode || ""}
                    placeholder="Pincode"
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-md text-sm outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
                    required
                  />
                  <input
                    name="phone"
                    defaultValue={editingAddr?.phone || ""}
                    placeholder="Phone Number"
                    className="w-full bg-gray-50 border border-gray-200 p-3.5 rounded-md text-sm outline-none focus:bg-white focus:ring-2 focus:ring-black transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3.5 mt-2 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer shadow-md shadow-black/10"
                >
                  Save Address
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
