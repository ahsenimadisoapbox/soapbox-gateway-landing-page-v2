// modules/executive/routes.tsx

import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { ExecutiveProvider, useExecutive } from "./store/ExecutiveContext";
import { executiveNavigation } from "./navigation";

import Index from "./pages/Index";
import BoardViewPage from "./pages/BoardViewPage";
import RiskPage from "./pages/RiskPage";
import CompliancePage from "./pages/CompliancePage";
import IncidentIntelligencePage from "./pages/IncidentIntelligencePage";
import CAPAPage from "./pages/CAPAPage";
import QualityPage from "./pages/QualityPage";
import ESGPage from "./pages/ESGPage";
import AlertsCentrePage from "./pages/AlertsCentrePage";
import ReportsPage from "./pages/ReportsPage";
import BoardPacksPage from "./pages/BoardPacksPage";
import AdministrationPage from "./pages/AdministrationPage";
import SecurityPage from "./pages/SecurityPage";
import HelpPage from "./pages/HelpPage";
import NotFound from "./pages/NotFound";

/* ============================================================
   EXECUTIVE LAYOUT WRAPPER
   This bridges ExecutiveContext → ModuleHeader
============================================================ */

const ExecutiveLayoutWrapper = () => {
  const executive = useExecutive();

  return (
    <ModuleLayout
      moduleName="Executive Console"
      navigation={executiveNavigation}
      headerProps={{
        currentUser: executive.currentUser,
        users: executive.users,
        notifications: executive.notifications,
        sidebarCollapsed: executive.sidebarCollapsed,
        onToggleSidebar: executive.toggleSidebar,
        onSwitchUser: executive.switchUser,
        onMarkNotificationRead: executive.markNotificationRead,
        onMarkAllNotificationsRead:
          executive.markAllNotificationsRead,
      }}
    />
  );
};

/* ============================================================
   ROUTES
============================================================ */

const executiveRoutes = {
  path: "/executive",
  element: (
    <ExecutiveProvider>
      <ExecutiveLayoutWrapper />
    </ExecutiveProvider>
  ),
  children: [
    { index: true, element: <Index /> },
    { path: "board-view", element: <BoardViewPage /> },
    { path: "risk", element: <RiskPage /> },
    { path: "compliance", element: <CompliancePage /> },
    { path: "incident-intelligence", element: <IncidentIntelligencePage /> },
    { path: "capa", element: <CAPAPage /> },
    { path: "quality", element: <QualityPage /> },
    { path: "esg", element: <ESGPage /> },
    { path: "alerts-centre", element: <AlertsCentrePage /> },
    { path: "reports", element: <ReportsPage /> },
    { path: "board-packs", element: <BoardPacksPage /> },
    { path: "administration", element: <AdministrationPage /> },
    { path: "security", element: <SecurityPage /> },
    { path: "help", element: <HelpPage /> },
    { path: "*", element: <NotFound /> },
  ],
};

export default executiveRoutes;
