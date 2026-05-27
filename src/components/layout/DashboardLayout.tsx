import React from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { useLang } from "@/contexts/LanguageContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isRTL } = useLang();

  return (
    <div
      className={cn("flex h-screen overflow-hidden", isRTL ? "flex-row-reverse" : "flex-row")}
      style={{ background: "#080a0f" }}
    >
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
