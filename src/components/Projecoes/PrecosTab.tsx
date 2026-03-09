import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PrecoItem } from "./types";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const YEARS = [2024, 2025, 2026];

interface PrecosTabProps {
  items: PrecoItem[];
  onChange: (items: PrecoItem[]) => void;
}

export function PrecosTab({ items, onChange }: PrecosTabProps) {
  const [newPreco, setNewPreco] = useState({ mes: 0, ano: 2026, valor: 0, descricao: "" });

  const addPreco = () => {
    if (newPreco.valor <= 0) return;
    const item: PrecoItem = { id: `preco-${Date.now()}`, ...newPreco };
    onChange([...items, item]);
    setNewPreco({ mes: 0, ano: 2026, valor: 0, descricao: "" });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addPreco();
  };

  const sortedItems = [...items].sort((a, b) => a.ano !== b.ano ? b.ano - a.ano : b.mes - a.mes);

  return (
    <div className="space-y-4">
      {/* Inline add row */}
      <div className="flex items-end gap-2">
        <div className="space-y-1 w-20">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Mês</label>
          <Select value={newPreco.mes.toString()} onValueChange={(v) => setNewPreco(p => ({ ...p, mes: parseInt(v) }))}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTHS.map((m, i) => <SelectItem key={i} value={i.toString()}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 w-20">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Ano</label>
          <Select value={newPreco.ano.toString()} onValueChange={(v) => setNewPreco(p => ({ ...p, ano: parseInt(v) }))}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEARS.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1 flex-1">
          <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Valor (R$)</label>
          <Input
            type="number"
            value={newPreco.valor || ""}
            onChange={(e) => setNewPreco(p => ({ ...p, valor: parseFloat(e.target.value) || 0 }))}
            onKeyDown={handleKeyDown}
            className="h-8 text-xs"
            step="0.01"
            placeholder="0,00"
          />
        </div>
        <button
          onClick={addPreco}
          disabled={newPreco.valor <= 0}
          className="h-8 w-8 shrink-0 flex items-center justify-center rounded-md bg-primary text-primary-foreground disabled:opacity-40 hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* List */}
      {sortedItems.length === 0 ? (
        <p className="text-xs text-muted-foreground py-6 text-center">Nenhum preço lançado</p>
      ) : (
        <div className="space-y-1">
          {sortedItems.map((item) => (
            <div key={item.id} className="group flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-16">{MONTHS[item.mes]} {item.ano}</span>
                <span className="text-xs font-medium">R$ {item.valor.toFixed(2)}</span>
                {item.descricao && <span className="text-[10px] text-muted-foreground">· {item.descricao}</span>}
              </div>
              <button
                onClick={() => onChange(items.filter(i => i.id !== item.id))}
                className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
