// src/modules/inspection/routes.tsx

import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { inspectionNavigation } from "./navigation";

// Pages
import Dashboard from "./pages/Dashboard";
import MyTasks from "./pages/MyTasks";
import CalendarView from "./pages/CalendarView";

import Schedules from "./pages/Schedules";
import CreateSchedule from "./pages/CreateSchedule";
import ViewSchedule from "./pages/ViewSchedule";
import EditSchedule from "./pages/EditSchedule";

import Templates from "./pages/Templates";
import CreateTemplate from "./pages/CreateTemplate";
import ViewTemplate from "./pages/ViewTemplate";
import EditTemplate from "./pages/EditTemplate";

import Execute from "./pages/Execute";
import Evidence from "./pages/Evidence";

import Reviews from "./pages/Reviews";
import Approvals from "./pages/Approvals";

import Findings from "./pages/Findings";
import ViewFinding from "./pages/ViewFinding";
import EditFinding from "./pages/EditFinding";

import CAPA from "./pages/CAPA";
import ViewCAPA from "./pages/ViewCAPA";
import EditCAPA from "./pages/EditCAPA";

import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";

import Admin from "./pages/Admin";
import UserManagement from "./pages/UserManagement";
import Organization from "./pages/Organization";

import Integrations from "./pages/Integrations";
import PWA from "./pages/PWA";
import Security from "./pages/Security";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const inspectionRoutes = {
  path: "/inspection",
  element: (
    <ModuleLayout
      moduleName="Inspection Management"
      navigation={inspectionNavigation}
      className="p-6"
    />
  ),
  children: [
    // Dashboard
    { index: true, element: <Dashboard /> },
    { path: "dashboard", element: <Dashboard /> },

    // Tasks & Calendar
    { path: "my-tasks", element: <MyTasks /> },
    { path: "calendar", element: <CalendarView /> },

    // Schedules
    { path: "schedules", element: <Schedules /> },
    { path: "schedules/create", element: <CreateSchedule /> },
    { path: "schedules/:id/view", element: <ViewSchedule /> },
    { path: "schedules/:id/edit", element: <EditSchedule /> },

    // Templates
    { path: "templates", element: <Templates /> },
    { path: "templates/create", element: <CreateTemplate /> },
    { path: "templates/:id/view", element: <ViewTemplate /> },
    { path: "templates/:id/edit", element: <EditTemplate /> },

    // Execution
    { path: "execute", element: <Execute /> },
    { path: "execute/:id", element: <Execute /> },
    { path: "evidence", element: <Evidence /> },

    // Reviews & Approvals
    { path: "reviews", element: <Reviews /> },
    { path: "reviews/:id", element: <Reviews /> },
    { path: "approvals", element: <Approvals /> },

    // Findings
    { path: "findings", element: <Findings /> },
    { path: "findings/:id/view", element: <ViewFinding /> },
    { path: "findings/:id/edit", element: <EditFinding /> },

    // CAPA
    { path: "capa", element: <CAPA /> },
    { path: "capa/:id/view", element: <ViewCAPA /> },
    { path: "capa/:id/edit", element: <EditCAPA /> },

    // Analytics & Reports
    { path: "analytics", element: <Analytics /> },
    { path: "reports", element: <Reports /> },

    // Administration
    { path: "admin", element: <Admin /> },
    { path: "admin/users", element: <UserManagement /> },
    { path: "admin/organization", element: <Organization /> },

    // System
    { path: "integrations", element: <Integrations /> },
    { path: "pwa", element: <PWA /> },
    { path: "security", element: <Security /> },
    { path: "help", element: <Help /> },

    { path: "*", element: <NotFound /> },
  ],
};

export default inspectionRoutes;
