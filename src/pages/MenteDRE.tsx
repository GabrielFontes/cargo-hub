import { Sidebar } from "@/components/Sidebar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const MenteDRE = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <DashboardContent />
    </div>
  );
};

export default MenteDRE;
