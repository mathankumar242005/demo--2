import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#f5f5f7] text-[#1d1d1f] py-10 text-xs border-t border-gray-200 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2 text-gray-900">Shop and Learn</h3>
            <ul className="space-y-2 text-gray-500">
              <li>Store</li>
              <li>Mac</li>
              <li>iPad</li>
              <li>iPhone</li>
              <li>Watch</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900">Account</h3>
            <ul className="space-y-2 text-gray-500">
              <li>Manage Your Apple ID</li>
              <li>Apple Store Account</li>
              <li>iCloud.com</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gray-900">Apple Store</h3>
            <ul className="space-y-2 text-gray-500">
              <li>Find a Store</li>
              <li>Genius Bar</li>
              <li>Today at Apple</li>
              <li>Apple Camp</li>
            </ul>
          </div>
           <div>
            <h3 className="font-semibold mb-2 text-gray-900">About Apple</h3>
            <ul className="space-y-2 text-gray-500">
              <li>Newsroom</li>
              <li>Apple Leadership</li>
              <li>Career Opportunities</li>
              <li>Investors</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-300">
          <p className="text-gray-500 mb-2">
            More ways to shop: <span className="text-blue-600 underline cursor-pointer">Find an Apple Store</span> or <span className="text-blue-600 underline cursor-pointer">other retailer</span> near you. Or call 1-800-MY-APPLE.
          </p>
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-500">
            <p>Copyright © {new Date().getFullYear()} Apple Inc. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <span className="hover:underline cursor-pointer">Privacy Policy</span>
              <span className="hover:underline cursor-pointer">Terms of Use</span>
              <span className="hover:underline cursor-pointer">Sales and Refunds</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;