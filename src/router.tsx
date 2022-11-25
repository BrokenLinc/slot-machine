import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ExamplesPage } from './examples/ExamplesPage';
import { HomePage } from './home/HomePage';

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
