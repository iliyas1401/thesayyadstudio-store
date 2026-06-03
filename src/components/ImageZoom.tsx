import { useState, useRef } from "react";

interface ImageZoomProps {
  src: string;
  alt: string;
  zoomLevel?: number; // How much to magnify (e.g., 2.5 = 250%)
}

export function ImageZoom({ src, alt, zoomLevel = 2.5 }: ImageZoomProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imgRef.current) return;

    // Get the dimensions and position of the image container
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();

    // Calculate the mouse position as a percentage (0 to 100)
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
  };

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-gray-50 cursor-crosshair group w-full h-full aspect-[4/5]"
      onMouseEnter={() => setIsZooming(true)}
      onMouseLeave={() => setIsZooming(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Base Image */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isZooming ? "opacity-0" : "opacity-100"}`}
      />

      {/* Zoomed Overlay */}
      {isZooming && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            // THE FIX: Added strict quotation marks around the dynamic source
            backgroundImage: `url("${src}")`,
            backgroundPosition: `${position.x}% ${position.y}%`,
            backgroundSize: `${zoomLevel * 100}%`,
            backgroundRepeat: "no-repeat",
          }}
        />
      )}
    </div>
  );
}
