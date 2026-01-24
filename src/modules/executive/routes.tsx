import { MainLayout } from './components/layout/MainLayout';

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

const executiveRoutes = {
  path: '/executive',
  element: <MainLayout />,
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
