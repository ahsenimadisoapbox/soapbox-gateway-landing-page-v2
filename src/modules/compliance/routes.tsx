// src/modules/compliance/routes.tsx
import { Layout } from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import Obligations from './pages/Obligations';
import Evidence from './pages/Evidence';
import Calendar from './pages/Calendar';
import NonCompliance from './pages/NonCompliance';
import CAPA from './pages/CAPA';
import RegulatoryChanges from './pages/RegulatoryChanges';
import GapAnalysis from './pages/GapAnalysis';
import ComplianceReporting from './pages/ComplianceReporting';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Help from './pages/Help';
import NotFound from './pages/NotFound';

import Frameworks from './pages/Frameworks';
import Domain from './pages/Domain';
import Regulations from './pages/Regulations';
import RegulationClauses from './pages/RegulationClauses';
import ControlMaster from './pages/ControlMaster';

import Tasks from './pages/Tasks';
import TaskAssignmentLog from './pages/TaskAssignmentLog';
import TasksVersionLog from './pages/TasksVersionLog';
import TaskOccurrencesLog from './pages/TaskOccurrencesLog';
import ComplianceTaskOwnerLog from './pages/ComplianceTaskOwnerLog';
import TasksExceptions from './pages/TasksExceptions';

import ObligationSiteMapping from './pages/ObligationSiteMapping';
import AssessmentTemplates from './pages/AssessmentTemplates';
import AssessmentRuns from './pages/AssessmentRuns';
import AssessmentWizard from './pages/AssessmentWizard';
import AssessmentQuestions from './pages/AssessmentQuestions';
import AssessmentResponses from './pages/AssessmentResponses';

import EventTypeMaster from './pages/EventTypeMaster';
import ObligationReportTemplates from './pages/ObligationReportTemplates';
import ObligationClosure from './pages/ObligationClosure';
import ReportVersions from './pages/ReportVersions';
import AuditLogs from './pages/AuditLogs';

// Assessment Workflow Pages
import ObligationDetailPage from './pages/assessment/ObligationDetailPage';
import TemplateSelectionPage from './pages/assessment/TemplateSelectionPage';
import ComplianceAssessmentWizard from './pages/assessment/ComplianceAssessmentWizard';
import AssessmentRunsDashboard from './pages/assessment/AssessmentRunsDashboard';
import AssessmentResultView from './pages/assessment/AssessmentResultView';

const complianceRoutes = {
  path: '/compliance',
  element: <Layout />, // Layout + Provider + Outlet
  children: [
    // Dashboard (default)
    { index: true, element: <Dashboard /> },

    // Masters
    { path: 'event-type-master', element: <EventTypeMaster /> },
    { path: 'frameworks', element: <Frameworks /> },
    { path: 'domain', element: <Domain /> },
    { path: 'regulations', element: <Regulations /> },
    { path: 'regulation-clauses', element: <RegulationClauses /> },
    { path: 'control-master', element: <ControlMaster /> },

    // Obligations & Tasks
    { path: 'obligations', element: <Obligations /> },
    { path: 'obligation-site-mapping', element: <ObligationSiteMapping /> },
    { path: 'tasks', element: <Tasks /> },
    { path: 'task-owner-log', element: <ComplianceTaskOwnerLog /> },
    { path: 'task-assignment-log', element: <TaskAssignmentLog /> },
    { path: 'task-version-log', element: <TasksVersionLog /> },
    { path: 'task-occurrences-log', element: <TaskOccurrencesLog /> },
    { path: 'tasks-exceptions', element: <TasksExceptions /> },

    // Evidence & Calendar
    { path: 'evidence', element: <Evidence /> },
    { path: 'calendar', element: <Calendar /> },

    // Assessments
    { path: 'assessment-templates', element: <AssessmentTemplates /> },
    { path: 'assessment-runs', element: <AssessmentRuns /> },
    { path: 'assessment-wizard', element: <AssessmentWizard /> },
    { path: 'assessment-questions', element: <AssessmentQuestions /> },
    { path: 'assessment-responses', element: <AssessmentResponses /> },

    // New Assessment Workflow
    { path: 'assessment/obligation/:id', element: <ObligationDetailPage /> },
    { path: 'assessment/select-template', element: <TemplateSelectionPage /> },
    { path: 'assessment/wizard', element: <ComplianceAssessmentWizard /> },
    { path: 'assessment/runs', element: <AssessmentRunsDashboard /> },
    { path: 'assessment/result/:runId', element: <AssessmentResultView /> },

    // Compliance Operations
    { path: 'regulatory-changes', element: <RegulatoryChanges /> },
    { path: 'obligation-report-templates', element: <ObligationReportTemplates /> },
    { path: 'obligation-closure', element: <ObligationClosure /> },
    { path: 'report-versions', element: <ReportVersions /> },
    { path: 'audit-logs', element: <AuditLogs /> },

    // Risk & Reporting
    { path: 'non-compliance', element: <NonCompliance /> },
    { path: 'capa', element: <CAPA /> },
    { path: 'gap-analysis', element: <GapAnalysis /> },
    { path: 'compliance-reporting', element: <ComplianceReporting /> },
    { path: 'analytics', element: <Analytics /> },

    // System
    { path: 'settings', element: <Settings /> },
    { path: 'help', element: <Help /> },

    // Module-level 404
    { path: '*', element: <NotFound /> },
  ],
};

export default complianceRoutes;
