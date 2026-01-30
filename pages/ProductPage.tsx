import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Product, ProductColor, StorageOption } from '../types';
import { Check, Truck, Box, CreditCard, Wallet, BadgeDollarSign, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = PRODUCTS.find(p => p.id === id);

  // State for configuration
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(null);
  const [isSticky, setIsSticky] = useState(false);

  // AI Image Generation State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedStorage(product.storageOptions[0]);
      setGeneratedImage(null); // Reset generated image on product change
    }
  }, [product]);

  // Reset generated image when color changes to encourage re-generation for correct color
  useEffect(() => {
    setGeneratedImage(null);
  }, [selectedColor]);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = 600; // Approx height of hero
      setIsSticky(window.scrollY > heroHeight);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const generateProductImage = async () => {
    if (!product || !selectedColor || !process.env.API_KEY) return;
    
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Professional studio product photography of Apple ${product.name} in ${selectedColor.name} finish. 
      The device is isolated on a pure white background. 
      High resolution, 8k, photorealistic, soft studio lighting, minimalist Apple advertising style. 
      Show the back of the phone to clearly display the camera system and color.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        }
      });

      // Extract image from response
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64String = part.inlineData.data;
          setGeneratedImage(`data:image/png;base64,${base64String}`);
          break;
        }
      }
    } catch (error) {
      console.error("Failed to generate image", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!product) {
    return <div className="pt-32 text-center text-2xl">Product not found</div>;
  }

  const currentPrice = product.price + (selectedStorage?.priceModifier || 0);
  const monthlyPrice = (currentPrice / 24).toFixed(2);

  return (
    <div className="bg-white min-h-screen">
      
      {/* Sticky Product Header */}
      <div className={`fixed top-11 left-0 w-full bg-white/90 backdrop-blur-md border-b border-gray-200 z-30 transition-transform duration-300 ${isSticky ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
          <span className="font-semibold text-xl">{product.name}</span>
          <div className="flex items-center space-x-4">
             <span className="text-sm text-gray-500">From ${currentPrice}</span>
             <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-blue-700">
               Buy
             </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="pt-20 pb-12 max-w-screen-xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
         {/* Left: Images (Sticky on Desktop) */}
         <div className="md:sticky md:top-32 h-fit">
            <div className="w-full aspect-square bg-gray-50 rounded-3xl flex items-center justify-center overflow-hidden mb-4 relative group">
                {/* Product Label */}
                <span className="absolute top-4 left-4 text-xs font-bold text-gray-400 z-10">
                  {selectedColor?.name}
                </span>

                {/* AI Generation Button */}
                {!isGenerating && (
                  <button 
                    onClick={generateProductImage}
                    className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white backdrop-blur-md p-2 rounded-full shadow-sm text-gray-600 hover:text-blue-600 transition-all transform hover:scale-105"
                    title={generatedImage ? "Regenerate Image" : "Generate AI Preview"}
                  >
                    {generatedImage ? <RotateCcw size={18} /> : <Sparkles size={18} />}
                  </button>
                )}

                {/* Loading State */}
                {isGenerating && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50/80 z-20 backdrop-blur-sm">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-2" />
                    <span className="text-sm text-gray-500 font-medium animate-pulse">Designing {selectedColor?.name} finish...</span>
                  </div>
                )}

                {/* Image Display */}
                <img 
                  src={generatedImage || product.image} 
                  alt={product.name} 
                  className={`max-w-[80%] max-h-[80%] object-contain mix-blend-multiply transition-opacity duration-500 ${isGenerating ? 'opacity-50' : 'opacity-100'}`} 
                />
                
                {generatedImage && (
                  <div className="absolute bottom-4 right-4 text-[10px] text-gray-400 bg-white/80 px-2 py-1 rounded-md">
                    Generated by Gemini
                  </div>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 text-center">
               <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
                 <Truck className="mb-2" size={20} />
                 <span>Free Delivery</span>
               </div>
               <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
                 <Box className="mb-2" size={20} />
                 <span>Free Returns</span>
               </div>
            </div>
         </div>

         {/* Right: Configuration */}
         <div className="flex flex-col space-y-10 pt-4">
           
           {/* Header */}
           <div>
             <h2 className="text-orange-600 font-semibold text-sm mb-1">{product.isNew ? 'New' : 'Great Choice'}</h2>
             <h1 className="text-4xl md:text-5xl font-semibold mb-2 text-gray-900">Buy {product.name}</h1>
             <p className="text-xl text-gray-500 font-light">From ${product.price} or ${monthlyPrice}/mo. for 24 mo.*</p>
           </div>

           {/* Color Selection */}
           <div>
             <h3 className="text-lg font-semibold mb-4">Choose your finish. <span className="text-gray-500 font-normal">{selectedColor?.name}</span></h3>
             <div className="grid grid-cols-2 gap-4">
               {product.colors.map((color) => (
                 <button
                   key={color.name}
                   onClick={() => setSelectedColor(color)}
                   className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                     selectedColor?.name === color.name 
                       ? 'border-blue-600 ring-1 ring-blue-600 bg-white' 
                       : 'border-gray-200 hover:border-gray-400 bg-gray-50'
                   }`}
                 >
                   <div className="w-8 h-8 rounded-full shadow-sm border border-gray-300" style={{ backgroundColor: color.hex }}></div>
                   <span className="text-sm font-medium">{color.name}</span>
                 </button>
               ))}
             </div>
             <p className="mt-4 text-xs text-gray-400 flex items-center gap-1">
               <Sparkles size={12} />
               <span>Tip: Click the sparkle icon on the image to generate a realistic preview of this color using AI.</span>
             </p>
           </div>

           {/* Storage Selection */}
           <div>
             <h3 className="text-lg font-semibold mb-4">Choose your storage. <span className="text-gray-500 font-normal">How much space do you need?</span></h3>
             <div className="space-y-4">
               {product.storageOptions.map((storage) => (
                 <button
                   key={storage.size}
                   onClick={() => setSelectedStorage(storage)}
                   className={`w-full p-6 rounded-xl border flex justify-between items-center transition-all ${
                     selectedStorage?.size === storage.size
                       ? 'border-blue-600 ring-1 ring-blue-600 bg-white' 
                       : 'border-gray-200 hover:border-gray-400 bg-white'
                   }`}
                 >
                   <span className="font-semibold text-lg">{storage.size}</span>
                   <span className="text-sm text-gray-600">
                     {storage.priceModifier === 0 ? 'Base Price' : `+ $${storage.priceModifier}`}
                   </span>
                 </button>
               ))}
             </div>
           </div>

           {/* Summary Box & Payments */}
           <div className="bg-gray-50 p-6 md:p-8 rounded-2xl space-y-6">
              <h3 className="text-2xl font-semibold">Your new {product.name}.</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium text-gray-900">{product.name} {selectedStorage?.size} {selectedColor?.name}</p>
                <p>Order today. Delivers to you by <span className="font-semibold text-gray-900">Tomorrow</span>.</p>
              </div>
              
              <div className="pt-6 border-t border-gray-200">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6">
                   <div className="mb-4 md:mb-0">
                     <span className="block text-3xl font-semibold text-gray-900">${currentPrice}</span>
                     <span className="text-sm text-gray-500">or ${monthlyPrice}/mo. for 24 mo.*</span>
                   </div>
                 </div>
                 
                 <div className="flex flex-col gap-3">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg hover:bg-blue-700 transition-colors w-full font-medium">
                        Add to Bag
                    </button>
                    {/* Apple Pay Button */}
                    <button className="bg-black text-white px-8 py-3 rounded-full text-lg hover:bg-gray-800 transition-colors w-full flex items-center justify-center gap-2">
                         <span className="font-semibold">Buy with</span> 
                         <span className="font-bold text-lg tracking-tighter">Pay</span>
                    </button>
                 </div>

                 {/* Payment Methods Section */}
                 <div className="mt-6 pt-4 border-t border-gray-200">
                     <div className="flex items-center gap-2 text-xs font-semibold text-gray-900 mb-2">
                        <BadgeDollarSign size={16} />
                        <span>Payment Methods</span>
                     </div>
                     <div className="flex flex-wrap gap-2 text-gray-400 mb-2">
                        <div className="border border-gray-300 rounded px-2 py-1 bg-white flex items-center"><span className="text-black font-bold text-xs">Pay</span></div>
                        <div className="border border-gray-300 rounded px-2 py-1 bg-white flex items-center"><span className="font-serif text-blue-800 text-xs font-bold italic">VISA</span></div>
                        <div className="border border-gray-300 rounded px-2 py-1 bg-white flex items-center"><span className="font-sans text-red-600 text-xs font-bold">Mastercard</span></div>
                        <div className="border border-gray-300 rounded px-2 py-1 bg-white flex items-center"><span className="font-sans text-blue-500 text-xs font-bold">AMEX</span></div>
                     </div>
                     <p className="text-xs text-gray-500 leading-relaxed">
                         Get 3% Daily Cash with Apple Card. And pay for your new {product.category === 'iphone' ? 'iPhone' : 'device'} over 24 months, interest-free when you choose to check out with Apple Card Monthly Installments.
                     </p>
                 </div>

              </div>
           </div>

         </div>
      </div>
    </div>
  );
};

export default ProductPage;