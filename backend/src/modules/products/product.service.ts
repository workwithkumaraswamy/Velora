import { store } from '../../utils/store';

export interface ProductFilterQuery {
  department?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  minRating?: number;
  minDiscount?: number;
  inStock?: boolean;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
}

export class ProductService {
  static async getProducts(query: ProductFilterQuery) {
    let list = [...store.products];

    // Department filter
    if (query.department) {
      const deptSlug = query.department.toLowerCase();
      const dept = store.departments.find(d => d.slug === deptSlug);
      if (dept) {
        list = list.filter(p => p.departmentId === dept.id);
      }
    }

    // Category filter
    if (query.category) {
      const catSlug = query.category.toLowerCase();
      const cat = store.categories.find(c => c.slug === catSlug || c.id === query.category);
      if (cat) {
        list = list.filter(p => p.categoryId === cat.id);
      }
    }

    // Brand filter
    if (query.brand) {
      const brandSlug = query.brand.toLowerCase();
      const brand = store.brands.find(b => b.slug === brandSlug || b.name.toLowerCase() === brandSlug);
      if (brand) {
        list = list.filter(p => p.brandId === brand.id);
      }
    }

    // Price range
    if (query.minPrice !== undefined) {
      list = list.filter(p => p.basePrice >= Number(query.minPrice));
    }
    if (query.maxPrice !== undefined) {
      list = list.filter(p => p.basePrice <= Number(query.maxPrice));
    }

    // Size filter
    if (query.size) {
      const targetSizes = query.size.split(',').map(s => s.trim().toLowerCase());
      list = list.filter(p => 
        p.variants?.some((v: any) => targetSizes.some(ts => v.size.toLowerCase().includes(ts)) && v.stock > 0)
      );
    }

    // Color filter
    if (query.color) {
      const targetColors = query.color.split(',').map(c => c.trim().toLowerCase());
      list = list.filter(p => 
        p.variants?.some((v: any) => targetColors.some(tc => v.color.toLowerCase().includes(tc)))
      );
    }

    // Minimum Rating
    if (query.minRating !== undefined) {
      list = list.filter(p => p.averageRating >= Number(query.minRating));
    }

    // Minimum Discount
    if (query.minDiscount !== undefined) {
      list = list.filter(p => p.discountPercentage >= Number(query.minDiscount));
    }

    // In Stock
    if (query.inStock === true || String(query.inStock) === 'true') {
      list = list.filter(p => p.totalStock > 0);
    }

    // Flags
    if (query.isFeatured) list = list.filter(p => p.isFeatured);
    if (query.isTrending) list = list.filter(p => p.isTrending);
    if (query.isNewArrival) list = list.filter(p => p.isNewArrival);

    // Search query
    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      list = list.filter(p => {
        const titleMatch = p.title.toLowerCase().includes(q);
        const descMatch = (p.description || '').toLowerCase().includes(q);
        const brandMatch = store.brands.find(b => b.id === p.brandId)?.name.toLowerCase().includes(q);
        const catMatch = store.categories.find(c => c.id === p.categoryId)?.name.toLowerCase().includes(q);
        return titleMatch || descMatch || brandMatch || catMatch;
      });
    }

    // Sorting
    switch (query.sort) {
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-low':
        list.sort((a, b) => a.basePrice - b.basePrice);
        break;
      case 'price-high':
        list.sort((a, b) => b.basePrice - a.basePrice);
        break;
      case 'best-seller':
      case 'trending':
        list.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0) || b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        list.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'discount':
        list.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
      case 'recommended':
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.averageRating - a.averageRating);
        break;
    }

    const total = list.length;
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 12);
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    // Hydrate relations
    const enriched = paginated.map(p => this.hydrateProduct(p));

    return {
      products: enriched,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  static async getProductBySlugOrId(identifier: string) {
    const product = store.products.find(
      p => p.slug === identifier || p.id === identifier
    );
    if (!product) throw new Error('Product not found');
    return this.hydrateProduct(product);
  }

  static async createProduct(data: any) {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const id = `prod-${Date.now()}`;

    // calculate total stock from variants
    const totalStock = (data.variants || []).reduce((acc: number, v: any) => acc + (Number(v.stock) || 0), 0);
    const discountPercentage = data.mrp && data.basePrice 
      ? Math.round(((data.mrp - data.basePrice) / data.mrp) * 100) 
      : 0;

    const newProduct = {
      id,
      title: data.title,
      slug: `${slug}-${Math.floor(1000 + Math.random() * 9000)}`,
      departmentId: data.departmentId,
      categoryId: data.categoryId,
      brandId: data.brandId || null,
      supplierId: data.supplierId || null,
      shortDescription: data.shortDescription || '',
      description: data.description || '',
      highlights: data.highlights || [],
      specifications: data.specifications || {},
      careInstructions: data.careInstructions || '',
      basePrice: Number(data.basePrice),
      mrp: Number(data.mrp || data.basePrice),
      costPrice: data.costPrice ? Number(data.costPrice) : null,
      discountPercentage,
      isFeatured: Boolean(data.isFeatured),
      isTrending: Boolean(data.isTrending),
      isNewArrival: Boolean(data.isNewArrival ?? true),
      isPublished: Boolean(data.isPublished ?? true),
      totalStock,
      averageRating: 0.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      images: (data.images || []).map((img: any, i: number) => ({
        id: `img-${Date.now()}-${i}`,
        url: typeof img === 'string' ? img : img.url,
        isPrimary: i === 0,
        sortOrder: i + 1,
        styleTag: img.styleTag || 'studio',
        isAiGenerated: Boolean(img.isAiGenerated)
      })),
      variants: (data.variants || []).map((v: any, i: number) => ({
        id: `var-${Date.now()}-${i}`,
        size: v.size,
        color: v.color,
        colorHex: v.colorHex || '#111111',
        sku: v.sku || `SKU-${Date.now()}-${i}`,
        stock: Number(v.stock) || 0,
        isActive: true,
      }))
    };

    store.products.unshift(newProduct);
    return this.hydrateProduct(newProduct);
  }

  static async updateProduct(id: string, updates: any) {
    const index = store.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');

    const current = store.products[index];
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.variants) {
      updated.totalStock = updates.variants.reduce((acc: number, v: any) => acc + (Number(v.stock) || 0), 0);
    }
    if (updates.mrp && updates.basePrice) {
      updated.discountPercentage = Math.round(((updates.mrp - updates.basePrice) / updates.mrp) * 100);
    }

    store.products[index] = updated;
    return this.hydrateProduct(updated);
  }

  static async deleteProduct(id: string) {
    const index = store.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    store.products.splice(index, 1);
    return { success: true };
  }

  private static hydrateProduct(p: any) {
    return {
      ...p,
      department: store.departments.find(d => d.id === p.departmentId),
      category: store.categories.find(c => c.id === p.categoryId),
      brand: store.brands.find(b => b.id === p.brandId),
      supplier: store.suppliers.find(s => s.id === p.supplierId),
    };
  }
}
