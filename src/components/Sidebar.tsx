import { Brain, BarChart3, ArrowLeftRight, Target, Heart, Briefcase, GitBranch, TrendingUp, StickyNote, Calendar, Workflow, FolderKanban, CheckSquare, Bell, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: number;
}

interface MenuSection {
  title: string;
  icon: React.ElementType;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    title: "Mente",
    icon: Brain,
    items: [
      { icon: BarChart3, label: "DRE" },
      { icon: ArrowLeftRight, label: "Movimentações" },
      { icon: Target, label: "Projeções" },
    ],
  },
  {
    title: "Corpo",
    icon: Heart,
    items: [
      { icon: Briefcase, label: "Cargos", active: true, badge: 0 },
      { icon: GitBranch, label: "Fluxos" },
      { icon: TrendingUp, label: "Indicadores" },
    ],
  },
  {
    title: "Alma",
    icon: Heart,
    items: [
      { icon: StickyNote, label: "Notas" },
      { icon: Calendar, label: "Rotinas", badge: 0 },
      { icon: Workflow, label: "Processos", badge: 0 },
      { icon: FolderKanban, label: "Projetos", badge: 0 },
      { icon: CheckSquare, label: "Tarefas", badge: 0 },
    ],
  },
];

export function Sidebar() {
  return (
    <aside className="w-[280px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-foreground text-base">FiO Hub</h1>
          <p className="text-xs text-muted-foreground">mente e alma</p>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <ChevronLeft className="w-4 h-4 rotate-90" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-thin">
        {menuSections.map((section) => (
          <div key={section.title} className="mb-4">
            <div className="flex items-center gap-2 px-3 py-2">
              <section.icon className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground text-sm">{section.title}</span>
            </div>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.label}>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      item.active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-muted"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", item.active ? "text-sidebar-accent-foreground" : "text-primary")} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={cn(
                        "w-5 h-5 rounded-full text-xs flex items-center justify-center",
                        item.active 
                          ? "bg-primary-foreground text-primary" 
                          : "bg-primary text-primary-foreground"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border flex items-center justify-between">
        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
}
