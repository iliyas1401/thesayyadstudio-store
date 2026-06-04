import React, { createContext, useContext, useState, useEffect } from "react";
import {
  X,
  Plus,
  Minus,
  MapPin,
  Loader2,
  AlertCircle,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Product {
  id: string | number;
  title: string;
  price: number;
  category?: string;
  image_url: string | null;
  images?: string[] | null;
  sizes?: string[] | null;
}

interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

interface ShippingProfile {
  id: string;
  user_id: string;
  label: string | null;
  address: string;
  city: string;
  pincode: string;
  phone: string;
  is_default: boolean;
  created_at?: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayErrorResponse {
  error: {
    code?: string;
    description?: string;
    source?: string;
    step?: string;
    reason?: string;
  };
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
  handler: (response: RazorpayResponse) => void;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: RazorpayErrorResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, selectedSize: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartItemCount: number;
  setIsCheckoutOpen: (isOpen: boolean) => void;
  isCheckoutOpen: boolean;
  cartTotal: number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccessId, setOrderSuccessId] = useState<string | null>(null);

  // Shipping State
  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    city: "",
    pincode: "",
    phone: "",
  });
  const [savedAddresses, setSavedAddresses] = useState<ShippingProfile[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string>("new");

  // Loading & Error States
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const clearCart = () => setCart([]);

  useEffect(() => {
    if (!("Razorpay" in window)) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }

    if (isCheckoutOpen) {
      async function loadSavedAddresses() {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from("shipping_profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .order("is_default", { ascending: false });

          if (data && data.length > 0) {
            const profiles = data as unknown as ShippingProfile[];
            setSavedAddresses(profiles);
            setSelectedAddrId(profiles[0].id);
            setShippingInfo({
              address: profiles[0].address,
              city: profiles[0].city,
              pincode: profiles[0].pincode,
              phone: profiles[0].phone,
            });
          } else {
            setSelectedAddrId("new");
          }
        }
      }
      loadSavedAddresses();
      setPaymentError(null);
      setOrderSuccessId(null);
    }
  }, [isCheckoutOpen]);

  const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedAddrId(val);
    setPaymentError(null);
    if (val === "new") {
      setShippingInfo({ address: "", city: "", pincode: "", phone: "" });
    } else {
      const addr = savedAddresses.find((a) => a.id === val);
      if (addr) {
        setShippingInfo({
          address: addr.address,
          city: addr.city,
          pincode: addr.pincode,
          phone: addr.phone,
        });
      }
    }
  };

  const addToCart = (product: Product, selectedSize: string) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.product.id === product.id && item.size === selectedSize,
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id && item.size === selectedSize
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { product, size: selectedSize, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      newCart[index].quantity += delta;
      if (newCart[index].quantity <= 0) newCart.splice(index, 1);
      return newCart;
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Core Payment Logic
  const processPayment = async (
    amount: number,
    description: string,
    itemsPurchased: CartItem[],
  ) => {
    setPaymentError(null);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const activeUserId = session?.user?.id || null;

    const env = import.meta.env;
    const RAZORPAY_KEY =
      env.VITE_RAZORPAY_KEY_ID ||
      env.VITE_RAZORPAY_LIVE_KEY ||
      env.VITE_RAZORPAY_TEST_KEY ||
      (env.DEV ? "rzp_test_SriOoCe0t7Tbi8" : undefined);

    if (!RAZORPAY_KEY) {
      alert("Payment gateway configuration error. Please contact support.");
      return;
    }

    const options: RazorpayOptions = {
      key: RAZORPAY_KEY,
      amount: amount * 100,
      currency: "INR",
      name: "The Sayyad Studio",
      description: description,
      prefill: {
        name: "Studio Client",
        email: session?.user?.email || "client@thesayyadstudio.co.in",
        contact: shippingInfo.phone,
      },
      theme: { color: "#000000" },

      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },

      handler: async function (response: RazorpayResponse) {
        setIsProcessing(true);

        try {
          if (activeUserId && selectedAddrId === "new") {
            await supabase.from("shipping_profiles").insert([
              {
                user_id: activeUserId,
                label: "Address " + (savedAddresses.length + 1),
                address: shippingInfo.address,
                city: shippingInfo.city,
                pincode: shippingInfo.pincode,
                phone: shippingInfo.phone,
                is_default: savedAddresses.length === 0,
              },
            ]);
          }

          const { data: customerData, error: custErr } = await supabase
            .from("customers")
            .insert([
              {
                name: "Client",
                email: session?.user?.email || "guest@client.com",
                phone: shippingInfo.phone,
                user_id: activeUserId,
              },
            ])
            .select()
            .single();
          if (custErr) throw new Error(`Customer Error: ${custErr.message}`);

          const fullAddress = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.pincode}`;

          const { data: orderData, error: ordErr } = await supabase
            .from("orders")
            .insert([
              {
                customer_id: customerData.id,
                user_id: activeUserId,
                razorpay_payment_id: response.razorpay_payment_id,
                total_amount: amount,
                status: "Paid",
                shipping_address: fullAddress,
              },
            ])
            .select()
            .single();

          if (ordErr) throw new Error(`Order Error: ${ordErr.message}`);

          const orderItems = itemsPurchased.map((item) => ({
            order_id: orderData.id,
            product_id: item.product.id,
            product_name: item.product.title,
            size: item.size,
            quantity: item.quantity,
            price_at_time: item.product.price,
          }));

          const { error: itemErr } = await supabase.from("order_items").insert(orderItems);
          if (itemErr) throw new Error(`Items Error: ${itemErr.message}`);

          // FIXED: Enabled visual diagnostic capture on notification engine invoke
          try {
            const { error: funcErr } = await supabase.functions.invoke("send-order-notifications", {
              body: {
                orderId: orderData.id,
                email: session?.user?.email || "client@thesayyadstudio.co.in",
                phone: shippingInfo.phone,
                amount: amount,
              },
            });

            if (funcErr) {
              alert(`Notification Route Error: ${funcErr.message}`);
            }
          } catch (notiErr: unknown) {
            const msg = notiErr instanceof Error ? notiErr.message : JSON.stringify(notiErr);
            alert(`Notification Interface Crash: ${msg}`);
          }

          setIsProcessing(false);
          setCart([]);
          setOrderSuccessId(orderData.id as string);
        } catch (e: unknown) {
          setIsProcessing(false);
          const exactError = e instanceof Error ? e.message : JSON.stringify(e);
          console.error("Database Write Error:", exactError);
          alert(
            `PAYMENT SUCCESSFUL, BUT DATABASE FAILED.\n\nError: ${exactError}\n\nPayment ID: ${response.razorpay_payment_id}\n\nPlease screenshot this!`,
          );
        }
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response: RazorpayErrorResponse) {
      setIsProcessing(false);
      const errorMsg = response.error.description || "The payment could not be completed.";
      setPaymentError(errorMsg);
    });

    rzp.open();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        isCartOpen,
        setIsCartOpen,
        cartItemCount,
        setIsCheckoutOpen,
        isCheckoutOpen,
        cartTotal,
        clearCart,
      }}
    >
      {children}

      {/* CHECKOUT MODAL WITH EMBEDDED SUCCESS LAYOUT */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden transition-all duration-300">
            {orderSuccessId ? (
              <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-[#0f2e20]/10 rounded-full flex items-center justify-center text-[#0f2e20]">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-display font-bold text-foreground">
                    Order Confirmed!
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Thank you for placing your order with The Sayyad Studio.
                  </p>
                </div>
                <div className="bg-gray-50 border p-4 rounded-xl text-left text-sm space-y-2">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">Order Reference</span>
                    <span className="font-mono font-bold uppercase text-foreground">
                      #{orderSuccessId.slice(0, 8)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-muted-foreground">Dispatch Tracking</span>
                    <span className="text-[#0f2e20] font-semibold text-xs">
                      Sent via WhatsApp & Email
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  className="w-full bg-[#0f2e20] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" /> Continue Shopping
                </button>
              </div>
            ) : (
              <>
                {isProcessing && (
                  <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
                    <h3 className="text-xl font-bold font-display">Confirming Payment...</h3>
                    <p className="text-sm text-gray-500 mt-2 text-center px-6">
                      Please do not close this window while we secure your order.
                    </p>
                  </div>
                )}

                <h2 className="text-2xl font-display mb-6 flex items-center gap-2">
                  <MapPin className="w-6 h-6" /> Shipping Details
                </h2>

                {paymentError && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-red-800 uppercase">Payment Failed</h4>
                      <p className="text-sm text-red-600 mt-1">{paymentError}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {savedAddresses.length > 0 && (
                    <div className="mb-4">
                      <label className="text-xs font-bold uppercase text-muted-foreground block mb-2">
                        Select Address
                      </label>
                      <select
                        value={selectedAddrId}
                        onChange={handleAddressSelect}
                        disabled={isProcessing}
                        className="w-full p-3 border rounded bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
                      >
                        {savedAddresses.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.label || "Saved"} - {a.address}, {a.city}
                          </option>
                        ))}
                        <option value="new">+ Enter New Address</option>
                      </select>
                    </div>
                  )}

                  {selectedAddrId !== "new" ? (
                    <div className="p-4 border rounded bg-gray-50 text-sm space-y-1">
                      <p className="font-bold">{shippingInfo.address}</p>
                      <p>
                        {shippingInfo.city} - {shippingInfo.pincode}
                      </p>
                      <p className="font-semibold mt-2">Ph: {shippingInfo.phone}</p>
                    </div>
                  ) : (
                    <>
                      <input
                        disabled={isProcessing}
                        type="text"
                        placeholder="Full Address"
                        value={shippingInfo.address}
                        className="w-full p-3 border rounded disabled:opacity-50"
                        onChange={(e) => {
                          setShippingInfo({ ...shippingInfo, address: e.target.value });
                          setPaymentError(null);
                        }}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          disabled={isProcessing}
                          type="text"
                          placeholder="City"
                          value={shippingInfo.city}
                          className="p-3 border rounded disabled:opacity-50"
                          onChange={(e) => {
                            setShippingInfo({ ...shippingInfo, city: e.target.value });
                            setPaymentError(null);
                          }}
                        />
                        <input
                          disabled={isProcessing}
                          type="text"
                          placeholder="Pincode"
                          value={shippingInfo.pincode}
                          className="p-3 border rounded disabled:opacity-50"
                          onChange={(e) => {
                            setShippingInfo({ ...shippingInfo, pincode: e.target.value });
                            setPaymentError(null);
                          }}
                        />
                      </div>
                      <input
                        disabled={isProcessing}
                        type="tel"
                        placeholder="Phone Number"
                        value={shippingInfo.phone}
                        className="w-full p-3 border rounded disabled:opacity-50"
                        onChange={(e) => {
                          setShippingInfo({ ...shippingInfo, phone: e.target.value });
                          setPaymentError(null);
                        }}
                      />
                    </>
                  )}
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    disabled={isProcessing}
                    onClick={() => setIsCheckoutOpen(false)}
                    className="flex-1 py-3 border rounded font-bold cursor-pointer hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isProcessing}
                    onClick={() => {
                      if (shippingInfo.address && shippingInfo.phone)
                        processPayment(cartTotal, "Studio Order", cart);
                      else alert("Please fill all shipping details.");
                    }}
                    className="flex-1 py-3 bg-black text-white rounded font-bold cursor-pointer hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {isProcessing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : paymentError ? (
                      "Retry Payment"
                    ) : (
                      `Pay ₹${cartTotal}`
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="font-display text-2xl">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-secondary rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center mt-10 uppercase tracking-widest text-sm font-semibold">
                  Your cart is empty
                </p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex gap-4 border-b border-border pb-6">
                    <div className="w-20 h-24 bg-secondary rounded overflow-hidden">
                      {item.product.image_url && (
                        <img
                          src={item.product.image_url}
                          alt="product"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{item.product.title}</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-semibold">
                          Size: {item.size || "OSFA"}
                        </p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-border rounded">
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            className="p-1.5 hover:bg-secondary cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            className="p-1.5 hover:bg-secondary cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold">₹{item.product.price * item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-6 border-t border-border bg-secondary/30">
              <div className="flex justify-between items-center mb-6">
                <span className="uppercase tracking-widest text-sm font-bold text-muted-foreground">
                  Subtotal
                </span>
                <span className="font-display text-2xl font-bold">₹{cartTotal}</span>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                disabled={cart.length === 0}
                className="w-full bg-primary text-primary-foreground py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-ink transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Proceed to Shipping
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
