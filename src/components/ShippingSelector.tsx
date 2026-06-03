import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { MapPin } from "lucide-react";

export function ShippingSelector({ userId, onSelect }: { userId: string, onSelect: (addr: any) => void }) {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string>("");

  useEffect(() => {
    async function fetchAddresses() {
      const { data } = await supabase.from("shipping_profiles").select("*").eq("user_id", userId);
      if (data && data.length > 0) {
        setAddresses(data);
        const defaultAddr = data.find((a: any) => a.is_default) || data[0];
        setSelectedAddrId(defaultAddr.id);
        onSelect(defaultAddr);
      }
    }
    fetchAddresses();
  }, [userId, onSelect]);

  const handleSelect = (id: string) => {
    const addr = addresses.find((a) => a.id === id);
    setSelectedAddrId(id);
    onSelect(addr);
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg bg-white shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-bold flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Shipping Address
        </h3>
        <a href="/dashboard" className="text-xs font-bold uppercase underline hover:text-black">
          Manage Addresses
        </a>
      </div>

      <select
        value={selectedAddrId}
        onChange={(e) => handleSelect(e.target.value)}
        className="w-full border p-3 rounded-md bg-gray-50 text-sm focus:ring-2 focus:ring-black outline-none"
      >
        {addresses.map((addr) => (
          <option key={addr.id} value={addr.id}>
            {addr.label} - {addr.address}, {addr.city}
          </option>
        ))}
      </select>

      {addresses.find(a => a.id === selectedAddrId) && (
        <div className="p-4 border-l-4 border-black bg-gray-50 text-sm">
          <p className="font-bold">
            {addresses.find(a => a.id === selectedAddrId)?.label}
          </p>
          <p className="text-gray-600">
            {addresses.find(a => a.id === selectedAddrId)?.address}, {addresses.find(a => a.id === selectedAddrId)?.city}
          </p>
          <p className="text-gray-600">
            {addresses.find(a => a.id === selectedAddrId)?.state} - {addresses.find(a => a.id === selectedAddrId)?.pincode}
          </p>
          <p className="mt-2 font-semibold">Ph: {addresses.find(a => a.id === selectedAddrId)?.phone}</p>
        </div>
      )}
    </div>
  );
}