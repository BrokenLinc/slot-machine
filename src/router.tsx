import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ExamplesPage } from './examples/ExamplesPage';
import { HomePage } from './home/HomePage';
import { SlotMachinePage } from './slot-machine/SlotMachinePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/examples',
    element: <ExamplesPage />,
  },
  {
    path: '/slot-machine',
    element: <SlotMachinePage />,
  },
]);

export const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};
