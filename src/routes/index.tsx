import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/')({
  component: Storefront,
})

function Storefront() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    async function fetchProducts() {
      // Added an 'order' clause so the newest shirts appear first
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (!error) setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const handlePayment = (product: any) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: product.price * 100, 
      currency: 'INR',
      name: 'TheSayyadStudio',
      description: product.title,
      handler: function (response: any) {
        alert(`Payment Successful! \nPayment ID: ${response.razorpay_payment_id}`)
      },
      prefill: { name: 'Test Customer', email: 'test@thesayyadstudio.co.in', contact: '9999999999' },
      theme: { color: '#ffffff' } // Switched to white to contrast the dark UI
    }
    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  }

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] text-white p-10 font-bold tracking-widest uppercase flex items-center justify-center">Loading Studio...</div>

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black">
      
      {/* 🎬 CINEMATIC HERO SECTION: Only She Believed */}
      <section className="relative w-full h-[85vh] flex flex-col items-center justify-center overflow-hidden bg-black border-b border-gray-900">
        {/* Deep background gradient for heroic atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black z-0"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-gray-500 mb-6">
            A TheSayyadStudio Original Short
          </span>
          <h1 className="text-5xl md:text-8xl font-serif tracking-wider mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-2xl">
            ONLY SHE BELIEVED
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl font-light leading-relaxed">
            A 9-minute epic of heroic warriors, Himalayan altitudes, and the solitary courage to face the storm.
          </p>
          
          {/* Custom Play Button */}
          <button className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/20 backdrop-blur-md px-10 py-5 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            <div className="w-5 h-5 bg-white transition-transform duration-300 group-hover:scale-90" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}></div>
            <span className="font-bold tracking-[0.2em] text-sm uppercase">Watch The Film</span>
          </button>
        </div>
      </section>

      {/* 👕 DYNAMIC APPAREL CATALOG */}
      <section className="p-8 md:p-16 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide">The Print Collection</h2>
          <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">4K Certified</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col">
              
              {/* Dynamic Image Container */}
              <div className="aspect-[4/5] w-full rounded-sm mb-6 overflow-hidden bg-gray-900 relative">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.title} 
                    className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold uppercase tracking-widest">Image Missing</div>
                )}
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-medium tracking-wide pr-4">{product.title}</h2>
                <p className="text-xl font-bold tracking-wider">₹{product.price}</p>
              </div>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-6 font-light">{product.description}</p>
              
              <div className="flex gap-2 mb-8">
                {product.sizes.map((size: string) => (
                  <span key={size} className="border border-gray-700 text-gray-300 px-3 py-1 text-xs font-bold uppercase rounded-sm">
                    {size}
                  </span>
                ))}
              </div>
              
              <button 
                onClick={() => handlePayment(product)}
                className="mt-auto w-full bg-white text-black py-4 font-bold tracking-[0.2em] uppercase text-sm hover:bg-gray-200 transition-colors"
              >
                Purchase Securely
              </button>
            </div>
          ))}
        </div>
      </section>
      
    </div>
  )
}