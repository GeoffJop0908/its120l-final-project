import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './pages/Home.jsx';
import Chat from './pages/Chat.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '../components/RootLayout.jsx';
import Recommendations from './pages/Recommendations.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'recommendations', element: <Recommendations /> },
      { path: 'chat', element: <Chat /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
