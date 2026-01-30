import { Outlet } from "react-router-dom";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";

export function Layout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          <TopNav />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            soapbox.cloud © 2025 - Version 1.0.0
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
