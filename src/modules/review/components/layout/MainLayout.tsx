import { Outlet } from "react-router-dom";
import { ReviewProvider } from "../../contexts/ReviewContext";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";

export function MainLayout() {
  return (
    <ReviewProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav />
          <main className="flex-1 p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </ReviewProvider>
  );
}
