import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, PlayCircle, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const HeroSection: React.FC<{
  title: string;
  subtitle: string;
  description?: string;
  textColor?: 'text-black' | 'text-white';
  bgImage?: string;
  bgColor?: string;
  productId: string;
  isDark?: boolean;
  videoUrl?: string | null;
  onGenerate?: () => void;
  isGenerating?: boolean;
  generationStatus?: string;
}> = ({ 
  title, 
  subtitle, 
  description, 
  textColor = 'text-black', 
  bgColor = 'bg-gray-100', 
  productId, 
  isDark = false, 
  bgImage,
  videoUrl,
  onGenerate,
  isGenerating,
  generationStatus
}) => {
  return (
    <div className={`relative h-[600px] md:h-[750px] w-full flex flex-col items-center pt-16 md:pt-20 overflow-hidden ${bgColor}`}>
      {/* Video Background Layer */}
      {videoUrl && (
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-80"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
      )}

      <div className={`relative z-10 text-center ${textColor} px-6 flex flex-col items-center max-w-2xl`}>
        <h2 className="text-4xl md:text-6xl font-semibold mb-3 tracking-tight drop-shadow-lg">{title}</h2>
        <h3 className="text-2xl md:text-3xl font-normal mb-4 drop-shadow-md">{subtitle}</h3>
        {description && <p className="text-lg text-gray-400 mb-6 font-medium leading-relaxed drop-shadow-md">{description}</p>}
        
        <div className="flex items-center justify-center space-x-4 mt-2">
          <Link 
            to={`/product/${productId}`} 
            className={`px-6 py-2.5 rounded-full text-base font-medium transition-all backdrop-blur-sm ${
              isDark 
                ? 'bg-blue-600/90 text-white hover:bg-blue-600' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Learn more
          </Link>
          <Link 
            to={`/product/${productId}`} 
            className={`px-6 py-2.5 rounded-full text-base font-medium border transition-all backdrop-blur-sm ${
              isDark 
                ? 'border-white/50 text-white hover:bg-white/10' 
                : 'border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
          >
            Buy
          </Link>
        </div>

        {/* AI Generation Control */}
        {onGenerate && !videoUrl && (
          <button 
            onClick={onGenerate}
            disabled={isGenerating}
            className="mt-8 flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-xs font-medium transition-all uppercase tracking-widest hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{generationStatus}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Generate {title} Video</span>
              </>
            )}
          </button>
        )}
      </div>
      
      {/* Product Image Placeholder - Only show if no video */}
      {!videoUrl && (
        <div className="mt-10 md:mt-14 w-full max-w-[1000px] h-full bg-cover bg-center mx-auto transform hover:scale-[1.01] transition-transform duration-1000 ease-out z-0" 
             style={{ 
               backgroundImage: bgImage || 'url(https://picsum.photos/1600/1000?grayscale&blur=2)',
               maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)',
               WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'
             }}>
        </div>
      )}
    </div>
  );
};

const HighlightSection: React.FC = () => {
  return (
    <div className="bg-[#101010] py-24 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-4xl md:text-6xl font-semibold text-[#f5f5f7] mb-12 tracking-tight">
          Get the highlights.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-5 h-auto md:h-[650px]">
          
          {/* Apple Intelligence - Large Card */}
          <div className="col-span-1 md:col-span-2 row-span-2 bg-black rounded-[2rem] overflow-hidden relative group cursor-default transition-transform duration-500 hover:scale-[1.01]">
             {/* Animated Gradient Background */}
             <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 animate-pulse"></div>
             <img src="https://picsum.photos/800/800?image=10" alt="AI" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-screen" />
             
             <div className="absolute bottom-10 left-10 z-10 pr-10">
                <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">Apple Intelligence</p>
                <h3 className="text-3xl md:text-4xl text-white font-semibold leading-tight mb-4">
                  AI for the rest of us.
                </h3>
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 via-pink-500 to-blue-500 animate-spin-slow"></div>
                </div>
             </div>
          </div>

          {/* Camera Control - Wide Card */}
          <div className="col-span-1 md:col-span-2 row-span-1 bg-[#1c1c1e] rounded-[2rem] overflow-hidden relative flex flex-col md:flex-row items-center justify-between p-10 group cursor-default transition-transform duration-500 hover:scale-[1.01]">
             <div className="z-10 mb-6 md:mb-0">
                <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">Camera Control</p>
                <h3 className="text-3xl text-white font-semibold">Take total control.</h3>
             </div>
             <div className="relative">
                 <div className="w-24 h-12 rounded-full border border-gray-600 bg-black shadow-inner flex items-center justify-end pr-2">
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-600"></div>
                 </div>
                 <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
             </div>
          </div>

          {/* A18 Pro - Small Card */}
          <div className="col-span-1 md:col-span-1 row-span-1 bg-[#1c1c1e] rounded-[2rem] overflow-hidden relative p-8 group cursor-default transition-transform duration-500 hover:scale-[1.02]">
             <div className="h-full flex flex-col justify-between">
                <div>
                   <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">A18 Pro</p>
                   <h3 className="text-xl text-white font-semibold leading-snug">The fastest chip ever in a smartphone.</h3>
                </div>
                <div className="w-16 h-16 bg-black border border-gray-700 rounded-xl flex items-center justify-center self-end mt-4">
                    <span className="text-gray-500 font-mono text-xs">A18</span>
                </div>
             </div>
          </div>

          {/* Titanium - Small Card */}
           <div className="col-span-1 md:col-span-1 row-span-1 bg-[#1c1c1e] rounded-[2rem] overflow-hidden relative p-8 group cursor-default transition-transform duration-500 hover:scale-[1.02]">
             <div className="h-full flex flex-col justify-between">
                <div>
                   <p className="text-gray-400 text-sm font-semibold mb-2 uppercase tracking-wide">Titanium</p>
                   <h3 className="text-xl text-white font-semibold leading-snug">Strong. Light. Pro.</h3>
                </div>
                {/* Texture overlay simulation */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-10 mix-blend-overlay"></div>
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-gray-500 to-transparent mt-4 opacity-50"></div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const GridSection: React.FC<{
  items: { title: string; subtitle: string; bgImage: string; textColor: string; link: string; dark?: boolean }[]
}> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white">
      {items.map((item, index) => (
        <div key={index} className="relative h-[500px] md:h-[580px] bg-gray-100 group overflow-hidden cursor-pointer">
          <div className="absolute top-0 w-full text-center pt-12 z-20 px-6">
             <h4 className={`text-3xl md:text-4xl font-semibold mb-2 ${item.textColor}`}>{item.title}</h4>
             <p className={`text-lg md:text-xl ${item.textColor} mb-4`}>{item.subtitle}</p>
             <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <Link to={item.link} className={`px-5 py-2 rounded-full text-sm font-medium ${item.dark ? 'bg-white text-black' : 'bg-blue-600 text-white'}`}>
                  Learn more
               </Link>
             </div>
          </div>
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{ backgroundImage: `url(${item.bgImage})` }}
          />
        </div>
      ))}
    </div>
  );
};

const Home: React.FC = () => {
  const [heroVideo, setHeroVideo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');

  const generateHeroVideo = async () => {
    // Check if user has selected a key for Veo
    const aiStudio = (window as any).aistudio;
    if (aiStudio && !await aiStudio.hasSelectedApiKey()) {
        try {
          await aiStudio.openSelectKey();
          // Assuming successful selection if promise resolves, proceed immediately
        } catch (e) {
          console.error("Key selection failed or cancelled", e);
          return;
        }
    }

    setIsGenerating(true);
    setGenerationStatus('Initiating...');

    try {
        // Re-initialize AI with the (potentially newly selected) key
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            // Prompt tuned for a high-end product reveal background
            prompt: 'Cinematic commercial close up shot of the iPhone 17 Pro Max, futuristic titanium design, glowing edges, elegant dramatic studio lighting, 4k, hyperrealistic, slow motion rotation',
            config: {
                numberOfVideos: 1,
                resolution: '1080p',
                aspectRatio: '16:9' 
            }
        });

        setGenerationStatus('Dreaming up iPhone 17...');

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
            setGenerationStatus('Rendering pixels...');
        }

        const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (uri) {
             // Append API key to fetch the video resource
             setHeroVideo(`${uri}&key=${process.env.API_KEY}`);
        }
    } catch (e) {
        console.error("Video generation failed", e);
        setGenerationStatus('Generation failed');
    } finally {
        setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white w-full">
      {/* Primary Hero - iPhone 17 Pro Max (Video Enabled) */}
      <HeroSection 
        title="iPhone 17 Pro Max"
        subtitle="The future is here."
        productId="iphone-16-pro"
        bgColor="bg-[#000]"
        textColor="text-white"
        isDark={true}
        bgImage="url(https://picsum.photos/1600/900?grayscale&blur=2)"
        videoUrl={heroVideo}
        onGenerate={generateHeroVideo}
        isGenerating={isGenerating}
        generationStatus={generationStatus}
      />

      {/* Feature Highlights Section */}
      <HighlightSection />

      {/* Secondary Hero - iPhone 16 */}
      <div className="pt-4 bg-white">
        <HeroSection 
          title="iPhone 16"
          subtitle="Apple Intelligence is here."
          productId="iphone-16"
          bgColor="bg-[#f5f5f7]"
          textColor="text-black"
          bgImage="url(https://picsum.photos/1600/900?grayscale)"
        />
      </div>

      <div className="h-4 bg-white"></div>
      
      {/* Third Hero - MacBook Air */}
      <HeroSection 
        title="MacBook Air"
        subtitle="Lean. Mean. M3 machine."
        productId="macbook-air-m3"
        bgColor="bg-white"
        textColor="text-black"
        bgImage="url(https://picsum.photos/1600/900?image=3)"
      />

      {/* Grid Section */}
      <GridSection 
        items={[
          { title: 'Apple Watch Ultra 2', subtitle: 'New finish. Never quit.', bgImage: 'https://picsum.photos/800/800?image=1', textColor: 'text-black', link: '/product/apple-watch-ultra-2' },
          { title: 'iPad Pro', subtitle: 'Thinpossible.', bgImage: 'https://picsum.photos/800/800?image=2', textColor: 'text-white', link: '/product/ipad-pro-m4', dark: true },
          { title: 'Apple Intelligence', subtitle: 'AI for the rest of us.', bgImage: 'https://picsum.photos/800/800?image=3', textColor: 'text-black', link: '/store' },
          { title: 'Trade In', subtitle: 'Upgrade and save. It’s that easy.', bgImage: 'https://picsum.photos/800/800?image=4', textColor: 'text-black', link: '/store' },
        ]}
      />
    </div>
  );
};

export default Home;