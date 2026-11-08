import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, DollarSign } from 'lucide-react';
import { api } from '../../services/api';
import { formatINR } from '../../utils/formatters';
import { Button } from '../../components/common/Button';

export const ProductImportPage: React.FC = () => {
  const navigate = useNavigate();

  const [sourceUrl, setSourceUrl] = useState('https://artisan-textiles.supplier.com/catalog/pure-mulberry-silk-evening-dress-3091');
  const [targetDepartment, setTargetDepartment] = useState<'men' | 'women' | 'kids'>('women');
  const [targetMargin, setTargetMargin] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setExtractedData(null);
    try {
      const res = await api.post('/ai/import-supplier', {
        url: sourceUrl,
        targetDepartment,
        targetMarginPercentage: targetMargin,
      });
      setExtractedData(res.data.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to parse supplier product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprovePublish = async () => {
    if (!extractedData) return;
    setIsPublishing(true);
    try {
      const deptMap: Record<string, string> = {
        men: 'dept-men',
        women: 'dept-women',
        kids: 'dept-kids',
      };

      await api.post('/products', {
        title: extractedData.aiCopy?.title || extractedData.title,
        departmentId: deptMap[extractedData.detectedDepartment] || 'dept-women',
        categoryId: 'cat-w-dresses',
        basePrice: extractedData.suggestedSellingPrice,
        mrp: extractedData.suggestedMRP,
        costPrice: extractedData.supplierCost,
        shortDescription: extractedData.aiCopy?.shortDescription,
        description: extractedData.aiCopy?.description,
        highlights: extractedData.aiCopy?.highlights,
        careInstructions: extractedData.aiCopy?.careInstructions,
        images: extractedData.extractedImages?.map((url: string, i: number) => ({
          url,
          styleTag: 'editorial',
          isAiGenerated: true,
        })),
        variants: extractedData.availableSizes?.map((sz: string) => ({
          size: sz,
          color: extractedData.availableColors?.[0] || 'Original',
          stock: 12,
        })),
      });

      alert('Product successfully approved and published to live marketplace!');
      navigate('/admin/products');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Publishing failed');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      <div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
          AI Ingestion Pipeline
        </span>
        <h1 className="font-serif text-2xl text-velora-black font-normal mt-0.5">
          Supplier Product Import & Margin Studio
        </h1>
        <p className="text-xs text-neutral-500 font-light mt-1">
          Enter external supplier URLs or CSV feeds. Our AI assistant extracts specifications, calculates profit margins, and generates high-converting luxury editorial copy.
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleImport} className="bg-white border border-velora-border p-6 space-y-4 text-xs shadow-sm">
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
            Supplier Product URL or Authorized Feed Link *
          </label>
          <input
            type="url"
            required
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black font-mono focus:outline-none focus:border-velora-champagne"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
              Target Department
            </label>
            <select
              value={targetDepartment}
              onChange={(e) => setTargetDepartment(e.target.value as any)}
              className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
            >
              <option value="women">Women’s Fashion</option>
              <option value="men">Men’s Fashion</option>
              <option value="kids">Kids’ Fashion</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black">
                Target Gross Margin Markup
              </label>
              <span className="font-bold text-velora-champagne-dark font-mono text-xs">{targetMargin}% Markup</span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={targetMargin}
              onChange={(e) => setTargetMargin(Number(e.target.value))}
              className="w-full accent-velora-black"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="champagne"
            size="md"
            isLoading={isLoading}
            leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          >
            Extract & Enrich With AI
          </Button>
        </div>
      </form>

      {/* Extracted Preview Stage */}
      {extractedData && (
        <div className="bg-white border border-velora-border p-8 space-y-6 shadow-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-velora-border">
            <div className="flex items-center space-x-2 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="font-serif text-lg text-velora-black font-normal">
                Supplier Data Parsed & AI Listing Prepared
              </h3>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 font-bold uppercase">
              Pending Admin Approval
            </span>
          </div>

          {/* Pricing & Margin Calculations */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 bg-velora-ivory/60 border border-velora-border text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Supplier Cost</span>
              <span className="font-serif text-lg text-neutral-700 block">{formatINR(extractedData.supplierCost)}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Selling Price (Suggested)</span>
              <span className="font-serif text-lg font-bold text-velora-black block">{formatINR(extractedData.suggestedSellingPrice)}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Retail MRP</span>
              <span className="font-serif text-lg text-neutral-400 line-through block">{formatINR(extractedData.suggestedMRP)}</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-semibold block">Net Profit / Unit</span>
              <span className="font-serif text-lg text-emerald-800 font-semibold block">
                +{formatINR(extractedData.grossMarginAmount)} ({extractedData.grossMarginPercentage}%)
              </span>
            </div>
          </div>

          {/* AI Enriched Narrative */}
          <div className="space-y-4 text-xs text-neutral-700 font-light">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
                Generated Luxury Title
              </span>
              <h4 className="font-serif text-xl text-velora-black font-normal">
                {extractedData.aiCopy?.title}
              </h4>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
                Short Description
              </span>
              <p className="bg-velora-ivory/40 p-3 border border-velora-border font-light">
                {extractedData.aiCopy?.shortDescription}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
                Detailed Product Narrative
              </span>
              <p className="bg-velora-ivory/40 p-3 border border-velora-border leading-relaxed font-light">
                {extractedData.aiCopy?.description}
              </p>
            </div>

            {/* Highlights */}
            {extractedData.aiCopy?.highlights && (
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block mb-1">
                  Bullet Points
                </span>
                <ul className="list-disc pl-5 space-y-1">
                  {extractedData.aiCopy.highlights.map((h: string, idx: number) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Images Extracted */}
            {extractedData.extractedImages && (
              <div>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block mb-2">
                  Transferred Image Assets ({extractedData.extractedImages.length})
                </span>
                <div className="flex space-x-3">
                  {extractedData.extractedImages.map((img: string, i: number) => (
                    <img key={i} src={img} alt={`Extracted ${i}`} className="w-20 h-24 object-cover border border-velora-border" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Approve Action */}
          <div className="pt-4 border-t border-velora-border flex items-center justify-between">
            <span className="text-xs text-neutral-500 italic">
              AI will never publish listings without explicit administrator confirmation.
            </span>
            <Button
              variant="champagne"
              size="lg"
              isLoading={isPublishing}
              onClick={handleApprovePublish}
              className="tracking-widest px-8"
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              Approve & Publish Listing
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
