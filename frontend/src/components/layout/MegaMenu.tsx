import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface MegaMenuProps {
  department: 'men' | 'women' | 'kids';
  isOpen: boolean;
  onClose: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ department, isOpen, onClose }) => {
  if (!isOpen) return null;

  const departmentData = {
    men: {
      title: 'Men’s Collection',
      href: '/men',
      columns: [
        {
          title: 'Tailored Apparel',
          items: [
            { name: 'Shirts & Casuals', href: '/men?category=shirts' },
            { name: 'T-Shirts & Polos', href: '/men?category=t-shirts' },
            { name: 'Jackets & Blazers', href: '/men?category=jackets' },
            { name: 'Trousers & Chinos', href: '/men?category=trousers' },
            { name: 'Heritage Ethnic Wear', href: '/men?category=ethnic-wear' },
          ],
        },
        {
          title: 'Footwear & Accessories',
          items: [
            { name: 'Goodyear Loafers & Oxfords', href: '/men?category=shoes' },
            { name: 'Automatic Timepieces', href: '/men?category=watches' },
            { name: 'Leather Wallets & Bags', href: '/men?category=accessories' },
            { name: 'Silk Pocket Squares & Ties', href: '/men?category=accessories' },
          ],
        },
      ],
      featured: {
        title: 'The Sartorial Edit',
        subtitle: 'Double-breasted blazers & Italian linen for the discerning gentleman.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80',
        href: '/men',
      },
    },
    women: {
      title: 'Women’s Collection',
      href: '/women',
      columns: [
        {
          title: 'Haute Apparel',
          items: [
            { name: 'Dresses & Evening Gowns', href: '/women?category=dresses' },
            { name: 'Kashi Banarasi & Sarees', href: '/women?category=ethnic-wear' },
            { name: 'Silk Tops & Blouses', href: '/women?category=tops' },
            { name: 'Tailored Trousers & Skirts', href: '/women?category=bottoms' },
          ],
        },
        {
          title: 'Bags & High Jewellery',
          items: [
            { name: 'Handbags & Kelly Totes', href: '/women?category=handbags' },
            { name: 'Fine 18k Gold Jewellery', href: '/women?category=jewellery' },
            { name: 'Stiletto Heels & Mules', href: '/women?category=footwear' },
            { name: 'Luxury Diamond Watches', href: '/women?category=watches' },
          ],
        },
      ],
      featured: {
        title: 'Ethereal Silhouettes',
        subtitle: 'Mulberry silk gowns & pure Katan silks with real silver zari.',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
        href: '/women',
      },
    },
    kids: {
      title: 'Kids’ Collection',
      href: '/kids',
      columns: [
        {
          title: 'Children’s Wardrobe',
          items: [
            { name: 'Boys Formal & Casual Shirts', href: '/kids?category=boys-clothing' },
            { name: 'Girls Tiered Tulle Dresses', href: '/kids?category=girls-clothing' },
            { name: 'Organic Cotton Infant Wear', href: '/kids?category=baby-clothing' },
            { name: 'Festive Kurta & Bundi Sets', href: '/kids?category=kids-ethnic' },
          ],
        },
        {
          title: 'Footwear & Accessories',
          items: [
            { name: 'Comfort Leather Loafers', href: '/kids?category=kids-shoes' },
            { name: 'School Satchels & Bags', href: '/kids?category=kids-accessories' },
            { name: 'Lifestyle Toys & Accents', href: '/kids?category=kids-accessories' },
          ],
        },
      ],
      featured: {
        title: 'Young Tastemakers',
        subtitle: 'Pristine organic fabrics, festive wear and delightful comfort.',
        image: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=600&auto=format&fit=crop&q=80',
        href: '/kids',
      },
    },
  };

  const data = departmentData[department];

  return (
    <div
      className="absolute top-full left-0 w-full bg-velora-cream border-b border-velora-border shadow-2xl py-8 px-6 z-40 animate-in fade-in slide-in-from-top-2 duration-200"
      onMouseLeave={onClose}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {data.columns.map((col, idx) => (
          <div key={idx} className="space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-velora-black border-b border-velora-border pb-2">
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.items.map((item, i) => (
                <li key={i}>
                  <Link
                    to={item.href}
                    onClick={onClose}
                    className="text-sm text-neutral-600 hover:text-velora-black transition-colors block font-light"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Brand Spotlight */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-velora-black border-b border-velora-border pb-2">
            The VÉLORA Atelier
          </h4>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Curated from certified luxury artisan suppliers across India and Europe. Each garment is inspected for fabric density, weave accuracy, and stitching excellence.
          </p>
          <Link
            to={data.href}
            onClick={onClose}
            className="inline-flex items-center text-xs tracking-wider uppercase font-medium text-velora-champagne hover:text-velora-champagne-dark group"
          >
            <span>Explore All {data.title}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Featured Editorial Card */}
        <div className="relative group overflow-hidden border border-velora-border">
          <img
            src={data.featured.image}
            alt={data.featured.title}
            className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
            <span className="text-[10px] tracking-widest uppercase text-velora-champagne-light font-semibold">
              Curator’s Choice
            </span>
            <h5 className="font-serif text-base tracking-wide text-white font-normal mt-1">
              {data.featured.title}
            </h5>
            <p className="text-[11px] text-neutral-300 font-light line-clamp-2 mt-0.5">
              {data.featured.subtitle}
            </p>
            <Link
              to={data.featured.href}
              onClick={onClose}
              className="mt-2 text-[11px] tracking-widest uppercase font-medium text-white underline underline-offset-4 hover:text-velora-champagne-light"
            >
              Shop The Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
