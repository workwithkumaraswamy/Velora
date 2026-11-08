import React, { useState } from 'react';
import { Sparkles, Maximize2 } from 'lucide-react';
import { ProductImage } from '../../types';

interface ImageGalleryProps {
  images: ProductImage[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const fallback = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&auto=format&fit=crop&q=85';
  const currentImage = images[selectedIndex] || { url: fallback, isAiGenerated: false, styleTag: 'studio' };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto max-h-[580px] no-scrollbar">
          {images.map((img, index) => (
            <button
              key={img.id || index}
              onClick={() => setSelectedIndex(index)}
              className={`relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 border overflow-hidden transition-all ${
                selectedIndex === index
                  ? 'border-velora-black ring-1 ring-velora-black'
                  : 'border-velora-border hover:border-neutral-400 opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={`${title} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {img.isAiGenerated && (
                <span className="absolute bottom-0 right-0 bg-velora-black text-[8px] text-velora-champagne px-1">
                  AI
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Image Stage */}
      <div className="relative flex-1 aspect-[3/4] bg-velora-beige border border-velora-border overflow-hidden group">
        <img
          src={currentImage.url}
          alt={title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in group-hover:scale-105'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        />

        {/* AI Studio Label */}
        {currentImage.isAiGenerated && (
          <div className="absolute top-3 left-3 bg-velora-black/85 backdrop-blur-md text-white text-[10px] tracking-wider uppercase px-2.5 py-1 flex items-center space-x-1.5 border border-white/10">
            <Sparkles className="w-3 h-3 text-velora-champagne" />
            <span>AI Studio Visualization</span>
          </div>
        )}

        {/* Zoom Hint */}
        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-1.5 text-neutral-600 rounded-none pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <Maximize2 className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
