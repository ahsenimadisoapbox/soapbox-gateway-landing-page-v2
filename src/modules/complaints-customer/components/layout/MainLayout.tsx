import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ComplaintsCustomerProvider } from '../../context/ComplaintsCustomerContext';
import { useComplaintsCustomer } from '../../context/ComplaintsCustomerContext';
import { cn } from '../../lib/utils';
import '../../styles/index.css';

function MainLayoutContent() {
  const { sidebarCollapsed } = useComplaintsCustomer();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'pl-16' : 'pl-64'
        )}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export function MainLayout() {
  return (
    <ComplaintsCustomerProvider>
      <MainLayoutContent />
    </ComplaintsCustomerProvider>
  );
}
