import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { X, Loader2, CreditCard } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutModal() {
  const { cartItems, cartTotal, isCheckoutOpen, setIsCheckoutOpen, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({ name: "", email: "", phone: "", address: "" });

  if (!isCheckoutOpen) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || null;

      // 1. Generate Razorpay Order ID via Supabase Edge Function securely
      const { data: razorpayOrder, error: funcError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount: cartTotal }
      });

      if (funcError || !razorpayOrder?.id) {
        throw new Error(funcError?.message || "Failed to initialize production order registry with Razorpay.");
      }

      // 2. Insert the pending order row into Supabase to generate the unique tracking ID
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: userId,
            total_amount: cartTotal,
            status: "Paid", 
            shipping_address: `${shippingDetails.name}, ${shippingDetails.address}, Phone: ${shippingDetails.phone}`,
            order_items: cartItems.map(item => ({
              product_id: item.id,
              title: item.title || item.name,
              size: item.size,
              quantity: item.quantity || 1,
              price: item.price
            }))
          }
        ])
        .select()
        .single();

      if (orderError || !orderData) {
        throw new Error(orderError?.message || "Failed to register order in database.");
      }

      // 3. Configure Razorpay Options with secure Env Key and verified Order ID
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Pulls dynamically from Vercel environment variables
        amount: cartTotal * 100, // Amount in paisa
        currency: "INR",
        name: "The Sayyad Studio",
        description: "Premium Garment Purchase",
        order_id: razorpayOrder.id, // MANDATORY FOR LIVE MODE CHECKOUT
        prefill: {
          name: shippingDetails.name,
          email: shippingDetails.email,
          contact: shippingDetails.phone,
        },
        // LINK TO THE WEBHOOK
        notes: {
          supabase_order_id: orderData.id 
        },
        theme: {
          color: "#0f2e20",
        },
        handler: function (response: any) {
          alert(`Payment Successful! ID: ${response.razorpay_payment_id}`);
          clearCart();
          setIsCheckoutOpen(false);
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: any) {
      alert(err.message || "Something went wrong.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-8 relative shadow-2xl">
        
        <button 
          onClick={() => setIsCheckoutOpen(false)}
          className="absolute top-5 right-5 text-gray-400 hover:text-black cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-3xl mb-2 text-foreground">Checkout Details</h2>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-6">
          Total Order Value: <span className="font-bold text-foreground ml-1">₹{cartTotal}</span>
        </p>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Full Name</label>
            <input required type="text" placeholder="Your Name" value={shippingDetails.name} onChange={e => setShippingDetails({...shippingDetails, name: e.target.value})} className="w-full p-3 border rounded-lg outline-none text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Email Address</label>
              <input required type="email" placeholder="name@example.com" value={shippingDetails.email} onChange={e => setShippingDetails({...shippingDetails, email: e.target.value})} className="w-full p-3 border rounded-lg outline-none text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Phone Number</label>
              <input required type="tel" placeholder="+91 XXXXX XXXXX" value={shippingDetails.phone} onChange={e => setShippingDetails({...shippingDetails, phone: e.target.value})} className="w-full p-3 border rounded-lg outline-none text-sm" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Shipping Address</label>
            <textarea required rows={3} placeholder="Complete Shipping Address" value={shippingDetails.address} onChange={e => setShippingDetails({...shippingDetails, address: e.target.value})} className="w-full p-3 border rounded-lg outline-none text-sm resize-none" />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#0f2e20] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-4 cursor-pointer hover:bg-black"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Launching Gateway...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" /> Proceed to Secure Payment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}