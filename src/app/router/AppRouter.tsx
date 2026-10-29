import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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