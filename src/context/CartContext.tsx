import React, { createContext, useContext, useState, useEffect } from "react";
import { X, Plus, Minus } from "lucide-react";
import { supabase } from "@/lib/supabase";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [shippingInfo, setShippingInfo] = useState({ address: "", city: "", pincode: "", phone: "" });

  // 1. Load Razorpay and Fetch Saved Address
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    if (isCheckoutOpen) {
      async function loadSavedAddress() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data } = await supabase
            .from('shipping_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('is_default', true)
            .maybeSingle();
          
          if (data) setShippingInfo(data);
        }
      }
      loadSavedAddress();
    }
  }, [isCheckoutOpen]);

  const addToCart = (product: any, selectedSize: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id && item.size === selectedSize);
      if (existingItem) {
        return prevCart.map(item => 
          (item.product.id === product.id && item.size === selectedSize) 
            ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, size: selectedSize, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[index].quantity += delta;
      if (newCart[index].quantity <= 0) newCart.splice(index, 1);
      return newCart;
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // 2. Core Payment Logic
  const processPayment = async (amount: number, description: string, itemsPurchased: any[]) => {
    const { data: { session } } = await supabase.auth.getSession();
    const activeUserId = session?.user?.id || null;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SriOoCe0t7Tbi8",
      amount: amount * 100, 
      currency: "INR",
      name: "The Sayyad Studio",
      description: description,
      prefill: { 
        name: "Studio Client", 
        email: session?.user?.email || "client@thesayyadstudio.co.in", 
        contact: shippingInfo.phone 
      },
      theme: { color: "#000000" },
      
      handler: async function (response: any) {
        try {
          // If logged in, save the address for next time
          if (activeUserId) {
             await supabase.from('shipping_profiles').insert([{
               user_id: activeUserId,
               address: shippingInfo.address,
               city: shippingInfo.city,
               pincode: shippingInfo.pincode,
               phone: shippingInfo.phone,
               is_default: true
             }]);
          }

          // Insert Customer
          const { data: customerData } = await supabase
            .from('customers')
            .insert([{ name: "Client", email: session?.user?.email || "guest@client.com", phone: shippingInfo.phone, user_id: activeUserId }])
            .select().single();

          // Insert Order
          const { data: orderData } = await supabase
            .from('orders')
            .insert([{
              customer_id: customerData.id,
              user_id: activeUserId,
              razorpay_payment_id: response.razorpay_payment_id,
              total_amount: amount,
              status: 'Paid',
              shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.pincode}`
            }])
            .select().single();

          // Insert Items
          const orderItems = itemsPurchased.map(item => ({
            order_id: orderData.id,
            product_id: item.product.id,
            product_name: item.product.title,
            size: item.size,
            quantity: item.quantity,
            price_at_time: item.product.price
          }));

          await supabase.from('order_items').insert(orderItems);

          alert(`Order Placed Successfully! ID: ${orderData.id}`);
          setCart([]); 
          setIsCheckoutOpen(false);
        } catch (e) { console.error(e); alert("Error saving order."); }
      }
    };
    new (window as any).Razorpay(options).open();
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, isCartOpen, setIsCartOpen, cartItemCount, setIsCheckoutOpen }}>
      {children}
      
      {/* CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-display mb-6">Shipping Details</h2>
            <div className="space-y-4">
              <input type="text" placeholder="Full Address" value={shippingInfo.address} className="w-full p-3 border rounded" onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="City" value={shippingInfo.city} className="p-3 border rounded" onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})} />
                <input type="text" placeholder="Pincode" value={shippingInfo.pincode} className="p-3 border rounded" onChange={(e) => setShippingInfo({...shippingInfo, pincode: e.target.value})} />
              </div>
              <input type="tel" placeholder="Phone Number" value={shippingInfo.phone} className="w-full p-3 border rounded" onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})} />
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setIsCheckoutOpen(false)} className="flex-1 py-3 border rounded font-bold cursor-pointer">Cancel</button>
              <button 
                onClick={() => { if(shippingInfo.address) processPayment(cartTotal, "Studio Order", cart); }} 
                className="flex-1 py-3 bg-black text-white rounded font-bold cursor-pointer"
              >
                Pay ₹{cartTotal}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="font-display text-2xl">Your Cart</h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center mt-10 uppercase tracking-widest text-sm font-semibold">Your cart is empty</p>
              ) : (
                cart.map((item, index) => (
                  <div key={index} className="flex gap-4 border-b border-border pb-6">
                    <div className="w-20 h-24 bg-secondary rounded overflow-hidden">
                      {item.product.image_url && <img src={item.product.image_url} alt="product" className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-medium text-foreground">{item.product.title}</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1 font-semibold">Size: {item.size || 'OSFA'}</p>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center border border-border rounded">
                          <button onClick={() => updateQuantity(index, -1)} className="p-1.5 hover:bg-secondary cursor-pointer"><Minus className="w-3 h-3" /></button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(index, 1)} className="p-1.5 hover:bg-secondary cursor-pointer"><Plus className="w-3 h-3" /></button>
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
                <span className="uppercase tracking-widest text-sm font-bold text-muted-foreground">Subtotal</span>
                <span className="font-display text-2xl font-bold">₹{cartTotal}</span>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} 
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

export const useCart = () => useContext(CartContext);