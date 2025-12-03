import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Position {
  id: string;
  name: string;
  quantity: number;
  salary: string;
  phases: string[];
  isActive: boolean;
  avgSalary?: string;
  objective?: string;
}

interface PositionDialogProps {
  position: Position | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const taskTabs = ["Todas", "Pré-Venda", "Venda", "Entrega", "Suporte"];

const mockTasks = [
  "Fluxo XPTO - Atividade 1",
  "Fluxo XPTO - Atividade 2",
  "Fluxo XPTO - Atividade 3",
  "Fluxo XPTO - Atividade 4",
];

export function PositionDialog({ position, open, onOpenChange }: PositionDialogProps) {
  const [activeMainTab, setActiveMainTab] = useState("Tarefas");
  const [activeTaskTab, setActiveTaskTab] = useState("Todas");

  if (!position) return null;

  const mainTabs = ["Tarefas", "Habilidades", `Pessoas (${position.quantity})`];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <div className="flex min-h-[500px]">
          {/* Left Panel */}
          <div className="w-[320px] p-6 border-r border-border bg-card">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground mb-2">{position.name}</h2>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                {position.phases[0]}
              </span>
            </div>

            {/* Stats */}
            <div className="flex gap-2 mb-6">
              <div className="flex-1 p-3 bg-muted rounded-lg text-center">
                <div className="text-lg font-bold text-foreground">{position.quantity}</div>
                <div className="text-xs text-muted-foreground">Pessoa</div>
              </div>
              <div className="flex-1 p-3 bg-muted rounded-lg text-center">
                <div className="text-lg font-bold text-foreground">{position.salary}</div>
                <div className="text-xs text-muted-foreground">Salário Base</div>
              </div>
              <div className="flex-1 p-3 bg-muted rounded-lg text-center">
                <div className="text-lg font-bold text-foreground">{position.avgSalary || "12.000 R$"}</div>
                <div className="text-xs text-muted-foreground">Média Salarial</div>
              </div>
            </div>

            {/* Objective */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Objetivo do cargo</label>
              <textarea
                className="w-full h-48 p-3 bg-muted rounded-lg border-none resize-none text-sm text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Descreva o objetivo do cargo"
                defaultValue={position.objective || ""}
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 p-6">
            {/* Main Tabs */}
            <div className="flex gap-6 border-b border-border mb-6">
              {mainTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMainTab(tab.split(" ")[0])}
                  className={cn(
                    "pb-3 text-sm font-medium transition-colors relative",
                    activeMainTab === tab.split(" ")[0]
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                  {activeMainTab === tab.split(" ")[0] && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {activeMainTab === "Tarefas" && (
              <>
                <h3 className="text-lg font-semibold text-foreground mb-4">Tarefas</h3>
                
                {/* Task Tabs */}
                <div className="flex gap-2 mb-4">
                  {taskTabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTaskTab(tab)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                        activeTaskTab === tab
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tasks List */}
                <div className="bg-muted rounded-lg p-4 mb-6 min-h-[120px]">
                  <ul className="space-y-2">
                    {mockTasks.map((task, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-2">Softskills</h4>
                    <textarea
                      className="w-full h-32 p-3 bg-muted rounded-lg border-none resize-none text-sm text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Descreva"
                    />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-2">Hardskills</h4>
                    <textarea
                      className="w-full h-32 p-3 bg-muted rounded-lg border-none resize-none text-sm text-muted-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Descreva"
                    />
                  </div>
                </div>
              </>
            )}

            {activeMainTab === "Habilidades" && (
              <div className="text-muted-foreground text-sm">Conteúdo de Habilidades...</div>
            )}

            {activeMainTab === "Pessoas" && (
              <div className="text-muted-foreground text-sm">Lista de pessoas no cargo...</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
