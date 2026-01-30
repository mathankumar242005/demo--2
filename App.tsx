import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import Home from './pages/Home';
import Store from './pages/Store';
import ProductPage from './pages/ProductPage';
import Support from './pages/Support';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store" element={<Store />} />
            <Route path="/support" element={<Support />} />
            <Route path="/product/:id" element={<ProductPage />} />
            {/* Fallback for Cart (Simplified) */}
            <Route path="/cart" element={<div className="pt-32 text-center"><h1 className="text-3xl font-semibold">Your Bag is Empty</h1><p className="mt-4 text-gray-500">Sign in to see if you have any saved items.</p></div>} />
          </Routes>
        </main>
        <Footer />
        <ChatAssistant />
      </div>
    </HashRouter>
  );
};

export default App;