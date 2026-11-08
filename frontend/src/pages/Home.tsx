import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShieldCheck, Truck, RefreshCw, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product, Category } from '../types';
import { api } from '../services/api';
import { ProductCard } from '../components/product/ProductCard';
import { Button } from '../components/common/Button';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'trending' | 'new' | 'featured'>('trending');
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const heroSlides = [
    {
      title: 'Discover Your Style. Define Your Story.',
      subtitle: 'Explore thoughtfully curated fashion and everyday essentials for every generation.',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&auto=format&fit=crop&q=85',
      primaryBtn: { text: 'Shop Women', href: '/women' },
      secondaryBtn: { text: 'Shop Men', href: '/men' },
      tertiaryBtn: { text: 'Explore Kids', href: '/kids' },
    },
    {
      title: 'The Sartorial Autumn/Winter Edit.',
      subtitle: 'Merino wool double-breasted blazers, Goodyear-welted Oxfords & Italian flax linen.',
      image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1800&auto=format&fit=crop&q=85',
      primaryBtn: { text: 'Shop Men’s Tailoring', href: '/men' },
      secondaryBtn: { text: 'View Lookbook', href: '/men?isTrending=true' },
    },
    {
      title: 'Heirloom Silks & Ethereal Gowns.',
      subtitle: 'Pure Katan Banarasi weaves handcrafted over 45 days with silver-gilt zari.',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1800&auto=format&fit=crop&q=85',
      primaryBtn: { text: 'Explore Heritage Sarees', href: '/women?category=ethnic-wear' },
      secondaryBtn: { text: 'Shop Evening Gowns', href: '/women?category=dresses' },
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?limit=12'),
          api.get('/catalog/categories')
        ]);

        const allProds: Product[] = prodRes.data.data || [];
        setFeaturedProducts(allProds.filter(p => p.isFeatured));
        setTrendingProducts(allProds.filter(p => p.isTrending));
        setNewArrivals(allProds.filter(p => p.isNewArrival));
        setCategories(catRes.data.data || []);
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Automatic hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const activeProducts =
    activeTab === 'trending'
      ? trendingProducts
      : activeTab === 'new'
      ? newArrivals
      : featuredProducts;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative h-[85vh] min-h-[580px] w-full overflow-hidden bg-velora-black">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentHeroIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center filter brightness-[0.80]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />

            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="max-w-2xl space-y-6 text-white">
                  <span className="inline-flex items-center space-x-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-light bg-black/40 backdrop-blur-md px-3 py-1 border border-white/10">
                    <Sparkles className="w-3.5 h-3.5 text-velora-champagne" />
                    <span>VÉLORA Exclusive Atelier</span>
                  </span>

                  <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.08]">
                    {slide.title}
                  </h1>

                  <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-lg">
                    {slide.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link to={slide.primaryBtn.href}>
                      <Button variant="champagne" size="lg" className="tracking-widest">
                        {slide.primaryBtn.text}
                      </Button>
                    </Link>
                    {slide.secondaryBtn && (
                      <Link to={slide.secondaryBtn.href}>
                        <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-black tracking-widest">
                          {slide.secondaryBtn.text}
                        </Button>
                      </Link>
                    )}
                    {slide.tertiaryBtn && (
                      <Link to={slide.tertiaryBtn.href}>
                        <Button variant="ghost" size="lg" className="text-neutral-300 hover:text-white tracking-widest">
                          {slide.tertiaryBtn.text}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Hero Slider Controls */}
        <div className="absolute bottom-8 right-8 z-20 flex items-center space-x-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentHeroIndex(i)}
              className={`h-1.5 transition-all duration-300 ${
                currentHeroIndex === i ? 'w-8 bg-velora-champagne' : 'w-2 bg-white/40'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 2. THE THREE DEPARTMENTS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Men's Portal */}
          <Link
            to="/men"
            className="group relative h-96 overflow-hidden border border-velora-border bg-velora-beige block"
          >
            <img
              src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80"
              alt="Men's Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase tracking-widest text-velora-champagne-light font-semibold">
                Sartorial Excellence
              </span>
              <h3 className="font-serif text-2xl tracking-wide font-normal mt-1">
                Men’s Department
              </h3>
              <p className="text-xs text-neutral-300 font-light mt-1">
                Cashmere blazers, tailored trousers, Italian shirts & leather loafers.
              </p>
              <span className="mt-3 inline-flex items-center text-xs tracking-wider uppercase font-semibold text-white group-hover:text-velora-champagne transition-colors">
                <span>Shop Men</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Women's Portal */}
          <Link
            to="/women"
            className="group relative h-96 overflow-hidden border border-velora-border bg-velora-beige block"
          >
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80"
              alt="Women's Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase tracking-widest text-velora-champagne-light font-semibold">
                Haute Silhouettes
              </span>
              <h3 className="font-serif text-2xl tracking-wide font-normal mt-1">
                Women’s Department
              </h3>
              <p className="text-xs text-neutral-300 font-light mt-1">
                Mulberry silk gowns, Banarasi kadwa sarees, Kelly totes & fine jewellery.
              </p>
              <span className="mt-3 inline-flex items-center text-xs tracking-wider uppercase font-semibold text-white group-hover:text-velora-champagne transition-colors">
                <span>Shop Women</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          {/* Kids' Portal */}
          <Link
            to="/kids"
            className="group relative h-96 overflow-hidden border border-velora-border bg-velora-beige block"
          >
            <img
              src="https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80"
              alt="Kids' Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-[10px] uppercase tracking-widest text-velora-champagne-light font-semibold">
                Pristine Comfort
              </span>
              <h3 className="font-serif text-2xl tracking-wide font-normal mt-1">
                Kids’ Department
              </h3>
              <p className="text-xs text-neutral-300 font-light mt-1">
                Chanderi festive sets, organic cotton infant wear & ballerina dresses.
              </p>
              <span className="mt-3 inline-flex items-center text-xs tracking-wider uppercase font-semibold text-white group-hover:text-velora-champagne transition-colors">
                <span>Shop Kids</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. SHOP BY CURATED CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Curated Categories
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-velora-black font-normal">
            Refined Essentials For Every Occasion
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { name: 'Blazers & Jackets', img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80', href: '/men?category=jackets' },
            { name: 'Evening Gowns', img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=80', href: '/women?category=dresses' },
            { name: 'Banarasi Sarees', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80', href: '/women?category=ethnic-wear' },
            { name: 'Loafers & Oxfords', img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&auto=format&fit=crop&q=80', href: '/men?category=shoes' },
            { name: 'Kelly Totes & Bags', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=80', href: '/women?category=handbags' },
            { name: 'Kids Festive Sets', img: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=500&auto=format&fit=crop&q=80', href: '/kids?category=kids-ethnic' },
          ].map((cat, idx) => (
            <Link
              key={idx}
              to={cat.href}
              className="group text-center space-y-2 block"
            >
              <div className="aspect-square overflow-hidden bg-velora-beige border border-velora-border group-hover:border-velora-champagne transition-all">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h4 className="text-xs uppercase tracking-wider font-medium text-velora-black group-hover:text-velora-champagne-dark transition-colors">
                {cat.name}
              </h4>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. TRENDING COLLECTIONS TABS & GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-velora-border pb-4 mb-8 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
              Seasonal Highlights
            </span>
            <h2 className="font-serif text-3xl text-velora-black font-normal mt-0.5">
              Trending Collections
            </h2>
          </div>

          {/* Interactive Collection Filter Tabs */}
          <div className="flex items-center space-x-2 border border-velora-border p-1 bg-velora-ivory">
            <button
              onClick={() => setActiveTab('trending')}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest font-medium transition-colors ${
                activeTab === 'trending' ? 'bg-velora-black text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Trending Now
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest font-medium transition-colors ${
                activeTab === 'new' ? 'bg-velora-black text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              New Arrivals
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              className={`px-4 py-1.5 text-xs uppercase tracking-widest font-medium transition-colors ${
                activeTab === 'featured' ? 'bg-velora-black text-white' : 'text-neutral-600 hover:text-black'
              }`}
            >
              Premier Picks
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {activeProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/men">
            <Button variant="outline" size="lg" className="tracking-widest">
              View Complete Catalog
            </Button>
          </Link>
        </div>
      </section>

      {/* 5. EDITORIAL MID-BANNER PROMOTION */}
      <section className="bg-velora-beige py-20 border-y border-velora-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
              The Artisan Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl text-velora-black font-normal leading-tight">
              Masterpiece Weaves & Savile Craftsmanship
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 font-light leading-relaxed">
              Every garment in our dropshipping marketplace is backed by direct integration with accredited weaving ateliers and certified master cobblers. From real silver-gilt zari sarees to single-piece wholecut Goodyear leather Oxfords, experience luxury crafted without compromise.
            </p>
            <div className="flex items-center space-x-6 pt-2">
              <div>
                <span className="font-serif text-3xl text-velora-black block">100%</span>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500">Certified Silk & Wool</span>
              </div>
              <div className="h-8 w-px bg-velora-border" />
              <div>
                <span className="font-serif text-3xl text-velora-black block">3 Days</span>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500">Express India Dispatch</span>
              </div>
              <div className="h-8 w-px bg-velora-border" />
              <div>
                <span className="font-serif text-3xl text-velora-black block">7 Days</span>
                <span className="text-[11px] uppercase tracking-wider text-neutral-500">Concierge Doorstep Return</span>
              </div>
            </div>
            <div className="pt-2">
              <Link to="/women?category=ethnic-wear">
                <Button variant="primary" size="lg" className="tracking-widest">
                  Discover The Heritage Edit
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden border border-velora-border shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&auto=format&fit=crop&q=85"
              alt="Artisan weaving"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 6. PATRON TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-12">
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Patron Reviews
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-velora-black font-normal">
            Voices of Refinement
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: 'The Savile double-breasted blazer exceeded all expectations. The hand-finished lapel pick-stitching and drape is identical to bespoke garments from London.',
              author: 'Rohan Verma',
              location: 'Gurugram, India',
              item: 'Savile Double-Breasted Wool Blazer',
              rating: 5
            },
            {
              quote: 'Wore the Aurelia draped silk gown to an international gala in Dubai. The 22-momme pure Mulberry silk catches candlelight like liquid champagne.',
              author: 'Devika Rao',
              location: 'Mumbai, India',
              item: 'Aurelia Draped Mulberry Silk Gown',
              rating: 5
            },
            {
              quote: 'The Nawab embroidered Chanderi set for my 5-year-old was both breathtaking and itch-free. Organic cotton lining made sure he celebrated all evening with joy.',
              author: 'Priya Sundaram',
              location: 'Bengaluru, India',
              item: 'Nawab Embroidered Chanderi Kurta Set',
              rating: 5
            }
          ].map((testi, i) => (
            <div key={i} className="bg-white border border-velora-border p-8 flex flex-col justify-between space-y-4 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center space-x-1">
                  {Array.from({ length: testi.rating }).map((_, r) => (
                    <Star key={r} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="font-serif text-sm text-neutral-800 italic leading-relaxed">
                  "{testi.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-velora-border">
                <p className="text-xs font-semibold uppercase tracking-wider text-velora-black">
                  {testi.author}
                </p>
                <p className="text-[11px] text-neutral-400">{testi.location}</p>
                <p className="text-[10px] text-velora-champagne-dark font-medium mt-1 truncate">
                  Purchased: {testi.item}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
