/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { WhatsAppButton } from './components/common/WhatsAppButton';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { BrandsPage } from './pages/BrandsPage';
import { SearchPage } from './pages/SearchPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { CategoryDashboardPage } from './pages/CategoryDashboardPage';

import { ErrorBoundary } from './components/common/ErrorBoundary';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname, search]);
  return null;
}

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-white text-[#111111]">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/kids" element={<CategoryDashboardPage defaultGender="ninos" />} />
              <Route path="/ninos" element={<CategoryDashboardPage defaultGender="ninos" />} />
              <Route path="/hombres" element={<CategoryDashboardPage defaultGender="hombre" />} />
              <Route path="/damas" element={<CategoryDashboardPage defaultGender="mujer" />} />
              <Route path="/category/:gender" element={<CategoryDashboardPage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* Catch-all route returns to Home */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          <Footer />

          {/* Interactive Global Overlays */}
          <CartDrawer />
          <SearchModal />
          <WhatsAppButton />
        </div>
      </BrowserRouter>
    </StoreProvider>
    </ErrorBoundary>
  );
}
