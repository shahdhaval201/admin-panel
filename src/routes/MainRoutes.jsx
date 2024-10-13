import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';
import { element } from 'prop-types';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));
const EstimationPage = Loadable(lazy(() => import('pages/extra-pages/estimation-page')));
const Language = Loadable(lazy(() => import('pages/extra-pages/language')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <Dashboard />,
  children: [
    {
      path: '/',
      element: <ProtectedRoute element={DashboardDefault} />  // Protect the default route
    },
    {
      path: 'color',
      element: <ProtectedRoute element={Color} />  // Protect the color route
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <ProtectedRoute element={DashboardDefault} />  // Protect dashboard
        }
      ]
    },
    {
      path: 'sample-page',
      element: <ProtectedRoute element={SamplePage} />  // Protect sample page
    },
    {
      path: 'estimation-page',
      element: <ProtectedRoute element={EstimationPage} />  // Protect estimation page
    },
    {
      path:'language',
      element: <ProtectedRoute element={Language} />
    },
    {
      path: 'shadow',
      element: <ProtectedRoute element={Shadow} />  // Protect shadow page
    },
    {
      path: 'typography',
      element: <ProtectedRoute element={Typography} />  // Protect typography page
    }
  ]
};

export default MainRoutes;
