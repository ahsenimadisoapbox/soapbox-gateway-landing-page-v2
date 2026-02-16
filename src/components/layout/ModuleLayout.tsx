import { Outlet } from "react-router-dom";
import { cn } from "../../lib/utils";
import { ModuleHeader } from "./ModuleHeader";
import { ModuleSidebar, NavSection } from "./ModuleSidebar";
import "./styles.css";

interface ModuleLayoutProps {
  className?: string;

  moduleName: string;
  navigation: NavSection[];

  headerProps?: React.ComponentProps<typeof ModuleHeader>;
}

export const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  className,
  moduleName,
  navigation,
  headerProps,
}) => {
  return (
    <div className="min-h-screen bg-background flex w-full">
      <ModuleSidebar navigation={navigation} moduleName={moduleName} />

      <div className="flex flex-col flex-1 min-h-screen">
        <ModuleHeader {...headerProps} />

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
  );
};

export default ModuleLayout;
