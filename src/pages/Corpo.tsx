import { Sidebar } from "@/components/Sidebar";
import { CargosContent } from "@/components/CargosContent";

const Corpo = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <CargosContent />
    </div>
  );
};

export default Corpo;
