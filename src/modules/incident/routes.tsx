// src/modules/incident/routes.tsx

import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { incidentNavigation } from "./navigation";

// Pages
import Dashboard from "./pages/Dashboard";
import NewIncident from "./pages/NewIncident";
import IncidentDetails from "./pages/IncidentDetails";
import SLAMonitoring from "./pages/SLAMonitoring";
import Notifications from "./pages/Notifications";
import Assignment from "./pages/Assignment";
import Reports from "./pages/Reports";
import Templates from "./pages/Templates";
import IntegrationManagement from "./pages/IntegrationManagement";
import RootCauseAnalysis from "./pages/RootCauseAnalysis";
import SummaryExport from "./pages/SummaryExport";
import BulkImport from "./pages/BulkImport";
import NearMiss from "./pages/NearMiss";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const incidentRoutes = {
  path: "/incident",
  element: (
    <ModuleLayout
      moduleName="Incident Management"
      navigation={incidentNavigation}
      className="p-8"
    />
  ),
  children: [
    { index: true, element: <Dashboard /> },

    // Incident Management
    { path: "incidents/new", element: <NewIncident /> },
    { path: "incidents/:id", element: <IncidentDetails /> },
    { path: "incidents/assignment", element: <Assignment /> },
    { path: "near-miss", element: <NearMiss /> },

    // Monitoring
    { path: "sla-monitoring", element: <SLAMonitoring /> },
    { path: "notifications", element: <Notifications /> },

    // Analysis
    { path: "rca", element: <RootCauseAnalysis /> },
    { path: "reports", element: <Reports /> },
    { path: "export", element: <SummaryExport /> },

    // Templates & Integrations
    { path: "templates", element: <Templates /> },
    { path: "integrations", element: <IntegrationManagement /> },
    { path: "import", element: <BulkImport /> },

    // System
    { path: "settings", element: <Settings /> },

    { path: "*", element: <NotFound /> },
  ],
};

export default incidentRoutes;
