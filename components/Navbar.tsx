import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, Menu, X, Apple } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { useCart } from '../context/CartContext';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { itemCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${isScrolled || isMobileMenuOpen
            ? 'bg-black/90 backdrop-blur-md'
            : 'bg-[#1d1d1f]'
          }`}
      >
        <div className="max-w-screen-xl mx-auto px-4 h-11 flex justify-between items-center text-[#f5f5f7] text-xs">

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          {/* Logo (Centered on mobile, Left on desktop) */}
          <Link to="/" className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <Apple size={18} fill="currentColor" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 items-center font-light tracking-wide">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button className="hover:opacity-80 transition-opacity">
              <Search size={16} />
            </button>
            <button className="hover:opacity-80 transition-opacity relative" onClick={() => navigate('/cart')}>
              <ShoppingBag size={16} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`md:hidden absolute top-11 left-0 w-full bg-black h-screen transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
          <div className="flex flex-col p-8 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-2xl font-semibold text-[#f5f5f7] py-2 border-b border-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
      {/* Spacer to prevent content overlap */}
      <div className="h-11 bg-[#1d1d1f]"></div>
    </>
  );
};

export default Navbar;