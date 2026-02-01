import { Sidebar } from "@/components/Sidebar";
import { CargosContent } from "@/components/CargosContent";

const CorpoCargos = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <CargosContent />
    </div>
  );
};

export default CorpoCargos;
