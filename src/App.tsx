import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useRoutes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import NotFound from "./pages/NotFound";

// Module routes
import reviewRoutes from "@/modules/review/routes";
import executiveRoutes from "@/modules/executive/routes";
import incidentRoutes from "@/modules/incident/routes";
import auditRoutes from "@/modules/audit/routes";
import complianceRoutes from "@/modules/compliance/routes";
import qualityEventsRoutes from '@/modules/quality-events/routes';
import calibrationEquipmentRoutes from "@/modules/calibration-equipment/routes";
import validationRoutes from "@/modules/validation/routes";

const queryClient = new QueryClient();

/* =========================
   ROUTES CONFIG
========================= */

function AppRoutes() {
  const routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/logout", element: <Logout /> },

    // 🔥 Review module
    reviewRoutes,

    // 🔥 Executive module
    executiveRoutes,

    // 🔥 Incident module
    incidentRoutes,

    // 🔥 Audit module
    auditRoutes,

    // 🔥 Compliance module
    complianceRoutes,

    // 🔥 Quality Events module
    qualityEventsRoutes,

    // 🔥 Calibration & Equipment module
    calibrationEquipmentRoutes,

    // 🔥 Validation module
    validationRoutes,

    // Global 404
    { path: "*", element: <NotFound /> },
  ]);

  return routes;
}

/* =========================
   APP ROOT
========================= */

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
