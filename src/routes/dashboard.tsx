import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import { ShoppingBag, Calendar, CheckCircle, Package } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get the current logged-in user session
    async function getProfileAndOrders() {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);

        // 2. Query orders table for this user AND join the line items
        const { data, error } = await supabase
          .from("orders")
          .select(`
            id,
            razorpay_payment_id,
            total_amount,
            status,
            created_at,
            order_items (
              id,
              product_name,
              size,
              quantity,
              price_at_time
            )
          `)
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (!error) {
          setOrders(data || []);
        }
      }
      setLoading(false);
    }

    getProfileAndOrders();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-32 text-muted-foreground font-semibold uppercase tracking-widest text-sm">
          Loading Studio Profile...
        </div>
      </Layout>
    );
  }

  // Auth Guard: Redirect or message if not logged in
  if (!user) {
    return (
      <Layout>
        <div className="mx-auto max-w-md text-center py-32 px-6">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-6 font-light" />
          <h2 className="font-display text-2xl mb-2">Access Denied</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Please sign in to your account to view your purchase history and order tracking.
          </p>
          <Link to="/" className="bg-primary text-primary-foreground px-6 py-3 rounded text-xs font-bold uppercase tracking-wider hover:bg-ink transition-colors">
            Return Home
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-6 lg:px-10 py-12 lg:py-20">
        {/* Profile Header */}
        <div className="border-b border-border pb-8 mb-12">
          <p className="eyebrow text-accent">Studio Member</p>
          <h1 className="font-display text-4xl lg:text-5xl mt-2">
            Welcome back, <em className="font-light">{user.user_metadata?.name || 'Client'}</em>
          </h1>
          <p className="text-sm text-muted-foreground mt-2">{user.email}</p>
        </div>

        {/* Order History Section */}
        <h2 className="font-display text-2xl mb-6 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" /> Past Orders
        </h2>

        {orders.length === 0 ? (
          <div className="border border-dashed border-border rounded-xl p-12 text-center bg-secondary/10">
            <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">No orders found yet</p>
            <p className="text-xs text-muted-foreground mt-2">Your cinematic collection acquisitions will appear right here.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border border-border rounded-xl overflow-hidden bg-white shadow-sm">
                
                {/* Receipt Sub-header */}
                <div className="bg-secondary/20 px-6 py-4 border-b border-border flex flex-wrap justify-between items-center gap-4 text-xs md:text-sm">
                  <div className="flex gap-6 flex-wrap">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Date Placed</span>
                      <span className="font-medium text-foreground flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Total Value</span>
                      <span className="font-bold text-foreground mt-0.5 block">₹{order.total_amount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-bold tracking-wider">Payment ID</span>
                      <span className="font-mono text-muted-foreground mt-0.5 block text-xs">{order.razorpay_payment_id}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200/50">
                      <CheckCircle className="w-3.5 h-3.5" /> {order.status}
                    </span>
                  </div>
                </div>

                {/* Purchased Items List */}
                <div className="divide-y divide-border px-6">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="py-5 flex justify-between items-center text-sm gap-4">
                      <div>
                        <h4 className="font-display font-medium text-base text-foreground">{item.product_name}</h4>
                        <div className="flex gap-4 text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
                          <span>Size: {item.size || 'OSFA'}</span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-foreground">₹{item.price_at_time * item.quantity}</span>
                        {item.quantity > 1 && (
                          <span className="block text-[11px] text-muted-foreground mt-0.5">₹{item.price_at_time} each</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}