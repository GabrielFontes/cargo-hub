import { Sidebar } from "@/components/Sidebar";
import { Brain, BarChart3, ArrowLeftRight, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { DashboardContent } from "@/components/dashboard/DashboardContent";


const Mente = () => {
  const items = [
    { icon: BarChart3, label: "DRE", href: "/mente/dre", description: "Demonstrativo de Resultados" },
    { icon: ArrowLeftRight, label: "Movimentações", href: "/mente/movimentacoes", description: "Entradas e saídas financeiras" },
    { icon: Target, label: "Projeções", href: "/mente/projecoes", description: "Planejamento financeiro futuro" },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 bg-background overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mente</h1>
            <p className="text-muted-foreground">Gestão financeira e planejamento estratégico</p>
          </div>
        </div>

{/*        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{item.label}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>*/}
          <div className="flex min-h-screen w-full">
          <DashboardContent />
        </div>
      </main>
    </div>   
    
  );
};

export default Mente;
