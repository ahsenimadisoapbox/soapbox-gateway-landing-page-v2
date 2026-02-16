// src/modules/non-compliance/routes.tsx

import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { NCRProvider } from "./context/NCRContext";
import { nonComplianceNavigation } from "./navigation";
import './styles/Style.css';

// Pages
import Dashboard from "./pages/Dashboard";
import CreateNCR from "./pages/CreateNCR";
import DraftNCRList from "./pages/DraftNCRList";
import NCRReviewValidation from "./pages/NCRReviewValidation";
import RCAWorkspace from "./pages/RCAWorkspace";
import CAPAList from "./pages/CAPAList";
import VerificationClosure from "./pages/VerificationClosure";
import NCRGlobalRegister from "./pages/NCRGlobalRegister";
import NCRDetail from "./pages/NCRDetail";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import Settings from "./pages/Settings";
import Security from "./pages/Security";
import HelpTraining from "./pages/HelpTraining";
import NotFound from "./pages/NotFound";

const nonComplianceRoutes = {
  path: "/non-compliance",
  element: (
    <NCRProvider>
      <ModuleLayout
        moduleName="Non-Compliance (NCR)"
        navigation={nonComplianceNavigation}
      />
    </NCRProvider>
  ),
  children: [
    // Dashboard
    { index: true, element: <Dashboard /> },

    // NCR Lifecycle
    { path: "create-ncr", element: <CreateNCR /> },
    { path: "drafts", element: <DraftNCRList /> },
    { path: "review", element: <NCRReviewValidation /> },
    { path: "rca", element: <RCAWorkspace /> },
    { path: "capa", element: <CAPAList /> },
    { path: "verification", element: <VerificationClosure /> },

    // Registers
    { path: "register", element: <NCRGlobalRegister /> },
    { path: "ncr-detail/:id", element: <NCRDetail /> },

    // Reports & System
    { path: "reports", element: <ReportsAnalytics /> },
    { path: "settings", element: <Settings /> },
    { path: "security", element: <Security /> },
    { path: "help", element: <HelpTraining /> },

    { path: "*", element: <NotFound /> },
  ],
};

export default nonComplianceRoutes;
