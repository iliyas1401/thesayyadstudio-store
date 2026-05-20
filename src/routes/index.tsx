import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const Route = createFileRoute('/')({
  component: Storefront,
})

function Storefront() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  
  // NEW: State to track which size is selected for which product ID
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({})

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

  // Handle Size Selection
  const handleSizeClick = (productId: string, size: string) => {
    setSelectedSizes(prev => ({
      ...prev,
      [productId]: size
    }))
  }

  // Handle Payment with Size Validation
  const handlePayment = (product: any) => {
    const selectedSize = selectedSizes[product.id]
    
    if (!selectedSize) {
      alert("Please select a size before purchasing.")
      return
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SriOoCe0t7Tbi8',
      amount: product.price * 100, 
      currency: 'INR',
      name: 'TheSayyadStudio',
      description: `${product.title} - Size: ${selectedSize}`,
      handler: function (response: any) {
        alert(`Payment Successful! \nOrder ID: ${response.razorpay_payment_id}\nSize: ${selectedSize}`)
      },
      prefill: { name: 'Studio Client', email: 'client@thesayyadstudio.co.in', contact: '9999999999' },
      theme: { color: '#ffffff' }
    }
    const rzp = new (window as any).Razorpay(options)
    rzp.open()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white p-10 font-bold tracking-widest uppercase flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-t-2 border-white rounded-full animate-spin"></div>
        <span>Loading Studio...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black scroll-smooth">
      
      {/* 🧭 NAVIGATION & SMART LOGO */}
      <nav className="fixed top-0 w-full z-40 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-5 flex justify-between items-center">
        <div className="flex items-center">
          {/* Smart Logo Fallback: If image fails, hide image and show text span */}
          <img 
            src="/logo.png" 
            alt="TheSayyadStudio Logo" 
            className="h-10 md:h-12 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
          <span className="hidden text-2xl font-black tracking-tight text-white">TheSayyadStudio</span>
        </div>
        
        <div className="hidden md:flex gap-8 text-xs font-bold tracking-[0.2em] text-gray-400 uppercase">
          <a href="#film" className="hover:text-white transition-colors">Films</a>
          <a href="#heritage" className="hover:text-white transition-colors">Heritage</a>
          <a href="#catalog" className="hover:text-white transition-colors">Catalog</a>
        </div>
        
        <button className="text-xs font-bold tracking-[0.2em] uppercase border border-white/20 px-6 py-2.5 rounded-full hover:bg-white hover:text-black transition-all">
          Cart (0)
        </button>
      </nav>

      {/* 🎬 HERO SECTION */}
      <section id="film" className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black pt-16">
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

      {/* 🏛️ TRUE HERITAGE SECTION */}
      <section id="heritage" className="w-full bg-[#050505] border-t border-b border-white/5 py-32 px-8 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-20 items-center">
          <div className="md:w-1/2">
            <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-gray-500 mb-8">Our Heritage</h2>
            <h3 className="text-5xl md:text-6xl font-serif tracking-wide mb-8 leading-tight">The mark of <br/>a Master.</h3>
            <p className="text-gray-400 text-lg font-light leading-relaxed mb-12">
              The name Sayyad translates to 'Master' and embodies precision, focus, and skill. For generations, we have upheld this legacy in every stitch and detail of our clothing.
            </p>
            
            <div className="space-y-8">
              <div className="border-l border-white/10 pl-6">
                <h4 className="text-white font-bold tracking-[0.2em] uppercase text-sm mb-2">
                  <span className="text-gray-600 mr-4 font-serif text-lg">01</span>Precision
                </h4>
                <p className="text-gray-400 font-light text-sm leading-relaxed">Every cut, every seam — measured and intentional. Nothing left to chance.</p>
              </div>
              <div className="border-l border-white/10 pl-6">
                <h4 className="text-white font-bold tracking-[0.2em] uppercase text-sm mb-2">
                  <span className="text-gray-600 mr-4 font-serif text-lg">02</span>Focus
                </h4>
                <p className="text-gray-400 font-light text-sm leading-relaxed">Small, considered drops. We make less so each piece carries more meaning.</p>
              </div>
              <div className="border-l border-white/10 pl-6">
                <h4 className="text-white font-bold tracking-[0.2em] uppercase text-sm mb-2">
                  <span className="text-gray-600 mr-4 font-serif text-lg">03</span>Skill
                </h4>
                <p className="text-gray-400 font-light text-sm leading-relaxed">Generations of craft, refined into garments built to be lived in and remembered.</p>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 aspect-[4/5] bg-gray-900 relative overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-1000">
            <img 
              src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop" 
              alt="Studio Heritage" 
              className="object-cover w-full h-full opacity-60"
            />
          </div>
        </div>
      </section>

      {/* 🎥 VIDEO MODAL */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-10">
          <button 
            onClick={() => setIsVideoOpen(false)}
            className="absolute top-6 right-6 text-white text-4xl font-light hover:text-gray-400 transition-colors z-50 cursor-pointer"
          >
            &times;
          </button>
          <div className="w-full max-w-6xl aspect-video bg-black rounded-lg shadow-2xl overflow-hidden relative border border-gray-800">
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

      {/* 👕 THE CATALOG WITH CLICKABLE SIZES */}
      <section id="catalog" className="p-8 md:p-16 max-w-7xl mx-auto py-32">
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
          <h2 className="text-3xl md:text-5xl font-serif tracking-wide">The Catalog</h2>
          <span className="text-gray-500 uppercase tracking-[0.3em] text-xs font-bold">4K Certified</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col">
              <div className="aspect-[4/5] w-full rounded-sm mb-6 overflow-hidden bg-gray-900 relative">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.title} 
                    className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold uppercase tracking-widest">
                    Image Missing
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-medium tracking-wide pr-4">{product.title}</h2>
                <p className="text-xl font-bold tracking-wider">₹{product.price}</p>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 font-light">{product.description}</p>
              
              {/* INTERACTIVE SIZE SELECTOR */}
              <div className="flex flex-wrap gap-2 mb-8">
                {product.sizes?.map((size: string) => {
                  const isSelected = selectedSizes[product.id] === size;
                  return (
                    <button 
                      key={size} 
                      onClick={() => handleSizeClick(product.id, size)}
                      className={`border px-4 py-1.5 text-xs font-bold uppercase rounded-sm transition-colors duration-200 cursor-pointer
                        ${isSelected 
                          ? 'border-white bg-white text-black' 
                          : 'border-gray-700 text-gray-300 hover:border-gray-400'}`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
              
              <button 
                onClick={() => handlePayment(product)}
                className="mt-auto w-full bg-white text-black py-4 font-bold tracking-[0.2em] uppercase text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Purchase Securely
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 🏁 FOOTER */}
      <footer className="w-full border-t border-white/10 bg-black pt-16 pb-8 px-8 md:px-16 text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div>
            <div className="text-white text-xl font-bold tracking-tight mb-2">TheSayyadStudio</div>
            <p className="font-light text-sm">Cinematic narratives. Premium apparel. Designed in Pune.</p>
          </div>
          <div className="flex gap-6 text-sm font-bold tracking-widest uppercase">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto text-xs font-light tracking-wider flex justify-between">
          <span>&copy; {new Date().getFullYear()} TheSayyadStudio. All rights reserved.</span>
          <span>Powered by Razorpay & Supabase</span>
        </div>
      </footer>
      
    </div>
  )
}