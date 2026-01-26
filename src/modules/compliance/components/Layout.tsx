import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Header } from "./Header";
import logo from "@/assets/soapbox-logo.png";

export const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-card flex items-center justify-between px-4 gap-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <img src={logo} alt="Soapbox Cloud" className="h-8" />
            </div>
            <Header />
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
          <footer className="py-4 px-6 border-t text-center text-sm text-muted-foreground">
            © 2025 soapbox.cloud • Version 1.0.0
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
};
