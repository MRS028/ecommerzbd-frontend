import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/shared/components/layout/RootLayout';
import { RouteError } from '@/shared/components/common/RouteError';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { AdminLayout } from '@/modules/admin/components/AdminLayout';

import HomePage from '@/modules/home/views/HomePage';
import ProductsPage from '@/modules/product/views/ProductsPage';
import ProductDetailPage from '@/modules/product/views/ProductDetailPage';
import CartPage from '@/modules/cart/views/CartPage';
import OrdersPage from '@/modules/order/views/OrdersPage';
import LoginPage from '@/modules/auth/views/LoginPage';
import RegisterPage from '@/modules/auth/views/RegisterPage';

import AdminDashboardPage from '@/modules/admin/dashboard/views/AdminDashboardPage';
import AdminProductsPage from '@/modules/admin/product/views/AdminProductsPage';
import AdminProductCreatePage from '@/modules/admin/product/views/AdminProductCreatePage';
import AdminProductEditPage from '@/modules/admin/product/views/AdminProductEditPage';
import AdminCategoriesPage from '@/modules/admin/category/views/AdminCategoriesPage';
import AdminOrdersPage from '@/modules/admin/order/views/AdminOrdersPage';
import AdminUsersPage from '@/modules/admin/user/views/AdminUsersPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/products', element: <ProductsPage /> },
      { path: '/products/:slug', element: <ProductDetailPage /> },
      { path: '/cart', element: <CartPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [{ path: '/orders', element: <OrdersPage /> }],
      },
    ],
  },
  {
    element: <AdminRoute />,
    errorElement: <RouteError />,
    children: [
      {
        path: '/admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <AdminDashboardPage /> },
          { path: 'products', element: <AdminProductsPage /> },
          { path: 'products/new', element: <AdminProductCreatePage /> },
          { path: 'products/:id/edit', element: <AdminProductEditPage /> },
          { path: 'categories', element: <AdminCategoriesPage /> },
          { path: 'orders', element: <AdminOrdersPage /> },
          { path: 'users', element: <AdminUsersPage /> },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}