import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Phone, Mail, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Actor {
  id: string;
  name: string;
  avatar: string;
  salary: string;
  phone: string;
  email: string;
  positions: string[];
  isOnline?: boolean;
}

interface ActorDialogProps {
  actor: Actor | null;
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

const mockSkills = [
  "Tal coisa",
  "Tal coisa 2",
  "Outra coisa qualquer",
  "Mais uma coisa",
];

export function ActorDialog({ actor, open, onOpenChange }: ActorDialogProps) {
  const [activeMainTab, setActiveMainTab] = useState("Tarefas");
  const [activeTaskTab, setActiveTaskTab] = useState("Todas");

  if (!actor) return null;

  const mainTabs = ["Tarefas", "Habilidades"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <div className="flex min-h-[500px]">
          {/* Left Panel */}
          <div className="w-[320px] p-6 border-r border-border bg-card">
            <div className="flex flex-col items-center mb-6">
              <div className="relative mb-4">
                <img
                  src={actor.avatar}
                  alt={actor.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                {actor.isOnline && (
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-card" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-foreground">{actor.name}</h2>
            </div>

            {/* Salary */}
            <div className="flex justify-center mb-6">
              <div className="px-6 py-3 border border-border rounded-lg text-center">
                <div className="text-2xl font-bold text-foreground">{actor.salary}</div>
                <div className="text-xs text-muted-foreground">salario</div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Phone</span>
                </div>
                <span className="text-sm text-foreground">{actor.phone}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </div>
                <span className="text-sm text-foreground">{actor.email}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Cargo(s)</span>
                </div>
                <Select defaultValue={actor.positions[0]}>
                  <SelectTrigger className="w-[160px] h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {actor.positions.map((pos) => (
                      <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex-1 p-6">
            {/* Main Tabs */}
            <div className="flex gap-6 border-b border-border mb-6">
              {mainTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveMainTab(tab)}
                  className={cn(
                    "pb-3 text-sm font-medium transition-colors relative",
                    activeMainTab === tab
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab}
                  {activeMainTab === tab && (
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
                    <div className="bg-muted rounded-lg p-4 min-h-[120px]">
                      <ul className="space-y-2">
                        {mockSkills.map((skill, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-foreground mb-2">Hardskills</h4>
                    <div className="bg-muted rounded-lg p-4 min-h-[120px]">
                      <ul className="space-y-2">
                        {mockSkills.map((skill, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeMainTab === "Habilidades" && (
              <div className="text-muted-foreground text-sm">Conteúdo de Habilidades detalhado...</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
