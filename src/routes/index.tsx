import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/')({
  component: Storefront,
})

function Storefront() {
  // State Management
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  // System Initialization: Razorpay & Supabase
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error) setProducts(data || [])
      setLoading(false)
    }
    fetchProducts()
  }, [])

  // Payment Handler
  const handlePayment = (product: any) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SriOoCe0t7Tbi8',
      amount: product.price * 100, 
      currency: 'INR',
      name: 'TheSayyadStudio',
      description: product.title,
      handler: function (response: any) {
        alert(`Payment Successful! \nPayment ID: ${response.razorpay_payment_id}`)
      },
      prefill: { name: 'Studio Client', email: 'client@thesayyadstudio.co.in', contact: '9999999999' },
      theme: { color: '#ffffff' }
    }
    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  }

  // Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-10 font-bold tracking-widest uppercase flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
        <span>Loading Studio...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black">
      
      {/* 🧭 PREMIUM NAVIGATION BAR */}
      <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <div className="text-xl font-bold tracking-[0.2em] uppercase">TheSayyadStudio</div>
        <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest text-gray-400 uppercase">
          <a href="#" className="hover:text-white transition-colors">Films</a>
          <a href="#" className="hover:text-white transition-colors">4K Apparel</a>
          <a href="#" className="hover:text-white transition-colors">About</a>
        </div>
        <button className="text-sm font-bold tracking-widest uppercase border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all">
          Cart (0)
        </button>
      </nav>

      {/* 🎬 CINEMATIC HERO SECTION: Only She Believed */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black border-b border-gray-900 pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#0a0a0a] to-black z-0"></div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-gray-500 mb-6">
            A Studio Original Short
          </span>
          <h1 className="text-5xl md:text-8xl font-serif tracking-wider mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-2xl">
            ONLY SHE BELIEVED
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl font-light leading-relaxed">
            A 9-minute epic of heroic warriors, Himalayan altitudes, and the solitary courage to face the storm.
          </p>
          
          <button 
            onClick={() => setIsVideoOpen(true)}
            className="group flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/20 backdrop-blur-md px-10 py-5 rounded-full transition-all duration-500 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] cursor-pointer"
          >
            <div className="w-5 h-5 bg-white transition-transform duration-300 group-hover:scale-90" style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}></div>
            <span className="font-bold tracking-[0.2em] text-sm uppercase">Watch The Film</span>
          </button>
        </div>
      </section>

      {/* 🎥 THE VIDEO MODAL OVERLAY */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
          <button 
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-6 right-6 text-white text-4xl font-light hover:text-gray-400 transition-colors z-50 cursor-pointer"
          >
            &times;
          </button>
          <div className="w-full max-w-6xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden relative border border-gray-800">
            {/* Replace this YouTube ID (dQw4w9WgXcQ) with your actual film's ID */}
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1" 
              title="Only She Believed"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {/* 👕 DYNAMIC APPAREL CATALOG */}
      <section className="p-8 md:p-16 max-w-7xl mx-auto py-24">
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-4xl font-light tracking-wide">The Print Collection</h2>
          <span className="text-gray-500 uppercase tracking-widest text-xs font-bold">4K Certified</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => (
            <div key={product.id