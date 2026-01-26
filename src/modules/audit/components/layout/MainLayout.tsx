import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { AuditProvider } from '../../contexts/AuditContext';

export const MainLayout = () => {
  return (
    <AuditProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />

        <div className="ml-64 min-h-screen flex flex-col">
          <Header />

          <main className="flex-1">
            <div className="container mx-auto p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AuditProvider>
  );
};
