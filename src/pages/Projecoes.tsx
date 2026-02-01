import { Sidebar } from "@/components/Sidebar";
import { ProjecoesContent } from "@/components/Projecoes/ProjecoesContent";

const Projecoes = () => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <ProjecoesContent />
    </div>
  );
};

export default Projecoes;
