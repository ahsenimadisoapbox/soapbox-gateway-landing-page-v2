import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';
import { Footer } from './Footer';
import { ValidationProvider } from '../../context/ValidationContext';

export const MainLayout: React.FC = () => {
  return (
    <ValidationProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <TopNavbar />
          <main className="flex-1 overflow-auto p-6 bg-background">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </ValidationProvider>
  );
};
