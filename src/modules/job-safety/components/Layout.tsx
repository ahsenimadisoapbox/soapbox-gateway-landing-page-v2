import { ReactNode } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNav } from "@/components/TopNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          <TopNav />
          <main className="flex-1 p-6">
            {children}
          </main>
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            soapbox.cloud © 2025 - Version 1.0.0
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
