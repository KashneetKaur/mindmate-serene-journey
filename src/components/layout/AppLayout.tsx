
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 pl-20 lg:pl-64 min-h-screen">
        <div className="container max-w-6xl py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
