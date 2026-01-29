import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { cn } from '../../lib/utils';
import { CalibrationEquipmentProvider, useCalibrationEquipment } from '../../context/CalibrationEquipmentContext';

export function AppLayout() {
  const { sidebarCollapsed } = useCalibrationEquipment();

  return (
    <CalibrationEquipmentProvider>
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
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </CalibrationEquipmentProvider>
  );
}
