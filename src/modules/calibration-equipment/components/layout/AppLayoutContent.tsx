import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '../../lib/utils';
import { useCalibrationEquipment } from '../../context/CalibrationEquipmentContext';
import '../../styles/index.css';

export function AppLayoutContent() {
  const { sidebarCollapsed } = useCalibrationEquipment();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex w-full">
        <Sidebar />
        <main
          className={cn(
            "flex-1 min-h-[calc(100vh-3.5rem)] transition-all duration-200",
            sidebarCollapsed ? "ml-0" : "ml-0"
          )}
        >
          <div className="p-6">
            {/* ✅ Correct place for routed pages */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
