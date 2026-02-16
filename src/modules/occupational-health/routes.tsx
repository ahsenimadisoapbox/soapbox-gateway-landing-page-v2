// src/modules/occupational-health/routes.tsx

import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { occupationalHealthNavigation } from "./navigation";

// If you have provider later:
import { OccupationalHealthProvider } from "./contexts/OccupationalContext";

// Pages
import Dashboard from "./pages/Dashboard";
import EmployeeHealthRecords from "./pages/EmployeeHealthRecords";
import PMEExams from "./pages/PMEExams";
import ClinicOperations from "./pages/ClinicOperations";
import OccupationalIllness from "./pages/OccupationalIllness";
import ExposureMonitoring from "./pages/ExposureMonitoring";
import ReturnToWork from "./pages/ReturnToWork";
import WellnessPrograms from "./pages/WellnessPrograms";
import ReportsAnalytics from "./pages/ReportsAnalytics";
import Notifications from "./pages/Notifications";
import Integrations from "./pages/Integrations";
import MasterData from "./pages/MasterData";
import Administration from "./pages/Administration";
import HelpTraining from "./pages/HelpTraining";
import NotFound from "./pages/NotFound";

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="space-y-6 p-6 animate-fade-in">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-muted-foreground">
      This page is under development.
    </p>
  </div>
);

const occupationalHealthRoutes = {
  path: "/occupational-health",
  element: (
    <OccupationalHealthProvider>
      <ModuleLayout
        moduleName="Occupational Health"
        navigation={occupationalHealthNavigation}
        className="p-6"
      />
    </OccupationalHealthProvider>
  ),
  children: [
    { index: true, element: <Dashboard /> },

    // Core Health Modules
    { path: "ehr", element: <EmployeeHealthRecords /> },
    { path: "exams", element: <PMEExams /> },
    { path: "clinic", element: <ClinicOperations /> },
    { path: "illness", element: <OccupationalIllness /> },
    { path: "exposure", element: <ExposureMonitoring /> },
    { path: "rtw", element: <ReturnToWork /> },
    { path: "wellness", element: <WellnessPrograms /> },

    // Reports & Notifications
    { path: "reports", element: <ReportsAnalytics /> },
    { path: "notifications", element: <Notifications /> },

    // Integrations & Master Data
    { path: "integrations", element: <Integrations /> },
    { path: "master-data", element: <MasterData /> },

    // Administration
    { path: "admin", element: <Administration /> },
    { path: "security", element: <PlaceholderPage title="Security" /> },
    { path: "help", element: <HelpTraining /> },

    { path: "*", element: <NotFound /> },
  ],
};

export default occupationalHealthRoutes;
