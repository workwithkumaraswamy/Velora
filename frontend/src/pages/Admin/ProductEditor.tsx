import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Plus, Trash2, ArrowLeft, Check, Image as ImageIcon } from 'lucide-react';
import { Department, Category, Brand, Supplier } from '../../types';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export const ProductEditor: React.FC = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Form State
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('dept-men');
  const [categoryId, setCategoryId] = useState('cat-m-jackets');
  const [brandId, setBrandId] = useState('br-bespoke');
  const [supplierId, setSupplierId] = useState('sup-1');

  const [basePrice, setBasePrice] = useState('4999');
  const [mrp, setMrp] = useState('8999');
  const [costPrice, setCostPrice] = useState('2200');

  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [careInstructions, setCareInstructions] = useState('');

  // Variants
  const [variants, setVariants] = useState([
    { size: 'S', color: 'Midnight Navy', colorHex: '#1B2430', stock: 10, sku: 'SKU-01' },
    { size: 'M', color: 'Midnight Navy', colorHex: '#1B2430', stock: 15, sku: 'SKU-02' },
    { size: 'L', color: 'Midnight Navy', colorHex: '#1B2430', stock: 12, sku: 'SKU-03' },
  ]);

  // Images
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<Array<{ url: string; styleTag: string; isAiGenerated: boolean }>>([
    {
      url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1000&auto=format&fit=crop&q=85',
      styleTag: 'editorial',
      isAiGenerated: false
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [deptRes, catRes, brRes, supRes] = await Promise.all([
          api.get('/catalog/departments'),
          api.get('/catalog/categories'),
          api.get('/catalog/brands'),
          api.get('/suppliers'),
        ]);

        setDepartments(deptRes.data.data || []);
        setCategories(catRes.data.data || []);
        setBrands(brRes.data.data || []);
        setSuppliers(supRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMetadata();
  }, []);

  // AI Description Generator Shortcut
  const handleGenerateAiDescription = async () => {
    if (!title.trim()) {
      alert('Please enter a product title first');
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await api.post('/ai/description', {
        title,
        tone: 'Luxury',
        targetAudience: departmentId === 'dept-men' ? 'Men' : departmentId === 'dept-women' ? 'Women' : 'Kids',
        supplierCost: Number(costPrice) || 2000,
      });

      const copy = res.data.data;
      setShortDescription(copy.shortDescription);
      setDescription(copy.description);
      setCareInstructions(copy.careInstructions);
    } catch (err: any) {
      alert('AI generator unavailable: ' + err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      { size: 'XL', color: 'Midnight Navy', colorHex: '#1B2430', stock: 10, sku: `SKU-${Date.now().toString().slice(-4)}` }
    ]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setImages([...images, { url: imageUrlInput.trim(), styleTag: 'studio', isAiGenerated: false }]);
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !basePrice) {
      alert('Title and Price are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/products', {
        title,
        departmentId,
        categoryId,
        brandId,
        supplierId,
        basePrice: Number(basePrice),
        mrp: Number(mrp),
        costPrice: Number(costPrice),
        shortDescription,
        description,
        careInstructions,
        variants,
        images,
      });

      navigate('/admin/products');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to publish product');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Profit Margin Display
  const numBase = Number(basePrice) || 0;
  const numCost = Number(costPrice) || 0;
  const marginPct = numBase > 0 ? Math.round(((numBase - numCost) / numBase) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
        <div className="flex items-center space-x-3">
          <Link to="/admin/products" className="p-2 border border-velora-border hover:bg-white text-neutral-500">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
              Atelier Creation
            </span>
            <h1 className="font-serif text-2xl text-velora-black font-normal">
              Publish New Product Listing
            </h1>
          </div>
        </div>

        <Button
          type="button"
          variant="champagne"
          size="sm"
          isLoading={isAiLoading}
          onClick={handleGenerateAiDescription}
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
        >
          Generate Copy With AI
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-xs">
        {/* Core Product Information */}
        <div className="bg-white border border-velora-border p-6 space-y-4">
          <h3 className="font-serif text-base text-velora-black font-normal pb-3 border-b border-velora-border">
            1. Title & Classification
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Savile Double-Breasted Wool Blazer"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none focus:border-velora-champagne font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                  Department *
                </label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                  Brand Line
                </label>
                <select
                  value={brandId}
                  onChange={(e) => setBrandId(e.target.value)}
                  className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                  Fulfillment Supplier *
                </label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Profit Margin */}
        <div className="bg-white border border-velora-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-velora-border">
            <h3 className="font-serif text-base text-velora-black font-normal">
              2. Commercial Pricing & Margin
            </h3>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 font-bold uppercase">
              Gross Margin: {marginPct}% ({formatINR(numBase - numCost)} / unit)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Selling Price (₹ INR) *
              </label>
              <input
                type="number"
                required
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black font-semibold font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                MRP (Strikethrough Price) *
              </label>
              <input
                type="number"
                required
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-neutral-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Supplier Cost Price (₹ INR)
              </label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-neutral-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Narrative & Descriptions */}
        <div className="bg-white border border-velora-border p-6 space-y-4">
          <h3 className="font-serif text-base text-velora-black font-normal pb-3 border-b border-velora-border">
            3. Editorial Descriptions & Care
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Short Teaser / Subtitle
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="One sentence summary of fabric and silhouette..."
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Detailed Product Narrative
              </label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive editorial description describing fabric weight, weave, lapels, canvassing..."
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Material & Preservation Care
              </label>
              <input
                type="text"
                value={careInstructions}
                onChange={(e) => setCareInstructions(e.target.value)}
                placeholder="Dry clean only with specialist solvent..."
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black"
              />
            </div>
          </div>
        </div>

        {/* Variant Matrix */}
        <div className="bg-white border border-velora-border p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-velora-border">
            <h3 className="font-serif text-base text-velora-black font-normal">
              4. Size & Color Variant Matrix ({variants.length} Variants)
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={handleAddVariant} leftIcon={<Plus className="w-3.5 h-3.5" />}>
              Add Variant Row
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-velora-border">
              <thead className="bg-velora-ivory/50 text-[10px] uppercase font-semibold text-neutral-400">
                <tr>
                  <th className="p-2">Size</th>
                  <th className="p-2">Color</th>
                  <th className="p-2">Color Hex</th>
                  <th className="p-2">Stock Available</th>
                  <th className="p-2">SKU</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-velora-border">
                {variants.map((v, idx) => (
                  <tr key={idx}>
                    <td className="p-2">
                      <input
                        type="text"
                        value={v.size}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].size = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-20 border border-velora-border p-1.5 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={v.color}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].color = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-32 border border-velora-border p-1.5 text-xs"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={v.colorHex}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].colorHex = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-24 border border-velora-border p-1.5 text-xs font-mono"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].stock = Number(e.target.value);
                          setVariants(updated);
                        }}
                        className="w-20 border border-velora-border p-1.5 text-xs font-mono"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={v.sku}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].sku = e.target.value;
                          setVariants(updated);
                        }}
                        className="w-28 border border-velora-border p-1.5 text-xs font-mono"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemoveVariant(idx)}
                        className="text-neutral-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Image Gallery URLs */}
        <div className="bg-white border border-velora-border p-6 space-y-4">
          <h3 className="font-serif text-base text-velora-black font-normal pb-3 border-b border-velora-border">
            5. Image Assets ({images.length} Photos)
          </h3>

          <div className="flex space-x-2">
            <input
              type="url"
              placeholder="Paste high-res image URL (e.g. Unsplash or Cloudinary)..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 bg-white border border-velora-border p-2.5 text-xs text-velora-black"
            />
            <Button type="button" variant="primary" size="sm" onClick={handleAddImage}>
              Add Image
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            {images.map((img, i) => (
              <div key={i} className="relative aspect-[3/4] border border-velora-border group overflow-hidden">
                <img src={img.url} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-2 right-2 p-1.5 bg-black/70 text-white hover:bg-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-0 inset-x-0 p-1.5 bg-black/60 text-white text-[9px] uppercase tracking-wider text-center">
                  Photo #{i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end space-x-3 pt-4">
          <Link to="/admin/products">
            <Button type="button" variant="ghost" size="lg">Cancel</Button>
          </Link>
          <Button type="submit" variant="champagne" size="lg" isLoading={isSubmitting} className="tracking-widest px-8">
            Publish To Live Marketplace
          </Button>
        </div>
      </form>
    </div>
  );
};
