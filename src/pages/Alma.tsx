import { Sidebar } from "@/components/Sidebar";
import { Heart, StickyNote, ListTodo, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

const Alma = () => {
  const items = [
    { icon: StickyNote, label: "Anotações", href: "/alma/anotacoes", description: "Notas e lembretes importantes" },
    { icon: ListTodo, label: "Atividades", href: "/alma/atividades", description: "Lista de atividades pendentes", badge: 10 },
    { icon: CheckSquare, label: "Tarefas", href: "/alma/tarefas", description: "Tarefas e checklist", badge: 10 },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <main className="flex-1 p-8 bg-background overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Alma</h1>
            <p className="text-muted-foreground">Organização pessoal e produtividade</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className="group p-6 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-lg transition-all relative"
            >
              {item.badge && (
                <span className="absolute top-4 right-4 min-w-[24px] h-6 px-2 rounded-full text-xs flex items-center justify-center bg-primary text-primary-foreground font-medium">
                  {item.badge}
                </span>
              )}
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-lg font-semibold text-foreground">{item.label}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Alma;
