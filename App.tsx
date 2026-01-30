import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatAssistant from './components/ChatAssistant';
import Home from './pages/Home';
import Store from './pages/Store';
import ProductPage from './pages/ProductPage';
import Support from './pages/Support';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ProtectedRoute from './components/ProtectedRoute';

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
            <Route path="/login" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/cart" element={
              <ProtectedRoute>
                <div className="pt-32 text-center">
                  <h1 className="text-3xl font-semibold">Shopping Bag</h1>
                  <p className="mt-4 text-gray-500">Your bag is empty.</p>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
        <ChatAssistant />
      </div>
    </HashRouter>
  );
};

export default App;