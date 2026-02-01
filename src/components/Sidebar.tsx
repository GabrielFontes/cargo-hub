import { Brain, BarChart3, ArrowLeftRight, Target, Heart, Briefcase, GitBranch, TrendingUp, StickyNote, ListTodo, CheckSquare, ChevronDown, ChevronRight, Home, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

interface MenuSection {
  id: string;
  title: string;
  icon: React.ElementType;
  href: string;
  items: MenuItem[];
}

const menuSections: MenuSection[] = [
  {
    id: "mente",
    title: "Mente",
    icon: Brain,
    href: "/mente",
    items: [
      { icon: BarChart3, label: "DRE", href: "/mente/dre" },
      { icon: ArrowLeftRight, label: "Movimentações", href: "/mente/movimentacoes" },
      { icon: Target, label: "Projeções", href: "/mente/projecoes" },
    ],
  },
  {
    id: "corpo",
    title: "Corpo",
    icon: GitBranch,
    href: "/corpo",
    items: [
      { icon: Briefcase, label: "Cargos", href: "/corpo/cargos", badge: 5 },
      { icon: GitBranch, label: "Fluxos", href: "/corpo/fluxos" },
      { icon: TrendingUp, label: "Indicadores", href: "/corpo/indicadores" },
    ],
  },
  {
    id: "alma",
    title: "Alma",
    icon: Heart,
    href: "/alma",
    items: [
      { icon: StickyNote, label: "Anotações", href: "/alma/anotacoes" },
      { icon: ListTodo, label: "Atividades", href: "/alma/atividades", badge: 10 },
      { icon: CheckSquare, label: "Tarefas", href: "/alma/tarefas", badge: 10 },
    ],
  },
];

interface SidebarProps {
  activePage?: string;
}

export function Sidebar({ activePage }: SidebarProps) {
  const location = useLocation();
  
  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const isSectionActive = (section: MenuSection) => {
    return location.pathname.startsWith(section.href.split('/')[1] ? `/${section.href.split('/')[1]}` : section.href);
  };

  const isInSection = (section: MenuSection) => {
    const sectionPath = `/${section.id}`;
    return location.pathname === sectionPath || location.pathname.startsWith(`${sectionPath}/`);
  };

  return (
    <aside className="w-[260px] h-screen bg-sidebar border-r border-sidebar-border flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <h1 className="font-semibold text-foreground text-base">FiO Hub</h1>
          <p className="text-xs text-muted-foreground truncate">Empresa de corpo, mente e a...</p>
        </div>
        <button className="text-muted-foreground hover:text-foreground">
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Home Link */}
      <div className="px-3 py-1">
        <Link
          to="/"
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
            location.pathname === "/" 
              ? "text-foreground font-medium" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto scrollbar-thin">
        {menuSections.map((section) => {
          const sectionActive = isInSection(section);
          
          return (
            <div key={section.id} className="mb-1">
              {/* Section Header - Now a Link */}
              <Link
                to={section.href}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                  sectionActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <section.icon className={cn(
                  "w-4 h-4",
                  sectionActive ? "text-sidebar-accent-foreground" : "text-primary"
                )} />
                <span className="flex-1 text-left">{section.title}</span>
              </Link>
              
              {/* Sub-items - Only show when in this section */}
              {sectionActive && (
                <div className="pl-4 mt-1">
                  <ul className="space-y-0.5 border-l-2 border-border pl-3">
                    {section.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <li key={item.label}>
                          <Link
                            to={item.href}
                            className={cn(
                              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                              active
                                ? "text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            <item.icon className={cn(
                              "w-4 h-4",
                              active ? "text-primary" : "text-muted-foreground"
                            )} />
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className="min-w-[20px] h-5 px-1.5 rounded-md text-xs flex items-center justify-center bg-primary text-primary-foreground">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border flex items-center justify-between">
        <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" />
          <span className="text-xs uppercase tracking-wide">Minimizar</span>
        </button>
        <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground">
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
