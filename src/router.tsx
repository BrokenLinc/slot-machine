import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ExamplesPage from './pages/ExamplesPage';
import { HomePage } from './pages/HomePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/examples',
    element: <ExamplesPage />,
  },
]);

export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};
