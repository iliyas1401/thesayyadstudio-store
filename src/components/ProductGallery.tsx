import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback if no images exist
  const safeImages = images && images.length > 0 ? images : ["https://via.placeholder.com/400x500?text=No+Image"];

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* MAIN CARD IMAGE */}
      <div 
        className="relative overflow-hidden rounded-xl bg-gray-50 aspect-[4/5] group cursor-zoom-in"
        onClick={() => setIsOpen(true)}
      >
        <img 
          src={safeImages[currentIndex]} 
          alt={`${alt} - View ${currentIndex + 1}`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
          <Maximize2 className="w-4 h-4 text-gray-700" />
        </div>
      </div>

      {/* THUMBNAILS (Only show if multiple images exist) */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`relative h-12 w-10 shrink-0 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                currentIndex === idx ? "border-black" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* FULL SCREEN LIGHTBOX MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
          
          {/* Close Button */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
            className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors cursor-pointer z-10 bg-black/50 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Previous Arrow */}
          {safeImages.length > 1 && (
            <button 
              onClick={prevImage}
              className="absolute left-4 sm:left-10 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer z-10"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Main Expanded Image */}
          <div className="relative w-full max-w-4xl max-h-[90vh] px-4 sm:px-16 flex items-center justify-center">
            <img 
              src={safeImages[currentIndex]} 
              alt={alt} 
              className="max-w-full max-h-[85vh] object-contain select-none"
            />
          </div>

          {/* Next Arrow */}
          {safeImages.length > 1 && (
            <button 
              onClick={nextImage}
              className="absolute right-4 sm:right-10 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all cursor-pointer z-10"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
          
          {/* Image Counter */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-xs font-bold tracking-widest uppercase bg-black/50 px-4 py-2 rounded-full">
              {currentIndex + 1} / {safeImages.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}