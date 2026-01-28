import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { cn } from '../../lib/utils';

// ✅ NEW imports
import {
  QualityEventsProvider,
  useQualityEvents,
} from '../../contexts/QualityEventsContext';

/* =======================
   INNER LAYOUT
   (uses context hook)
======================= */

function LayoutContent() {
  const { sidebarCollapsed, setSidebarCollapsed } = useQualityEvents();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div
        className={cn(
          'flex-1 flex flex-col min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        )}
      >
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* =======================
   PROVIDER WRAPPER
======================= */

export default function AppLayout() {
  return (
    <QualityEventsProvider>
      <LayoutContent />
    </QualityEventsProvider>
  );
}
