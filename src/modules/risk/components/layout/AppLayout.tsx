import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './AppSidebar';
import { Header } from './Header';
import { getCurrentUser } from '../../lib/storage';
import { mockUsers } from '../../lib/mockData';

export function AppLayout() {
  const [currentUser, setCurrentUser] = useState(() => {
    const stored = getCurrentUser();
    // For demo purposes, default to first user if none selected
    return stored || mockUsers[0];
  });

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header currentUser={currentUser} onUserChange={setCurrentUser} />
          <main className="flex-1 overflow-auto">
            <Outlet context={{ currentUser }} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}