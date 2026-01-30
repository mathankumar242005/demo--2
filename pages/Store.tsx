import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateThumbnail = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    if (!process.env.API_KEY) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Professional product photo of Apple ${product.name}, front view, isolated on white background, sharp focus, 4k, minimalist apple store style.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          setGeneratedImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center h-[450px] relative group">
       {/* AI Generate Button */}
       <button 
         onClick={generateThumbnail}
         disabled={isGenerating}
         className="absolute top-4 right-4 text-gray-300 hover:text-blue-500 transition-colors p-2 z-10"
         title="Generate AI Thumbnail"
       >
         {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
       </button>

      <div className="h-48 w-full flex items-center justify-center mb-8 relative">
        <img 
          src={generatedImage || product.image} 
          alt={product.name} 
          className={`max-h-full max-w-full object-contain ${isGenerating ? 'opacity-50 blur-sm' : ''} transition-all duration-500`} 
        />
        {generatedImage && <span className="absolute bottom-0 text-[9px] text-gray-400 bg-white/90 px-1 rounded">AI Generated</span>}
      </div>
      
      <div className="flex-1 flex flex-col items-center">
        {product.isNew && <span className="text-orange-600 text-xs font-semibold mb-2">New</span>}
        <h3 className="text-2xl font-semibold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.tagline}</p>
        <div className="mt-auto space-y-3">
           <p className="text-gray-900 font-medium">From ${product.price}</p>
           <Link 
             to={`/product/${product.id}`}
             className="inline-block bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
           >
             Buy
           </Link>
        </div>
      </div>
    </div>
  );
};

const Store: React.FC = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  
  const filteredProducts = category 
    ? PRODUCTS.filter(p => p.category === category)
    : PRODUCTS;

  const categoryTitle = category 
    ? category.charAt(0).toUpperCase() + category.slice(1) 
    : 'Store';

  return (
    <div className="bg-[#f5f5f7] min-h-screen pt-12 pb-24">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="py-16">
          <h1 className="text-4xl md:text-6xl font-semibold text-gray-900 mb-4">
             {categoryTitle}. <span className="text-gray-500">The best way to buy the products you love.</span>
          </h1>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
           <div className="text-center py-20 text-gray-500">
             No products found in this category.
           </div>
        )}
      </div>
    </div>
  );
};

export default Store;