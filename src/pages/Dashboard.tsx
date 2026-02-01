import { Sidebar } from "@/components/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
