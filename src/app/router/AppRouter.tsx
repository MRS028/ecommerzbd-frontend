import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootLayout } from '@/shared/components/layout/RootLayout';
import { ProtectedRoute } from './ProtectedRoute';
import HomePage from '@/modules/home/views/HomePage';
import ProductsPage from '@/modules/product/views/ProductsPage';
import ProductDetailPage from '@/modules/product/views/ProductDetailPage';
import CartPage from '@/modules/cart/views/CartPage';
import OrdersPage from '@/modules/order/views/OrdersPage';
import LoginPage from '@/modules/auth/views/LoginPage';
import RegisterPage from '@/modules/auth/views/RegisterPage';

const router = createBrowserRouter([
  {
    element: <RootLayout />,
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
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}