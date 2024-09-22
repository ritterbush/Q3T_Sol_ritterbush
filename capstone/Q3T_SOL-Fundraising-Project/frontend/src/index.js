import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import Home from './contributor/Home.tsx';
import Donate from './contributor/donate.tsx';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Connectors from './contributor/connector.tsx';
import Dashboard from './fundraiser/pages/Dashboard.tsx';
import SignUp from './fundraiser/pages/SignUp.tsx';
import SignIn from './fundraiser/pages/SignIn.tsx';
import ViewCampaign from "./fundraiser/pages/ViewCampaign.tsx";
import CreateCampaign from './fundraiser/pages/CreateCampaign.tsx';
import ProtectedRoute from './components/protectedRoute.tsx';
import { Buffer } from 'buffer';

// Ensure Buffer is available globally
if (!window.Buffer) {
  window.Buffer = Buffer;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "donate/:id",
    element: (
      <Donate />
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/dashboard/create-campaign",
        element: <CreateCampaign />,
      },
      {
        path: "/dashboard/:campaignID",
        element: <ViewCampaign />,
      },
    ]
  },
  {
    path: "/auth/sign-up",
    element: <SignUp />,
  },
  {
    path: "/auth/sign-in",
    element: <SignIn />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Connectors>
      <RouterProvider router={router} />
    </Connectors>
  </React.StrictMode>
);
