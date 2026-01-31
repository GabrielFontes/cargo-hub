import { Sidebar } from "@/components/Sidebar";
import { IndicadoresContent } from "@/components/indicadores/IndicadoresContent";

const Indicadores = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <IndicadoresContent />
    </div>
  );
};

export default Indicadores;
