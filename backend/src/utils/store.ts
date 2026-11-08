// VÉLORA Luxury In-Memory Data Store & Seed Engine
// Provides high-performance persistence and realistic fashion marketplace data

import bcrypt from 'bcryptjs';

export interface LuxuryStore {
  users: any[];
  departments: any[];
  categories: any[];
  brands: any[];
  products: any[];
  suppliers: any[];
  supplierOrders: any[];
  orders: any[];
  carts: any[];
  wishlists: any[];
  coupons: any[];
  reviews: any[];
  returnRequests: any[];
  supportTickets: any[];
  banners: any[];
  aiJobs: any[];
  productImportJobs: any[];
  auditLogs: any[];
}

const salt = bcrypt.genSaltSync(10);

export const store: LuxuryStore = {
  users: [
    {
      id: 'usr-admin-1',
      email: 'admin@velora.com',
      phone: '+919876543210',
      passwordHash: bcrypt.hashSync('VeloraAdmin2026!', salt),
      firstName: 'Aarav',
      lastName: 'Singhania',
      role: 'SUPER_ADMIN',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-mgr-men-1',
      email: 'men.manager@velora.com',
      phone: '+919876543211',
      passwordHash: bcrypt.hashSync('MenManager2026!', salt),
      firstName: 'Vikram',
      lastName: 'Mehta',
      role: 'MENS_MANAGER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-mgr-women-1',
      email: 'women.manager@velora.com',
      phone: '+919876543212',
      passwordHash: bcrypt.hashSync('WomenManager2026!', salt),
      firstName: 'Ananya',
      lastName: 'Kapoor',
      role: 'WOMENS_MANAGER',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-mgr-kids-1',
      email: 'kids.manager@velora.com',
      phone: '+919876543213',
      passwordHash: bcrypt.hashSync('KidsManager2026!', salt),
      firstName: 'Pooja',
      lastName: 'Sharma',
      role: 'KIDS_MANAGER',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr-cust-1',
      email: 'customer@velora.com',
      phone: '+919812345678',
      passwordHash: bcrypt.hashSync('Customer2026!', salt),
      firstName: 'Rohan',
      lastName: 'Verma',
      role: 'CUSTOMER',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
      isActive: true,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    }
  ],

  departments: [
    {
      id: 'dept-men',
      name: 'Men',
      slug: 'men',
      description: 'Sophisticated tailoring, timeless essentials and contemporary luxury for the modern gentleman.',
      heroBanner: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=1600&auto=format&fit=crop&q=85',
      heroSubtitle: 'The Autumn/Winter Heritage & Sartorial Collection',
      sortOrder: 1,
    },
    {
      id: 'dept-women',
      name: 'Women',
      slug: 'women',
      description: 'Ethereal silhouettes, modern couture, bespoke accessories and elevated everyday luxury.',
      heroBanner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85',
      heroSubtitle: 'Effortless Elegance & Haute Craftsmanship',
      sortOrder: 2,
    },
    {
      id: 'dept-kids',
      name: 'Kids',
      slug: 'kids',
      description: 'Charming festive ensembles, joyful comfort and premium organic wear for young tastemakers.',
      heroBanner: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1600&auto=format&fit=crop&q=85',
      heroSubtitle: 'Playful Comfort Meets Pristine Tailoring',
      sortOrder: 3,
    }
  ],

  categories: [
    // Men Categories
    { id: 'cat-m-shirts', departmentId: 'dept-men', name: 'Shirts', slug: 'shirts', imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80', sortOrder: 1 },
    { id: 'cat-m-tshirts', departmentId: 'dept-men', name: 'T-Shirts', slug: 't-shirts', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80', sortOrder: 2 },
    { id: 'cat-m-jackets', departmentId: 'dept-men', name: 'Jackets & Blazers', slug: 'jackets', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80', sortOrder: 3 },
    { id: 'cat-m-trousers', departmentId: 'dept-men', name: 'Trousers & Chinos', slug: 'trousers', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&auto=format&fit=crop&q=80', sortOrder: 4 },
    { id: 'cat-m-ethnic', departmentId: 'dept-men', name: 'Ethnic Wear', slug: 'ethnic-wear', imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&auto=format&fit=crop&q=80', sortOrder: 5 },
    { id: 'cat-m-shoes', departmentId: 'dept-men', name: 'Footwear & Loafers', slug: 'shoes', imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=80', sortOrder: 6 },
    { id: 'cat-m-watches', departmentId: 'dept-men', name: 'Timepieces', slug: 'watches', imageUrl: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80', sortOrder: 7 },
    { id: 'cat-m-accessories', departmentId: 'dept-men', name: 'Wallets & Bags', slug: 'accessories', imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80', sortOrder: 8 },

    // Women Categories
    { id: 'cat-w-dresses', departmentId: 'dept-women', name: 'Dresses & Gowns', slug: 'dresses', imageUrl: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80', sortOrder: 1 },
    { id: 'cat-w-ethnic', departmentId: 'dept-women', name: 'Ethnic & Sarees', slug: 'ethnic-wear', imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&auto=format&fit=crop&q=80', sortOrder: 2 },
    { id: 'cat-w-western', departmentId: 'dept-women', name: 'Tops & Blouses', slug: 'tops', imageUrl: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=600&auto=format&fit=crop&q=80', sortOrder: 3 },
    { id: 'cat-w-trousers', departmentId: 'dept-women', name: 'Trousers & Skirts', slug: 'bottoms', imageUrl: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=600&auto=format&fit=crop&q=80', sortOrder: 4 },
    { id: 'cat-w-handbags', departmentId: 'dept-women', name: 'Handbags & Totes', slug: 'handbags', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80', sortOrder: 5 },
    { id: 'cat-w-jewellery', departmentId: 'dept-women', name: 'Fine Jewellery', slug: 'jewellery', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80', sortOrder: 6 },
    { id: 'cat-w-footwear', departmentId: 'dept-women', name: 'Heels & Footwear', slug: 'footwear', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80', sortOrder: 7 },
    { id: 'cat-w-watches', departmentId: 'dept-women', name: 'Watches', slug: 'watches', imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80', sortOrder: 8 },

    // Kids Categories
    { id: 'cat-k-boys', departmentId: 'dept-kids', name: 'Boys Clothing', slug: 'boys-clothing', imageUrl: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80', sortOrder: 1 },
    { id: 'cat-k-girls', departmentId: 'dept-kids', name: 'Girls Dresses', slug: 'girls-clothing', imageUrl: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&auto=format&fit=crop&q=80', sortOrder: 2 },
    { id: 'cat-k-baby', departmentId: 'dept-kids', name: 'Baby & Infant', slug: 'baby-clothing', imageUrl: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&auto=format&fit=crop&q=80', sortOrder: 3 },
    { id: 'cat-k-ethnic', departmentId: 'dept-kids', name: 'Kids Ethnic', slug: 'kids-ethnic', imageUrl: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=600&auto=format&fit=crop&q=80', sortOrder: 4 },
    { id: 'cat-k-shoes', departmentId: 'dept-kids', name: 'Kids Footwear', slug: 'kids-shoes', imageUrl: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=600&auto=format&fit=crop&q=80', sortOrder: 5 },
    { id: 'cat-k-accessories', departmentId: 'dept-kids', name: 'Toys & Accessories', slug: 'kids-accessories', imageUrl: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=600&auto=format&fit=crop&q=80', sortOrder: 6 }
  ],

  brands: [
    { id: 'br-atelier', name: 'Atelier VÉLORA', slug: 'atelier-velora', logoUrl: '', description: 'Our premier in-house haute couture line.' },
    { id: 'br-aurora', name: 'Aurora Milano', slug: 'aurora-milano', logoUrl: '', description: 'Italian refined elegance and leathercraft.' },
    { id: 'br-bespoke', name: 'Bespoke Savile', slug: 'bespoke-savile', logoUrl: '', description: 'Timeless British tailoring and formalwear.' },
    { id: 'br-chola', name: 'Chola Royal Silks', slug: 'chola-royal-silks', logoUrl: '', description: 'Heritage Indian handloom and banarasi weave.' },
    { id: 'br-petit', name: 'Petit Luxe Paris', slug: 'petit-luxe-paris', logoUrl: '', description: 'Delicate Parisian fashion for infants and children.' },
    { id: 'br-chronos', name: 'Chronos Geneve', slug: 'chronos-geneve', logoUrl: '', description: 'Swiss precision automatic horology.' }
  ],

  suppliers: [
    {
      id: 'sup-1',
      name: 'Vogue Craft Logistics Ltd.',
      code: 'SUP-VOG-01',
      contactName: 'Rajesh Narang',
      contactEmail: 'fulfillment@voguecraft.in',
      contactPhone: '+919820011223',
      website: 'https://voguecraft.supplier.com',
      rating: 4.8,
      leadTimeDays: 2,
      isActive: true,
      notes: 'Premier Mumbai fulfillment warehouse. Fast-track dispatch within 24h.'
    },
    {
      id: 'sup-2',
      name: 'Artisan Loomworks Jaipur',
      code: 'SUP-JAI-02',
      contactName: 'Sanjay Meena',
      contactEmail: 'orders@artisanloom.com',
      contactPhone: '+919414055667',
      website: 'https://artisanloom.com',
      rating: 4.9,
      leadTimeDays: 3,
      isActive: true,
      notes: 'Specializes in pure Mulberry silk, Chanderi, and Block prints.'
    },
    {
      id: 'sup-3',
      name: 'Luxe Footwear Exports Agra',
      code: 'SUP-AGR-03',
      contactName: 'Karan Saxena',
      contactEmail: 'exports@luxefootwear.in',
      contactPhone: '+919927099881',
      website: 'https://luxefootwear.in',
      rating: 4.7,
      leadTimeDays: 3,
      isActive: true,
      notes: 'Full-grain Italian and vegetable-tanned leather shoes and belts.'
    }
  ],

  supplierOrders: [],

  products: [
    // 1. Men Sartorial Blazer
    {
      id: 'prod-m-1',
      title: 'Savile Double-Breasted Wool Blazer',
      slug: 'savile-double-breasted-wool-blazer',
      departmentId: 'dept-men',
      categoryId: 'cat-m-jackets',
      brandId: 'br-bespoke',
      supplierId: 'sup-1',
      shortDescription: 'Masterfully structured wool-cashmere double-breasted blazer with peaked lapels and horn buttons.',
      description: 'Crafted from an exquisite 280g superfine merino wool and Mongolian cashmere blend, this double-breasted blazer embodies refined elegance. Featuring hand-sewn canvassing, Milanese lapel buttonhole, dual vents, and natural horn buttons. Designed to drape with structured grace across formal and cocktail occasions.',
      highlights: [
        '90% Super 130s Merino Wool, 10% Cashmere',
        'Half-canvas construction for natural chest drape',
        'Hand-finished pick-stitching along peaked lapels',
        'Four interior pockets including passport slot'
      ],
      specifications: {
        'Fit': 'Tailored Slim Fit',
        'Pattern': 'Subtle Herringbone',
        'Lining': '100% Bemberg Cupro',
        'Care': 'Specialist Dry Clean Only',
        'Country of Origin': 'India (Crafted with imported yarns)'
      },
      careInstructions: 'Dry clean only with hydrocarbon solvent. Steam lightly at low temperatures.',
      basePrice: 8999,
      mrp: 14999,
      costPrice: 4200,
      discountPercentage: 40,
      isFeatured: true,
      isTrending: true,
      isNewArrival: true,
      isPublished: true,
      totalStock: 35,
      averageRating: 4.9,
      reviewCount: 42,
      createdAt: new Date().toISOString(),
      images: [
        { id: 'img-m1-1', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=85', isPrimary: true, sortOrder: 1, styleTag: 'editorial' },
        { id: 'img-m1-2', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1000&auto=format&fit=crop&q=85', isPrimary: false, sortOrder: 2, styleTag: 'studio' },
        { id: 'img-m1-3', url: 'https://images.unsplash.com/photo-1598808503746-f34c53b9323e?w=1000&auto=format&fit=crop&q=85', isPrimary: false, sortOrder: 3, styleTag: 'close-up' }
      ],
      variants: [
        { id: 'var-m1-38', size: '38 (S)', color: 'Midnight Navy', colorHex: '#1B2430', sku: 'VEL-BLZ-NVY-38', stock: 8, isActive: true },
        { id: 'var-m1-40', size: '40 (M)', color: 'Midnight Navy', colorHex: '#1B2430', sku: 'VEL-BLZ-NVY-40', stock: 12, isActive: true },
        { id: 'var-m1-42', size: '42 (L)', color: 'Midnight Navy', colorHex: '#1B2430', sku: 'VEL-BLZ-NVY-42', stock: 10, isActive: true },
        { id: 'var-m1-44', size: '44 (XL)', color: 'Midnight Navy', colorHex: '#1B2430', sku: 'VEL-BLZ-NVY-44', stock: 5, isActive: true },
      ]
    },

    // 2. Men Linen Shirt
    {
      id: 'prod-m-2',
      title: 'Riviera Pure Italian Linen Shirt',
      slug: 'riviera-pure-italian-linen-shirt',
      departmentId: 'dept-men',
      categoryId: 'cat-m-shirts',
      brandId: 'br-aurora',
      supplierId: 'sup-1',
      shortDescription: 'Breezy luxury shirt woven from Normandy flax linen with genuine mother-of-pearl buttons.',
      description: 'The definitive resort shirt, cut from artisanal French flax linen pre-washed for velvety softness. Featuring a contemporary spread collar that stays crisp under a blazer or relaxed unbuttoned by the Mediterranean coastline. Finished with reinforced French seams.',
      highlights: [
        '100% Certified European Flax Linen (145 GSM)',
        'Genuine Australian mother-of-pearl buttons',
        'Spread collar with removable brass stays',
        'Pre-shrunk enzyme wash for zero shrinkage'
      ],
      specifications: {
        'Fit': 'Modern Relaxed',
        'Collar': 'Spread Collar',
        'Sleeve': 'Long Sleeve with Mitred Cuff',
        'Fabric': '100% Pure Linen'
      },
      careInstructions: 'Machine wash cool on delicate cycle. Hang dry in shade. Warm iron while slightly damp.',
      basePrice: 3299,
      mrp: 4999,
      costPrice: 1350,
      discountPercentage: 34,
      isFeatured: true,
      isTrending: true,
      isNewArrival: false,
      isPublished: true,
      totalStock: 50,
      averageRating: 4.8,
      reviewCount: 68,
      createdAt: new Date().toISOString(),
      images: [
        { id: 'img-m2-1', url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1000&auto=format&fit=crop&q=85', isPrimary: true, sortOrder: 1, styleTag: 'studio' },
        { id: 'img-m2-2', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1000&auto=format&fit=crop&q=85', isPrimary: false, sortOrder: 2, styleTag: 'lifestyle' }
      ],
      variants: [
        { id: 'var-m2-s', size: 'S', color: 'Ivory White', colorHex: '#FBF9F5', sku: 'VEL-LIN-WHT-S', stock: 15, isActive: true },
        { id: 'var-m2-m', size: 'M', color: 'Ivory White', colorHex: '#FBF9F5', sku: 'VEL-LIN-WHT-M', stock: 18, isActive: true },
        { id: 'var-m2-l', size: 'L', color: 'Ivory White', colorHex: '#FBF9F5', sku: 'VEL-LIN-WHT-L', stock: 12, isActive: true },
        { id: 'var-m2-xl', size: 'XL', color: 'Ivory White', colorHex: '#FBF9F5', sku: 'VEL-LIN-WHT-XL', stock: 5, isActive: true },
      ]
    },

    // 3. Men Handmade Oxford Shoes
    {
      id: 'prod-m-3',
      title: 'Artisan Wholecut Leather Oxford Shoes',
      slug: 'artisan-wholecut-leather-oxford-shoes',
      departmentId: 'dept-men',
      categoryId: 'cat-m-shoes',
      brandId: 'br-bespoke',
      supplierId: 'sup-3',
      shortDescription: 'Goodyear-welted wholecut dress shoes hand-patinated in deep cognac calfskin.',
      description: 'Crafted from a single flawless piece of vegetable-tanned French box calf leather, these wholecut Oxfords represent the pinnacle of shoemaking. Fitted with traditional Goodyear welting for lifetime resolability, channeled leather soles, and a hand-burnished antique cognac patina.',
      highlights: [
        'Single-piece wholecut construction with zero side seams',
        'Goodyear-welted leather sole with cork filler',
        'Full calfskin glove leather lining for breathable comfort',
        'Hand-patinated antique finish'
      ],
      specifications: {
        'Upper': 'Full-Grain French Calfskin',
        'Sole': 'Oak-Bark Tanned Leather',
        'Last': 'Chiseled Classic Almond Toe',
        'Origin': 'Agra, India'
      },
      careInstructions: 'Condition with Saphir cream polish and keep in cedar shoe trees when not worn.',
      basePrice: 7499,
      mrp: 12999,
      costPrice: 3200,
      discountPercentage: 42,
      isFeatured: true,
      isTrending: false,
      isNewArrival: true,
      isPublished: true,
      totalStock: 28,
      averageRating: 4.9,
      reviewCount: 31,
      createdAt: new Date().toISOString(),
      images: [
        { id: 'img-m3-1', url: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=1000&auto=format&fit=crop&q=85', isPrimary: true, sortOrder: 1, styleTag: 'studio' },
        { id: 'img-m3-2', url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=1000&auto=format&fit=crop&q=85', isPrimary: false, sortOrder: 2, styleTag: 'detail' }
      ],
      variants: [
        { id: 'var-m3-7', size: 'UK 7', color: 'Cognac Brown', colorHex: '#7C3F1D', sku: 'VEL-OXF-CGN-07', stock: 6, isActive: true },
        { id: 'var-m3-8', size: 'UK 8', color: 'Cognac Brown', colorHex: '#7C3F1D', sku: 'VEL-OXF-CGN-08', stock: 10, isActive: true },
        { id: 'var-m3-9', size: 'UK 9', color: 'Cognac Brown', colorHex: '#7C3F1D', sku: 'VEL-OXF-CGN-09', stock: 8, isActive: true },
        { id: 'var-m3-10', size: 'UK 10', color: 'Cognac Brown', colorHex: '#7C3F1D', sku: 'VEL-OXF-CGN-10', stock: 4, isActive: true },
      ]
    },

    // 4. Women Silk Evening Gown
    {
      id: 'prod-w-1',
      title: 'Aurelia Draped Mulberry Silk Gown',
      slug: 'aurelia-draped-mulberry-silk-gown',
      departmentId: 'dept-women',
      categoryId: 'cat-w-dresses',
      brandId: 'br-atelier',
      supplierId: 'sup-1',
      shortDescription: 'Fluid bias-cut evening gown fashioned from heavy 22-momme pure Mulberry silk in champagne gold.',
      description: 'An architectural tribute to Hollywood golden-age glamour. Cut on the bias to cascade effortlessly over the feminine contour, the Aurelia gown boasts a delicate cowl neckline, an open back adorned with fine silk rouleau ties, and a floor-sweeping gentle puddle train.',
      highlights: [
        '100% Grade 6A Pure Mulberry Silk (22 Momme)',
        'Dramatic low back with adjustable delicate ties',
        'Expert bias cut for body-contouring fluid movement',
        'Invisible side zip closure'
      ],
      specifications: {
        'Silhouette': 'Column Gown with Sweep Train',
        'Length': 'Maxi (155 cm from shoulder)',
        'Lining': 'Self-fabric double lined bust',
        'Occasion': 'Black Tie, Gala, Red Carpet'
      },
      careInstructions: 'Professional green dry clean only. Store in breathable cotton garment bag.',
      basePrice: 12499,
      mrp: 19999,
      costPrice: 5200,
      discountPercentage: 38,
      isFeatured: true,
      isTrending: true,
      isNewArrival: true,
      isPublished: true,
      totalStock: 22,
      averageRating: 5.0,
      reviewCount: 54,
      createdAt: new Date().toISOString(),
      images: [
        { id: 'img-w1-1', url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&auto=format&fit=crop&q=85', isPrimary: true, sortOrder: 1, styleTag: 'editorial' },
        { id: 'img-w1-2', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&auto=format&fit=crop&q=85', isPrimary: false, sortOrder: 2, styleTag: 'lifestyle' }
      ],
      variants: [
        { id: 'var-w1-xs', size: 'XS', color: 'Champagne Gold', colorHex: '#D4AF37', sku: 'VEL-GWN-GLD-XS', stock: 4, isActive: true },
        { id: 'var-w1-s', size: 'S', color: 'Champagne Gold', colorHex: '#D4AF37', sku: 'VEL-GWN-GLD-S', stock: 8, isActive: true },
        { id: 'var-w1-m', size: 'M', color: 'Champagne Gold', colorHex: '#D4AF37', sku: 'VEL-GWN-GLD-M', stock: 7, isActive: true },
        { id: 'var-w1-l', size: 'L', color: 'Champagne Gold', colorHex: '#D4AF37', sku: 'VEL-GWN-GLD-L', stock: 3, isActive: true },
      ]
    },

    // 5. Women Heritage Banarasi Saree
    {
      id: 'prod-w-2',
      title: 'Kashi Katan Silk Banarasi Saree',
      slug: 'kashi-katan-silk-banarasi-saree',
      departmentId: 'dept-women',
      categoryId: 'cat-w-ethnic',
      brandId: 'br-chola',
      supplierId: 'sup-2',
      shortDescription: 'Heirloom handwoven pure Katan silk saree with real silver zari floral jaal and meenakari borders.',
      description: 'Handcrafted over 45 painstaking days by national-award-winning weavers of Varanasi. Woven on traditional pit looms using certified Katan silk warps and wefts, richly interlaced with antique gold and silver zari in an imperial floral kadwa jaal pattern. Accompanied by silk-mark certification.',
      highlights: [
        'Certified 100% Pure Handwoven Katan Silk',
        'Intricate Kadwa Meenakari hand-loom technique',
        'Includes unstitched designer blouse piece (85 cm)',
        'Govt of India Silk Mark & Handloom Mark Certified'
      ],
      specifications: {
        'Saree Length': '5.5 meters',
        'Blouse Piece': '0.85 meters',
        'Zari Quality': 'Tested Silver-Gilt Zari',
        'Weave': 'Kadwa Weft Brocade'
      },
      careInstructions: 'Store in pure muslin cloth. Do not spray perfumes directly on zari. Dry clean only.',
      basePrice: 18999,
      mrp: 29999,
      costPrice: 9500,
      discountPercentage: 36,
      isFeatured: true,
      isTrending: true,
      isNewArrival: false,
      isPublished: true,
      totalStock: 15,
      averageRating: 4.9,
      reviewCount: 39,
      createdAt: new Date().toISOString(),
      images: [
        { id: 'img-w2-1', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1000&auto=format&fit=crop&q=85', isPrimary: true, sortOrder: 1, styleTag: 'studio' },
        { id: 'img-w2-2', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1000&auto=format&fit=crop&q=85', isPrimary: false, sortOrder: 2, styleTag: 'close-up' }
      ],
      variants: [
        { id: 'var-w2-free', size: 'Free Size', color: 'Royal Crimson', colorHex: '#800020', sku: 'VEL-SAR-CRM-FS', stock: 15, isActive: true }
      ]
    },

    // 6. Women Leather Handbag
    {
      id: 'prod-w-3',
      title: 'Palermo Structured Leather Kelly Tote',
      slug: 'palermo-structured-leather-kelly-tote',
      departmentId: 'dept-women',
      categoryId: 'cat-w-handbags',
      brandId: 'br-aurora',
      supplierId: 'sup-1',
      shortDescription: 'Handcrafted grained calfskin tote with signature gold-plated turn-lock and detachable crossbody strap.',
      description: 'Hand-assembled in Florence using full-grain Tuscan calfskin leather resistant to scratches and watermarks. Featuring protective metal base studs, two interior zip compartments, and plush micro-suede lining. Designed to transition seamlessly from board meetings to weekend soirées.',
      highlights: [
        '100% Full-Grain Italian Grained Calfskin',
        '24k Champagne gold-electroplated hardware',
        'Includes removable adjustable leather shoulder strap',
        'Protective dust bag and certificate of authenticity'
      ],
      specifications: {
        'Dimensions': '28 cm (W) x 21 cm (H) x 12 cm (D)',
        'Strap Drop': '54 cm (Adjustable)',
        'Weight': '720 grams'
      },
      careInstructions: 'Clean with soft dry microfiber cloth. Condition with neutral leather balm annually.',
      basePrice: 9499,
      mrp: 15999,
      costPrice: 4100,
      discountPercentage: 40,
      isFeatured: true,
      isTrending: false,
      isNewArrival: true,
      isPublished: true,
      totalStock: 25,
      averageRating: 4.9,
      reviewCount: 47,
      createdAt: new Date().toISOString(),
      images: [
        { id: 'img-w3-1', url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1000&auto=format&fit=crop&q=85', isPrimary: true, sortOrder: 1, styleTag: 'studio' },
        { id: 'img-w3-2', url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&auto=format&fit=crop&q=85', isPrimary: false, sortOrder: 2, styleTag: 'lifestyle' }
      ],
      variants: [
        { id: 'var-w3-noir', size: 'Standard', color: 'Midnight Noir', colorHex: '#141414', sku: 'VEL-BAG-NOIR-01', stock: 15, isActive: true },
        { id: 'var-w3-tan', size: 'Standard', color: 'Tuscan Caramel', colorHex: '#C68B59', sku: 'VEL-BAG-TAN-01', stock: 10, isActive: true }
      ]
    },

    // 7. Kids Boys Festive Kurta Set
    {
      id: 'prod-k-1',
      title: 'Nawab Embroidered Chanderi Kurta Set',
      slug: 'nawab-embroidered-chanderi-kurta-set',
      departmentId: 'dept-kids',
      categoryId: 'cat-k-ethnic',
      brandId: 'br-chola',
      supplierId: 'sup-2',
      shortDescription: 'Regal 3-piece festive ensemble featuring a silk-blend embroidered kurta, tailored bundi jacket and churidar.',
      description: 'Dressed for the grandest festivities. Crafted from ultra-soft Chanderi silk with 100% breathable organic cotton voile lining to protect sensitive young skin. Adorned with delicate Resham embroidery and heritage metal coin buttons.',
      highlights: [
        'Breathable Chanderi Silk with 100% Organic Cotton Lining',
        'Includes Kurta, Embellished Nehru Jacket, and Churidar',
        'Hypoallergenic dyes and itch-free internal seams',
        'Gentle elasticated waist for snug comfort'
      ],
      specifications: {
        'Set of': '3 Pieces (Kurta, Jacket, Pants)',
        'Fabric': 'Silk Blend with Cotton Voile Lining',
        'Occasion': 'Diwali, Weddings, Family Celebrations'
      },
      careInstructions: 'Gentle dry clean only.',
      basePrice: 3499,
      mrp: 5499,
      costPrice: 1400,
      discountPercentage: 36,
      isFeatured: true,
      isTrending: true,
      isNewArrival: true,
      isPublished: true,
      totalStock: 40,
      averageRating: 4.8,
      reviewCount: 29,
      createdAt: new Date().toISOString(),
      images: [
        { id: 'img-k1-1', url: 'https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=1000&auto=format&fit=crop&q=85', isPrimary: true, sortOrder: 1, styleTag: 'studio' },
        { id: 'img-k1-2', url: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1000&auto=format&fit=crop&q=85', isPrimary: false, sortOrder: 2, styleTag: 'lifestyle' }
      ],
      variants: [
        { id: 'var-k1-3y', size: '3-4 Yrs', color: 'Ivory & Gold', colorHex: '#FDFBF7', sku: 'VEL-KID-SET-03Y', stock: 10, isActive: true },
        { id: 'var-k1-5y', size: '5-6 Yrs', color: 'Ivory & Gold', colorHex: '#FDFBF7', sku: 'VEL-KID-SET-05Y', stock: 12, isActive: true },
        { id: 'var-k1-7y', size: '7-8 Yrs', color: 'Ivory & Gold', colorHex: '#FDFBF7', sku: 'VEL-KID-SET-07Y', stock: 10, isActive: true },
        { id: 'var-k1-9y', size: '9-10 Yrs', color: 'Ivory & Gold', colorHex: '#FDFBF7', sku: 'VEL-KID-SET-09Y', stock: 8, isActive: true },
      ]
    },

    // 8. Kids Girls Tulle Ballerina Dress
    {
      id: 'prod-k-2',
      title: 'Fleur Tiered French Tulle Princess Dress',
      slug: 'fleur-tiered-french-tulle-princess-dress',
      departmentId: 'dept-kids',
      categoryId: 'cat-k-girls',
      brandId: 'br-petit',
      supplierId: 'sup-1',
      shortDescription: 'Enchanting tiered French tulle dress with hand-appliqued organza blossoms and satin ribbon sash.',
      description: 'Fit for a royal birthday or flower girl celebration. Layered with seven tiers of feather-light French point d\'esprit tulle over smooth breathable mulberry silk-cotton slip. Hand-stitched with 3D floral petals and crowned with a plush velvet bow.',
      highlights: [
        'Seven tiers of super-soft, scratch-free French tulle',
        '100% skin-safe organic cotton lining against child skin',
        'Handcrafted 3D silk organza petal accents',
        'Discreet concealed YKK back zipper'
      ],
      specifications: {
        'Closure': 'Concealed Zipper',
        'Length': 'Tea Length',
        'Design': 'Tiered Ballerina Silhouette'
      },
      careInstructions: 'Hand wash cool with mild baby shampoo. Hang dry.',
      basePrice: 2999,
      mrp: 4999,
      costPrice: 1200,
      discountPercentage: 40,
      isFeatured: true,
      isTrending: false,
      isNewArrival: true,
      isPublished: true,
      totalStock: 30,
      averageRating: 4.9,
      reviewCount: 38,
      createdAt: new Date().toISOString(),
      images: [
        { id: 'img-k2-1', url: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=1000&auto=format&fit=crop&q=85', isPrimary: true, sortOrder: 1, styleTag: 'studio' },
        { id: 'img-k2-2', url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=1000&auto=format&fit=crop&q=85', isPrimary: false, sortOrder: 2, styleTag: 'lifestyle' }
      ],
      variants: [
        { id: 'var-k2-3y', size: '3-4 Yrs', color: 'Dusty Rose', colorHex: '#D8A47F', sku: 'VEL-KID-DRS-03Y', stock: 8, isActive: true },
        { id: 'var-k2-5y', size: '5-6 Yrs', color: 'Dusty Rose', colorHex: '#D8A47F', sku: 'VEL-KID-DRS-05Y', stock: 10, isActive: true },
        { id: 'var-k2-7y', size: '7-8 Yrs', color: 'Dusty Rose', colorHex: '#D8A47F', sku: 'VEL-KID-DRS-07Y', stock: 8, isActive: true },
        { id: 'var-k2-9y', size: '9-10 Yrs', color: 'Dusty Rose', colorHex: '#D8A47F', sku: 'VEL-KID-DRS-09Y', stock: 4, isActive: true },
      ]
    }
  ],

  orders: [
    {
      id: 'ord-vel-1001',
      orderNumber: 'VEL-2026-89412',
      userId: 'usr-cust-1',
      user: {
        firstName: 'Rohan',
        lastName: 'Verma',
        email: 'customer@velora.com',
        phone: '+919812345678'
      },
      status: 'CONFIRMED',
      paymentStatus: 'SUCCESS',
      paymentMethod: 'RAZORPAY',
      subtotal: 8999,
      discountAmount: 899.9,
      shippingFee: 0,
      taxAmount: 0,
      totalAmount: 8099.1,
      shippingAddressSnapshot: {
        fullName: 'Rohan Verma',
        phone: '+919812345678',
        houseNumber: 'Villa 14',
        street: 'Magnolia Boulevard',
        area: 'Golf Course Road, DLF Phase 5',
        city: 'Gurugram',
        state: 'Haryana',
        pincode: '122002',
        landmark: 'Near DLF Horizon Club',
        addressType: 'Home',
        isDefault: true
      },
      items: [
        {
          id: 'item-1',
          productId: 'prod-m-1',
          title: 'Savile Double-Breasted Wool Blazer',
          brandName: 'Bespoke Savile',
          imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=85',
          size: '40 (M)',
          color: 'Midnight Navy',
          quantity: 1,
          unitPrice: 8999,
          subtotal: 8999,
          supplierStatus: 'CONFIRMED'
        }
      ],
      placedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      shipment: {
        courierName: 'BlueDart Express',
        trackingNumber: 'BD982736412IN',
        trackingUrl: 'https://www.bluedart.com/tracking?track=BD982736412IN',
        status: 'MANIFESTED',
        estimatedDelivery: new Date(Date.now() + 86400000 * 3).toISOString()
      }
    }
  ],

  carts: [],
  wishlists: [],

  coupons: [
    {
      id: 'cp-welcome10',
      code: 'WELCOME10',
      description: 'Enjoy 10% off on your first luxury order above ₹1,999.',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      maxDiscount: 1500,
      minOrderValue: 1999,
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 86400000 * 60).toISOString(),
      isActive: true,
      timesUsed: 142
    },
    {
      id: 'cp-men20',
      code: 'MEN20',
      description: 'Exclusive 20% discount on Men\'s formalwear and blazers.',
      discountType: 'PERCENTAGE',
      discountValue: 20,
      maxDiscount: 2500,
      minOrderValue: 4999,
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 86400000 * 30).toISOString(),
      isActive: true,
      departmentId: 'dept-men',
      timesUsed: 89
    },
    {
      id: 'cp-velora500',
      code: 'VELORA500',
      description: 'Flat ₹500 off on any purchase above ₹2,999.',
      discountType: 'FIXED_AMOUNT',
      discountValue: 500,
      minOrderValue: 2999,
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 86400000 * 90).toISOString(),
      isActive: true,
      timesUsed: 215
    }
  ],

  reviews: [
    {
      id: 'rev-1',
      productId: 'prod-m-1',
      userId: 'usr-cust-1',
      user: { firstName: 'Rohan', lastName: 'Verma' },
      rating: 5,
      title: 'Remarkable tailoring comparable to Savile Row',
      comment: 'The drape and hand-feel of this blazer is peerless. Horn buttons and pick-stitching show exquisite attention to detail. Arrived in a luxury suit carrier within 3 days.',
      isVerifiedPurchase: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 'rev-2',
      productId: 'prod-w-1',
      userId: 'usr-cust-1',
      user: { firstName: 'Devika', lastName: 'Rao' },
      rating: 5,
      title: 'Breathtaking drape and pure heavy silk',
      comment: 'Wore this for an international awards banquet. The bias cut moves like liquid champagne. Endless compliments all evening.',
      isVerifiedPurchase: true,
      createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
    }
  ],

  returnRequests: [],

  supportTickets: [
    {
      id: 'tck-101',
      ticketNumber: 'TCK-84920',
      userId: 'usr-cust-1',
      orderId: 'ord-vel-1001',
      subject: 'Inquiry on Suit Carrier and Garment Care',
      department: 'Orders',
      priority: 'LOW',
      status: 'RESOLVED',
      messages: [
        {
          id: 'msg-1',
          sender: 'user',
          senderName: 'Rohan Verma',
          text: 'Does the Savile blazer arrive in a breathable travel garment bag?',
          sentAt: new Date(Date.now() - 3600000 * 20).toISOString()
        },
        {
          id: 'msg-2',
          sender: 'agent',
          senderName: 'VÉLORA Concierge',
          text: 'Hello Mr. Verma. Yes! All VÉLORA tailored blazers and gowns arrive accompanied by our custom embroidered breathable canvas garment bag and cedar-finished hanger.',
          sentAt: new Date(Date.now() - 3600000 * 18).toISOString()
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      updatedAt: new Date(Date.now() - 3600000 * 18).toISOString()
    }
  ],

  banners: [
    {
      id: 'ban-1',
      title: 'Discover Your Style. Define Your Story.',
      subtitle: 'The VÉLORA Autumn/Winter 2026 Sartorial Curation.',
      targetUrl: '/men',
      imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=85',
      placement: 'HERO',
      department: 'all',
      isActive: true,
      sortOrder: 1
    },
    {
      id: 'ban-2',
      title: 'Pure Silk & Heritage Banarasi Weaves',
      subtitle: 'Intricately handcrafted by master weavers of Varanasi.',
      targetUrl: '/women',
      imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&auto=format&fit=crop&q=85',
      placement: 'MID_BANNER',
      department: 'women',
      isActive: true,
      sortOrder: 2
    }
  ],

  aiJobs: [],
  productImportJobs: [],
  auditLogs: []
};
