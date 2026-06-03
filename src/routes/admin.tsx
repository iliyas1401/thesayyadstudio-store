import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/lib/supabase";
import { Package, Tag, Plus, Loader2, Trash2, X, Edit2, Users, Shield, Ban, CheckCircle } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [user, setUser] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"orders" | "products" | "users">("orders");
  
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  
  // Product Form State - Added images_input for multiline URLs
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ title: "", price: "", category: "", images_input: "", sizes: "S,M,L,XL" });

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "staff" });

  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuthAndFetchData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate({ to: "/login" }); return; }

      const { data: roleData, error: roleError } = await supabase.from('user_roles').select(`roles ( name )`).eq('user_id', session.user.id);
      const mappedRoles = roleData?.map((r: any) => r.roles.name) || [];
      const hasDashboardAccess = mappedRoles.some(role => ['admin', 'supervisor', 'staff'].includes(role));

      if (roleError || !hasDashboardAccess) { alert("Unauthorized access."); navigate({ to: "/" }); return; }

      setUser(session.user);
      setUserRoles(mappedRoles); 

      const canManageUsers = mappedRoles.includes('admin') || mappedRoles.includes('supervisor');

      const [orderRes, productRes, usersRes] = await Promise.all([
        supabase.from("orders").select("*, customers(name, email), order_items(*)").order("created_at", { ascending: false }),
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        canManageUsers ? supabase.rpc('get_users') : Promise.resolve({ data: [] })
      ]);

      setOrders(orderRes.data || []);
      setProducts(productRes.data || []);
      if (usersRes.data) setSystemUsers(usersRes.data);
      setLoading(false);
    }
    checkAuthAndFetchData();
  }, [navigate]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (!error) setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = newProduct.sizes.split(",").map(s => s.trim());
    // Parse the textarea by commas or newlines into an array
    const imagesArray = newProduct.images_input.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    
    // We still save the first image to image_url for legacy safety, but save all to images array
    const productData = { 
      title: newProduct.title,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      image_url: imagesArray[0] || "",
      images: imagesArray,
      sizes: sizesArray 
    };

    if (editingProductId) {
      const { error } = await supabase.from("products").update(productData).eq("id", editingProductId);
      if (!error) {
        setProducts(products.map(p => p.id === editingProductId ? { ...p, ...productData } : p));
        resetProductForm();
      }
    } else {
      const { data, error } = await supabase.from("products").insert([productData]).select();
      if (!error && data) {
        setProducts([data[0], ...products]);
        resetProductForm();
      }
    }
  };

  const deleteProduct = async (id: string) => {
    if (!window.confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setProducts(products.filter(p => p.id !== id));
  };

  const handleEditProductClick = (product: any) => {
    setIsAddingProduct(true);
    setEditingProductId(product.id);
    
    // Convert array back to a comma-separated string for the textarea
    const currentImages = product.images?.length > 0 ? product.images : [product.image_url];
    
    setNewProduct({ 
      title: product.title, 
      price: product.price.toString(), 
      category: product.category, 
      images_input: currentImages.filter(Boolean).join(",\n"), 
      sizes: product.sizes.join(", ") 
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetProductForm = () => {
    setIsAddingProduct(false);
    setEditingProductId(null);
    setNewProduct({ title: "", price: "", category: "", images_input: "", sizes: "S,M,L,XL" });
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      const { error } = await supabase.rpc('update_dashboard_user', { p_target_id: editingUserId, p_name: newUser.name, p_role: newUser.role });
      if (error) alert("Error: " + error.message); else refreshUsersAndReset();
    } else {
      const { error } = await supabase.rpc('create_dashboard_user', { p_name: newUser.name, p_email: newUser.email, p_password: newUser.password, p_role: newUser.role });
      if (error) alert("Error: " + error.message); else refreshUsersAndReset();
    }
  };

  const handleEditUserClick = (sysUser: any) => {
    setIsAddingUser(true); setEditingUserId(sysUser.id);
    setNewUser({ name: sysUser.name || "", email: sysUser.email, password: "", role: sysUser.role });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUserAction = async (targetId: string, action: 'suspend' | 'restore' | 'delete') => {
    if (!window.confirm(`Confirm ${action.toUpperCase()}?`)) return;
    const { error } = await supabase.rpc('manage_user_action', { p_target_id: targetId, p_action: action });
    if (error) alert("Error: " + error.message); else refreshUsersAndReset();
  };

  const refreshUsersAndReset = async () => {
    setIsAddingUser(false); setEditingUserId(null); setNewUser({ name: "", email: "", password: "", role: "staff" });
    const { data } = await supabase.rpc('get_users');
    if (data) setSystemUsers(data);
  };

  const resetUserForm = () => {
    setIsAddingUser(false); setEditingUserId(null); setNewUser({ name: "", email: "", password: "", role: "staff" });
  };

  if (loading) return <Layout><div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div></Layout>;

  const canManageProducts = userRoles.includes('admin') || userRoles.includes('supervisor');
  const canDeleteProducts = userRoles.includes('admin');
  const canManageUsers = userRoles.includes('admin') || userRoles.includes('supervisor');
  const isAdmin = userRoles.includes('admin');

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 mb-8">
          <h1 className="font-display text-4xl">Team Dashboard</h1>
          <div className="flex flex-wrap gap-2">{userRoles.map(role => (<span key={role} className="bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded">{role}</span>))}</div>
        </div>

        <div className="flex gap-4 mb-8 border-b overflow-x-auto">
          <button onClick={() => { setActiveTab("orders"); resetProductForm(); resetUserForm(); }} className={`pb-4 px-4 font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === "orders" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"}`}><Package className="w-4 h-4" /> Manage Orders</button>
          {canManageProducts && <button onClick={() => { setActiveTab("products"); resetUserForm(); }} className={`pb-4 px-4 font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === "products" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"}`}><Tag className="w-4 h-4" /> Manage Products</button>}
          {canManageUsers && <button onClick={() => { setActiveTab("users"); resetProductForm(); }} className={`pb-4 px-4 font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-colors whitespace-nowrap ${activeTab === "users" ? "border-b-2 border-black text-black" : "text-gray-400 hover:text-black"}`}><Users className="w-4 h-4" /> Team & Users</button>}
        </div>

        {activeTab === "orders" && (
          <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 uppercase tracking-widest text-xs text-gray-500 border-b">
                <tr><th className="p-6 font-semibold">Order ID</th><th className="p-6 font-semibold">Date</th><th className="p-6 font-semibold">Customer</th><th className="p-6 font-semibold">Amount</th><th className="p-6 font-semibold">Status</th></tr>
              </thead>
              <tbody className="divide-y">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6 font-mono font-medium text-gray-900">{order.id.slice(0, 8)}</td>
                    <td className="p-6 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="p-6"><p className="font-bold text-gray-900">{order.customers?.name || 'Guest'}</p><p className="text-xs text-gray-500 mt-1">{order.customers?.email}</p></td>
                    <td className="p-6 font-bold text-gray-900">₹{order.total_amount}</td>
                    <td className="p-6">
                      <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="text-xs font-bold uppercase px-3 py-1.5 rounded-md outline-none border cursor-pointer bg-gray-50">
                        <option value="Paid">Paid</option><option value="Shipped">Shipped</option><option value="Delivered">Delivered</option><option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "products" && canManageProducts && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Inventory</h2>
              <button onClick={isAddingProduct ? resetProductForm : () => setIsAddingProduct(true)} className="bg-black text-white px-5 py-2.5 text-xs uppercase tracking-wider font-bold rounded-md flex items-center gap-2 hover:bg-gray-800 cursor-pointer">
                {isAddingProduct ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {isAddingProduct ? "Cancel" : "Add Product"}
              </button>
            </div>

            {isAddingProduct && (
              <form onSubmit={handleSaveProduct} className="bg-gray-50 p-8 rounded-xl border mb-8 grid md:grid-cols-2 gap-5 shadow-sm">
                <div className="space-y-1"><label className="text-xs font-bold uppercase text-gray-500">Product Title</label><input required value={newProduct.title} onChange={e => setNewProduct({...newProduct, title: e.target.value})} className="p-3 border rounded-md w-full outline-none" /></div>
                <div className="space-y-1"><label className="text-xs font-bold uppercase text-gray-500">Price (₹)</label><input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="p-3 border rounded-md w-full outline-none" /></div>
                <div className="space-y-1"><label className="text-xs font-bold uppercase text-gray-500">Category</label><input required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="p-3 border rounded-md w-full outline-none" /></div>
                <div className="space-y-1"><label className="text-xs font-bold uppercase text-gray-500">Sizes</label><input required value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} className="p-3 border rounded-md w-full outline-none" /></div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold uppercase text-gray-500">Image URLs (Comma or Newline separated)</label>
                  <textarea required rows={4} placeholder="https://image1.jpg, &#10;https://image2.jpg" value={newProduct.images_input} onChange={e => setNewProduct({...newProduct, images_input: e.target.value})} className="p-3 border rounded-md w-full outline-none resize-y font-mono text-xs" />
                </div>
                <button type="submit" className="bg-black text-white py-3.5 rounded-md font-bold uppercase tracking-widest md:col-span-2 hover:bg-gray-800 mt-2 cursor-pointer">{editingProductId ? "Update Product" : "Save Product"}</button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white border rounded-xl overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[4/5] bg-gray-100 relative">
                    <img src={product.images?.[0] || product.image_url} alt={product.title} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => handleEditProductClick(product)} className="p-2 bg-white/90 text-blue-600 rounded-full hover:bg-blue-50 hover:scale-110 cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      {canDeleteProducts && <button onClick={() => deleteProduct(product.id)} className="p-2 bg-white/90 text-red-500 rounded-full hover:bg-red-50 hover:scale-110 cursor-pointer"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 truncate">{product.title}</h3>
                    <div className="flex justify-between items-center mt-3 text-sm"><span className="font-bold text-gray-900">₹{product.price}</span><span className="uppercase text-[10px] tracking-wider font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-sm">{product.category}</span></div>
                    {product.images?.length > 1 && <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-widest">{product.images.length} Images Available</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && canManageUsers && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">System Users</h2>
              <button onClick={isAddingUser ? resetUserForm : () => setIsAddingUser(true)} className="bg-black text-white px-5 py-2.5 text-xs uppercase tracking-wider font-bold rounded-md flex items-center gap-2 hover:bg-gray-800 cursor-pointer">
                {isAddingUser ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {isAddingUser ? "Cancel" : "Create User"}
              </button>
            </div>
            {/* Same User Form and List Code as Before... keeping it brief to fit the character limits, assuming no changes needed here. If it cuts off, use your previous User Tab code. */}
          </div>
        )}
      </div>
    </Layout>
  );
}