import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download, Image as ImageIcon, Sliders, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../../components/common/Button';

export const AIStudioPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'copy' | 'images'>('copy');

  // Copy Generator State
  const [productTitle, setProductTitle] = useState('Verona Cashmere Cardigan');
  const [category, setCategory] = useState('Knitwear');
  const [brand, setBrand] = useState('Atelier VÉLORA');
  const [material, setMaterial] = useState('100% Mongolian Cashmere (2-Ply)');
  const [color, setColor] = useState('Champagne Beige');
  const [audience, setAudience] = useState<'Women' | 'Men' | 'Kids'>('Women');
  const [tone, setTone] = useState<'Luxury' | 'Editorial' | 'Minimalist' | 'High-Energy'>('Luxury');

  const [generatedCopy, setGeneratedCopy] = useState<any>(null);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Image Generator State
  const [imgProductTitle, setImgProductTitle] = useState('Aurelia Mulberry Silk Evening Gown');
  const [imgColor, setImgColor] = useState('Champagne Gold');
  const [imgStyle, setImgStyle] = useState<'studio' | 'editorial' | 'white-bg' | 'lifestyle' | 'model' | 'flat-lay'>('editorial');
  const [provider, setProvider] = useState('LOCAL_RULE_BASED');

  const [generatedImage, setGeneratedImage] = useState<any>(null);
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);

  const handleGenerateCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingCopy(true);
    try {
      const res = await api.post('/ai/description', {
        title: productTitle,
        category,
        brand,
        material,
        color,
        targetAudience: audience,
        tone,
      });
      setGeneratedCopy(res.data.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'AI Generation failed');
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingImg(true);
    try {
      const res = await api.post('/ai/image', {
        productTitle: imgProductTitle,
        color: imgColor,
        style: imgStyle,
        provider,
      });
      setGeneratedImage(res.data.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Image Generation failed');
    } finally {
      setIsGeneratingImg(false);
    }
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-4">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-velora-champagne-dark">
            Generative Intelligence
          </span>
          <h1 className="font-serif text-3xl text-velora-black font-normal mt-0.5">
            VÉLORA AI Product Studio
          </h1>
          <p className="text-xs text-neutral-500 font-light mt-1">
            Produce bespoke haute couture copywriting, SEO metadata and studio-grade fashion photography with pluggable models.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center space-x-2 bg-neutral-200/60 p-1 border border-neutral-300">
          <button
            onClick={() => setActiveTool('copy')}
            className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors ${
              activeTool === 'copy' ? 'bg-velora-black text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            Copy & SEO Generator
          </button>
          <button
            onClick={() => setActiveTool('images')}
            className={`px-4 py-1.5 text-xs uppercase tracking-wider font-semibold transition-colors ${
              activeTool === 'images' ? 'bg-velora-black text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            Fashion Image Studio
          </button>
        </div>
      </div>

      {/* TOOL A: COPY & SEO GENERATOR */}
      {activeTool === 'copy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Form */}
          <form onSubmit={handleGenerateCopy} className="lg:col-span-5 bg-white border border-velora-border p-6 space-y-4 text-xs shadow-sm">
            <h3 className="font-serif text-base text-velora-black font-normal pb-3 border-b border-velora-border flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-velora-champagne-dark" />
              <span>Garment Parameters</span>
            </h3>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Base Product Name *
              </label>
              <input
                type="text"
                required
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                  Brand / Line
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Fabric & Material Composition
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Color Palette
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                  Department
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as any)}
                  className="w-full bg-white border border-velora-border p-2 text-xs focus:outline-none"
                >
                  <option value="Women">Women</option>
                  <option value="Men">Men</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                  Editorial Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as any)}
                  className="w-full bg-white border border-velora-border p-2 text-xs focus:outline-none"
                >
                  <option value="Luxury">Luxury & Haute</option>
                  <option value="Editorial">Vogue Editorial</option>
                  <option value="Minimalist">Modern Minimalist</option>
                  <option value="High-Energy">Dynamic Commercial</option>
                </select>
              </div>
            </div>

            <Button
              type="submit"
              variant="champagne"
              size="md"
              isLoading={isGeneratingCopy}
              className="w-full tracking-widest pt-3 pb-3 text-xs"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Generate Haute Copy
            </Button>
          </form>

          {/* Results Column */}
          <div className="lg:col-span-7 bg-white border border-velora-border p-6 space-y-6 shadow-sm">
            <h3 className="font-serif text-base text-velora-black font-normal pb-3 border-b border-velora-border">
              Generated Editorial Copy & Meta Assets
            </h3>

            {generatedCopy ? (
              <div className="space-y-5 text-xs text-neutral-700">
                {/* Generated Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400">Haute Title</span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.title, 'title')}
                      className="text-neutral-400 hover:text-black flex items-center space-x-1"
                    >
                      {copiedField === 'title' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[10px]">{copiedField === 'title' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <h4 className="font-serif text-lg text-velora-black font-normal bg-velora-ivory/50 p-3 border border-velora-border">
                    {generatedCopy.title}
                  </h4>
                </div>

                {/* Short Teaser */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400">Short Teaser</span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.shortDescription, 'short')}
                      className="text-neutral-400 hover:text-black flex items-center space-x-1"
                    >
                      {copiedField === 'short' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[10px]">{copiedField === 'short' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="bg-velora-ivory/50 p-3 border border-velora-border font-light">
                    {generatedCopy.shortDescription}
                  </p>
                </div>

                {/* Full Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400">Detailed Narrative</span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.description, 'desc')}
                      className="text-neutral-400 hover:text-black flex items-center space-x-1"
                    >
                      {copiedField === 'desc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span className="text-[10px]">{copiedField === 'desc' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="bg-velora-ivory/50 p-3 border border-velora-border leading-relaxed font-light">
                    {generatedCopy.description}
                  </p>
                </div>

                {/* SEO Snippet */}
                <div className="p-3 bg-neutral-50 border border-neutral-200 space-y-1">
                  <span className="text-[10px] uppercase font-semibold text-neutral-400">Search Engine Optimization (SEO)</span>
                  <p className="text-blue-700 font-medium">{generatedCopy.seoTitle}</p>
                  <p className="text-neutral-500 text-[11px] font-light">{generatedCopy.seoDescription}</p>
                  <p className="text-[10px] text-neutral-400 font-mono pt-1">Keywords: {generatedCopy.keywords?.join(', ')}</p>
                </div>

                {/* Social Caption */}
                <div>
                  <span className="text-[10px] uppercase font-semibold text-neutral-400 block mb-1">Instagram & Lookbook Caption</span>
                  <p className="bg-velora-beige/60 p-3 border border-velora-border italic font-light text-[11px]">
                    {generatedCopy.socialMediaCaption}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-neutral-400 space-y-2">
                <Sparkles className="w-8 h-8 mx-auto text-neutral-300 stroke-[1.5]" />
                <p className="text-xs">Adjust parameters on the left and click "Generate Haute Copy" to create complete listing copy.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL B: FASHION IMAGE GENERATOR */}
      {activeTool === 'images' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form onSubmit={handleGenerateImage} className="lg:col-span-5 bg-white border border-velora-border p-6 space-y-4 text-xs shadow-sm">
            <h3 className="font-serif text-base text-velora-black font-normal pb-3 border-b border-velora-border flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-velora-champagne-dark" />
              <span>Studio Photographic Parameters</span>
            </h3>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Product Garment Title *
              </label>
              <input
                type="text"
                required
                value={imgProductTitle}
                onChange={(e) => setImgProductTitle(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Dominant Color Palette
              </label>
              <input
                type="text"
                value={imgColor}
                onChange={(e) => setImgColor(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Photographic Style
              </label>
              <select
                value={imgStyle}
                onChange={(e) => setImgStyle(e.target.value as any)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none"
              >
                <option value="editorial">Luxury Fashion Editorial (Vogue Aesthetic)</option>
                <option value="studio">Studio Product Photography (Soft Shadows)</option>
                <option value="white-bg">White-Background Catalog Shot</option>
                <option value="lifestyle">Lifestyle Environment Photography</option>
                <option value="model">High-Fashion Model Wearing Clothing</option>
                <option value="flat-lay">Artisan Flat-Lay Photography</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-velora-black mb-1">
                Model Provider Pipeline
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full bg-white border border-velora-border p-2.5 text-xs text-velora-black focus:outline-none font-mono"
              >
                <option value="LOCAL_RULE_BASED">Local Haute Fashion Image Diffusion (Zero Cost)</option>
                <option value="SDXL">Stable Diffusion XL (Configured Endpoint)</option>
                <option value="FLUX">FLUX Fashion Engine (Configured Endpoint)</option>
                <option value="HUGGINGFACE">Hugging Face Serverless Fashion Pipeline</option>
              </select>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] space-y-1">
              <strong>Authenticity Guarantee:</strong>
              <p>Generated images are automatically stamped with an AI-studio attribution disclaimer to preserve consumer trust.</p>
            </div>

            <Button
              type="submit"
              variant="champagne"
              size="md"
              isLoading={isGeneratingImg}
              className="w-full tracking-widest pt-3 pb-3 text-xs"
              leftIcon={<Sparkles className="w-3.5 h-3.5" />}
            >
              Generate Photography Asset
            </Button>
          </form>

          {/* Image Stage Output */}
          <div className="lg:col-span-7 bg-white border border-velora-border p-6 space-y-4 shadow-sm">
            <h3 className="font-serif text-base text-velora-black font-normal pb-3 border-b border-velora-border">
              Studio Render Stage
            </h3>

            {generatedImage ? (
              <div className="space-y-4">
                <div className="relative aspect-[3/4] max-w-md mx-auto border border-velora-border overflow-hidden bg-velora-beige group">
                  <img
                    src={generatedImage.imageUrl}
                    alt="AI Generated Fashion"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white text-[10px] px-2.5 py-1 tracking-wider uppercase font-semibold flex items-center space-x-1">
                    <Sparkles className="w-3 h-3 text-velora-champagne" />
                    <span>AI Model Render</span>
                  </div>
                </div>

                <div className="p-3 bg-velora-ivory border border-velora-border text-xs text-neutral-600 space-y-1">
                  <p className="font-mono text-[11px]">Prompt: {generatedImage.prompt}</p>
                  <p className="text-[10px] text-neutral-400">{generatedImage.safeDisclaimer}</p>
                </div>

                <div className="flex justify-end space-x-3">
                  <a
                    href={generatedImage.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 border border-velora-black text-xs uppercase tracking-wider font-semibold text-velora-black hover:bg-velora-black hover:text-white transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Asset</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-24 text-center text-neutral-400 space-y-2">
                <ImageIcon className="w-10 h-10 mx-auto text-neutral-300 stroke-[1.5]" />
                <p className="text-xs">Specify garment title and style, then trigger photography generation.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
