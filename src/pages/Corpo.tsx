import { Sidebar } from "@/components/Sidebar";
import { GitBranch, Briefcase, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { IndicadoresDash } from "@/components/dashboard/Indicadores";
import { RateCard } from "@/components/Indicadores/RateCard";
import { Calendar, Search, ShoppingCart, Truck, Headphones } from "lucide-react";


const Corpo = () => {
  const items = [
    { icon: Briefcase, label: "Cargos", href: "/corpo/cargos", description: "Gestão de cargos e funções", badge: 5 },
    { icon: GitBranch, label: "Fluxos", href: "/corpo/fluxos", description: "Processos e workflows" },
    { icon: TrendingUp, label: "Indicadores", href: "/corpo/indicadores", description: "Métricas e KPIs operacionais" },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 bg-background overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Corpo</h1>
            <p className="text-muted-foreground">Estrutura organizacional e operações</p>
          </div>
        </div>

      {/* Row 1: Rate Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <RateCard
            title="Taxa de Descoberta"
            rate={50}
            icon={Search}
            color="discovery"
          />
          <RateCard
            title="Taxa de Venda"
            rate={54}
            icon={ShoppingCart}
            color="sales"
          />
          <RateCard
            title="Taxa de Entrega"
            rate={85}
            icon={Truck}
            color="delivery"
          />
          <RateCard
            title="Taxa de Eficiência"
            rate={105}
            icon={Headphones}
            color="efficiency"
          />
        </div>

        <div className="flex min-h-screen w-full">
          <IndicadoresDash />
        </div>

      </main>
    </div>
  );
};

export default Corpo;
