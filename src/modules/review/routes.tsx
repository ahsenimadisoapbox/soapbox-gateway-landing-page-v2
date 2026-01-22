// src/modules/review/routes.tsx
import { MainLayout } from './components/layout/MainLayout';
import { Actions } from './pages/Actions';
import { Dashboard } from './pages/Dashboard';

const reviewRoutes = {
  path: '/review',
  element: <MainLayout />,   // 🔥 THIS IS THE KEY
  children: [
    { index: true, element: <Dashboard /> },
    { path: 'actions', element: <Actions /> },
  ],
};

export default reviewRoutes;
