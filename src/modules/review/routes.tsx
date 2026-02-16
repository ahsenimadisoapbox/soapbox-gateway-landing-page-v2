import { ModuleLayout } from "@/components/layout/ModuleLayout";
import { reviewNavigation } from "./navigation";

// Pages
import { Dashboard } from "./pages/Dashboard";
import { Actions } from "./pages/Actions";
import { Attendance } from "./pages/Attendance";
import { CAPA } from "./pages/CAPA";
import { Decisions } from "./pages/Decisions";
import { Reviews } from "./pages/Reviews";
import { ReviewCalendar } from "./pages/ReviewCalendar";
import { ISOInputs } from "./pages/ISOInputs";
import { Reports } from "./pages/Reports";
import { Security } from "./pages/Security";
import { Settings } from "./pages/Settings";
import { Help } from "./pages/Help";
import NotFound from "./pages/NotFound";
import { ReviewProvider } from "./contexts/ReviewContext";

const reviewRoutes = {
  path: "/review",
  element: (
    <ReviewProvider>
    <ModuleLayout
      moduleName="Management Review"
      navigation={reviewNavigation}
      className="p-6"
    />
    </ReviewProvider>
  ),
  children: [
    { index: true, element: <Dashboard /> },

    // Review Execution
    { path: "reviews", element: <Reviews /> },
    { path: "iso-inputs", element: <ISOInputs /> },
    { path: "decisions", element: <Decisions /> },

    // Actions & CAPA
    { path: "actions", element: <Actions /> },
    { path: "capa", element: <CAPA /> },

    // Monitoring
    { path: "attendance", element: <Attendance /> },
    { path: "reports", element: <Reports /> },
    { path: "calendar", element: <ReviewCalendar /> },

    // System
    { path: "settings", element: <Settings /> },
    { path: "security", element: <Security /> },
    { path: "help", element: <Help /> },

    { path: "*", element: <NotFound /> },
  ],
};

export default reviewRoutes;
