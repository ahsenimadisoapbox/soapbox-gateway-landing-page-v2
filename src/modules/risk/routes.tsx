// src/modules/risk/routes.tsx
import { AppLayout } from './components/layout/AppLayout';

// Core pages
import Dashboard from './pages/Dashboard';
import RiskRegister from './pages/RiskRegister';
import CreateRisk from './pages/CreateRisk';
import RiskDetail from './pages/RiskDetail';
import AssessmentWizard from './pages/AssessmentWizard';
import ManagerReview from './pages/ManagerReview';
import MitigationPlan from './pages/MitigationPlan';

// Extended module pages
import Assessments from './pages/Assessments';
import Mitigations from './pages/Mitigations';
import Audits from './pages/Audits';
import ScenarioModeling from './pages/ScenarioModeling';
import RiskAlerts from './pages/RiskAlerts';
import RiskSimulation from './pages/RiskSimulation';
import RiskApproval from './pages/RiskApproval';
import RiskTreatment from './pages/RiskTreatment';
import Reports from './pages/Reports';
import Compliance from './pages/Compliance';
import UserManagement from './pages/UserManagement';
import Settings from './pages/Settings';

import NotFound from './pages/NotFound';

const riskRoutes = {
  path: '/risk',
  element: <AppLayout />,
  children: [
    // Dashboard (default)
    { index: true, element: <Dashboard /> },

    // Risk lifecycle
    { path: 'risks', element: <RiskRegister /> },
    { path: 'risks/new', element: <CreateRisk /> },
    { path: 'risks/:id', element: <RiskDetail /> },
    { path: 'risks/:id/assess', element: <AssessmentWizard /> },
    { path: 'risks/:id/review', element: <ManagerReview /> },
    { path: 'risks/:id/mitigation', element: <MitigationPlan /> },

    // Risk operations
    { path: 'assessments', element: <Assessments /> },
    { path: 'mitigations', element: <Mitigations /> },
    { path: 'audits', element: <Audits /> },

    // Advanced risk intelligence
    { path: 'scenario-modeling', element: <ScenarioModeling /> },
    { path: 'risk-alerts', element: <RiskAlerts /> },
    { path: 'risk-simulation', element: <RiskSimulation /> },
    { path: 'risk-approval', element: <RiskApproval /> },
    { path: 'risk-treatment', element: <RiskTreatment /> },

    // Governance & admin
    { path: 'reports', element: <Reports /> },
    { path: 'compliance', element: <Compliance /> },
    { path: 'users', element: <UserManagement /> },
    { path: 'settings', element: <Settings /> },

    // Module-level 404
    { path: '*', element: <NotFound /> },
  ],
};

export default riskRoutes;
