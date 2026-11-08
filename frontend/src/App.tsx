import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { MainLayout } from './components/layout/MainLayout';
import { AccountLayout } from './pages/Account/AccountLayout';
import { AdminLayout } from './pages/Admin/AdminLayout';

// Public Pages
import { Home } from './pages/Home';
import { DepartmentPage } from './pages/DepartmentPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';

// Account Pages
import { ProfilePage } from './pages/Account/ProfilePage';
import { OrdersPage } from './pages/Account/OrdersPage';
import { AddressesPage } from './pages/Account/AddressesPage';
import { ReturnsPage } from './pages/Account/ReturnsPage';
import { TicketsPage } from './pages/Account/TicketsPage';

// Admin Pages
import { DashboardOverview } from './pages/Admin/DashboardOverview';
import { ProductsManager } from './pages/Admin/ProductsManager';
import { ProductEditor } from './pages/Admin/ProductEditor';
import { SuppliersManager } from './pages/Admin/SuppliersManager';
import { SupplierOrdersManager } from './pages/Admin/SupplierOrdersManager';
import { ProductImportPage } from './pages/Admin/ProductImportPage';
import { AIStudioPage } from './pages/Admin/AIStudioPage';
import { OrdersManager } from './pages/Admin/OrdersManager';
import { CouponsManager } from './pages/Admin/CouponsManager';
import { ReturnsManager } from './pages/Admin/ReturnsManager';
import { SupportTicketsManager } from './pages/Admin/SupportTicketsManager';
import { DepartmentStaffManager } from './pages/Admin/DepartmentStaffManager';
import { AnalyticsPage } from './pages/Admin/AnalyticsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Consumer Marketplace Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/men" element={<DepartmentPage forcedDepartment="men" />} />
          <Route path="/women" element={<DepartmentPage forcedDepartment="women" />} />
          <Route path="/kids" element={<DepartmentPage forcedDepartment="kids" />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmed/:orderNumber" element={<OrderSuccessPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Customer Account Routes */}
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<ProfilePage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="addresses" element={<AddressesPage />} />
            <Route path="returns" element={<ReturnsPage />} />
            <Route path="tickets" element={<TicketsPage />} />
          </Route>
        </Route>

        {/* Enterprise & Department Management Suite */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="products/new" element={<ProductEditor />} />
          <Route path="suppliers" element={<SuppliersManager />} />
          <Route path="supplier-orders" element={<SupplierOrdersManager />} />
          <Route path="import" element={<ProductImportPage />} />
          <Route path="ai-studio" element={<AIStudioPage />} />
          <Route path="orders" element={<OrdersManager />} />
          <Route path="coupons" element={<CouponsManager />} />
          <Route path="returns" element={<ReturnsManager />} />
          <Route path="support" element={<SupportTicketsManager />} />
          <Route path="staff" element={<DepartmentStaffManager />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
