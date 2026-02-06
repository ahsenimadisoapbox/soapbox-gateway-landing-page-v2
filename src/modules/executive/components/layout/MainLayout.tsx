import { Outlet } from "react-router-dom";
import { cn } from '../../lib/utils';
import { ExecutiveProvider } from "../../store/ExecutiveContext";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import "./styles.css";
import "../../styles/index.css";
import "../../styles/style.css";

interface MainLayoutProps {
  className?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ className }) => {
  return (
    <ExecutiveProvider>
      <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      <div className="flex flex-col flex-1 min-h-screen">
        <Header />
        <main
          className={cn(
            "flex-1 overflow-auto transition-all duration-300",
            className
          )}
        >
          <Outlet />
        </main>
      </div>
    </div>
    </ExecutiveProvider>
  );
}

export default MainLayout;
