import React from 'react';
import { Search, Monitor, Smartphone, Tablet, Watch, Headphones } from 'lucide-react';

const Support: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-no-repeat bg-cover bg-center h-[400px] flex flex-col items-center justify-center text-center px-4"
           style={{ backgroundImage: 'url(https://picsum.photos/1920/600?blur=4)' }}>
        <h1 className="text-4xl md:text-5xl font-semibold text-white mb-8 drop-shadow-md">Apple Support</h1>
        
        {/* Search Bar */}
        <div className="w-full max-w-2xl relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input 
            type="text" 
            className="w-full pl-12 pr-4 py-4 rounded-xl shadow-lg border-none focus:ring-2 focus:ring-blue-500 outline-none text-lg"
            placeholder="Search for topics..."
          />
        </div>
      </div>

      {/* Device Selection */}
      <div className="max-w-screen-xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-semibold mb-12 text-center">Select a product for support</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
           {[
             { name: 'iPhone', icon: <Smartphone size={48} /> },
             { name: 'Mac', icon: <Monitor size={48} /> },
             { name: 'iPad', icon: <Tablet size={48} /> },
             { name: 'Watch', icon: <Watch size={48} /> },
             { name: 'AirPods', icon: <Headphones size={48} /> },
           ].map((device) => (
             <div key={device.name} className="flex flex-col items-center space-y-4 group cursor-pointer">
               <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center text-gray-700 group-hover:border-blue-500 group-hover:text-blue-500 transition-colors">
                 {device.icon}
               </div>
               <span className="text-lg font-medium group-hover:text-blue-600 group-hover:underline">{device.name}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Topics */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-screen-xl mx-auto px-4">
          <h2 className="text-2xl font-semibold mb-8">Popular Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Forgot Apple ID password', 'Apple Repair', 'Billing and Subscriptions'].map(topic => (
              <div key={topic} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                <h3 className="font-semibold text-blue-600 mb-2">{topic}</h3>
                <p className="text-sm text-gray-500">Get help with your account, device repairs, and more.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;