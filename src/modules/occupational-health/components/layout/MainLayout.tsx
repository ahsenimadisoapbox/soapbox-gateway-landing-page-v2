import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { cn } from '../../lib/utils';
import {
  OccupationalHealthProvider,
  useOccupationalHealth,
} from '../../contexts/OccupationalContext';
import '../../styles/index.css';
import '../../styles/Style.css';

/* =======================
   INTERNAL LAYOUT
   (Hook-safe)
======================= */

function MainLayoutContent() {
  const { sidebarCollapsed } = useOccupationalHealth();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />

      <main
        className={cn(
          'pt-14 min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer
        className={cn(
          'fixed bottom-0 right-0 h-8 bg-card border-t flex items-center justify-center text-xs text-muted-foreground transition-all duration-300',
          sidebarCollapsed ? 'left-16' : 'left-64'
        )}
      >
        <span>soapbox.cloud © 2025 | v1.0.0</span>
      </footer>
    </div>
  );
}

/* =======================
   EXPORTED LAYOUT
======================= */

export function MainLayout() {
  return (
    <OccupationalHealthProvider>
      <MainLayoutContent />
    </OccupationalHealthProvider>
  );
}
