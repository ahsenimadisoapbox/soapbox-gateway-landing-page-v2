import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { AuditProvider } from "./contexts/AuditContext";
import { auditNavigation } from "./navigation";

// Pages
import Dashboard from "./pages/Dashboard";
import AuditPlanning from "./pages/AuditPlanning";
import Checklists from "./pages/Checklists";
import Findings from "./pages/Findings";
import CAPA from "./pages/CAPA";
import Reports from "./pages/Reports";
import NotificationsEscalations from "./pages/NotificationsEscalations";
import Auditors from "./pages/Auditors";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const auditRoutes = {
  path: "/audit",
  element: (
    <AuditProvider>
      <ModuleLayout
        moduleName="Audit Management"
        navigation={auditNavigation}
        className="p-6"
      />
    </AuditProvider>
  ),
  children: [
    { index: true, element: <Dashboard /> },

    { path: "planning", element: <AuditPlanning /> },
    { path: "checklists", element: <Checklists /> },
    { path: "findings", element: <Findings /> },
    { path: "capa", element: <CAPA /> },

    { path: "reports", element: <Reports /> },

    { path: "notifications", element: <NotificationsEscalations /> },
    { path: "escalations", element: <NotificationsEscalations /> },

    { path: "auditors", element: <Auditors /> },
    { path: "admin", element: <Admin /> },

    { path: "settings", element: <Settings /> },

    { path: "*", element: <NotFound /> },
  ],
};

export default auditRoutes;
