import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FichaTecnicaItem } from "./types";

interface DespesaOption {
  id: string;
  name: string;
}

interface FichaTecnicaTabProps {
  items: FichaTecnicaItem[];
  onChange: (items: FichaTecnicaItem[]) => void;
  despesas?: DespesaOption[];
  readonly?: boolean;
}

export function FichaTecnicaTab({ items, onChange, despesas = [], readonly = false }: FichaTecnicaTabProps) {
  const addRow = (despesaId: string) => {
    const despesa = despesas.find(d => d.id === despesaId);
    if (!despesa || items.some(i => i.materiaPrima === despesa.name)) return;

    const newItem: FichaTecnicaItem = {
      id: `ft-${Date.now()}`,
      materiaPrima: despesa.name,
      composto: false,
      fixo: false,
      custo: 0,
      unidade: "un",
      medida: "",
      qntReal: 0,
      qnt: 0,
      custoTotal: 0,
    };
    onChange([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof FichaTecnicaItem, value: any) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        newItem.custoTotal = newItem.custo * newItem.qnt;
        return newItem;
      }
      return item;
    });
    onChange(updated);
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.custoTotal, 0);
  const availableDespesas = despesas.filter(d => !items.some(i => i.materiaPrima === d.name));

  return (
    <div className="space-y-3">
      {/* Table header */}
      {items.length > 0 && (
        <div className="grid grid-cols-[1fr_80px_60px_50px_80px_28px] gap-2 px-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Insumo</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-right">Custo</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-right">Qtd</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-center">Un</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-right">Subtotal</span>
          <span></span>
        </div>
      )}

      {/* Rows */}
      {items.map((item) => (
        <div
          key={item.id}
          className="group grid grid-cols-[1fr_80px_60px_50px_80px_28px] gap-2 items-center px-1 py-1.5 rounded-md hover:bg-muted/20 transition-colors"
        >
          <span className="text-xs text-foreground truncate" title={item.materiaPrima}>
            {item.materiaPrima}
          </span>
          <Input
            type="number"
            value={item.custo || ""}
            onChange={(e) => updateItem(item.id, "custo", parseFloat(e.target.value) || 0)}
            className="h-7 text-xs text-right border-0 bg-muted/30 shadow-none focus-visible:bg-muted/50"
            disabled={readonly}
            step="0.01"
          />
          <Input
            type="number"
            value={item.qnt || ""}
            onChange={(e) => updateItem(item.id, "qnt", parseFloat(e.target.value) || 0)}
            className="h-7 text-xs text-right border-0 bg-muted/30 shadow-none focus-visible:bg-muted/50"
            disabled={readonly}
          />
          <Input
            value={item.unidade}
            onChange={(e) => updateItem(item.id, "unidade", e.target.value)}
            className="h-7 text-xs text-center border-0 bg-muted/30 shadow-none focus-visible:bg-muted/50"
            disabled={readonly}
          />
          <span className="text-xs font-medium text-foreground text-right tabular-nums">
            R$ {item.custoTotal.toFixed(2)}
          </span>
          {!readonly && (
            <button
              onClick={() => removeItem(item.id)}
              className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      ))}

      {/* Add from despesas */}
      {!readonly && availableDespesas.length > 0 && (
        <Select onValueChange={addRow}>
          <SelectTrigger className="h-8 text-xs text-muted-foreground border-dashed">
            <SelectValue placeholder="+ Selecionar insumo das despesas..." />
          </SelectTrigger>
          <SelectContent>
            {availableDespesas.map(d => (
              <SelectItem key={d.id} value={d.id} className="text-xs">
                {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {items.length === 0 && !readonly && (
        <p className="text-xs text-muted-foreground text-center py-4">
          Selecione insumos das despesas para compor a ficha técnica
        </p>
      )}

      {/* Total */}
      {items.length > 0 && (
        <div className="flex justify-between items-center pt-2 border-t border-border px-1">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Custo total unitário</span>
          <span className="text-xs font-semibold text-foreground tabular-nums">R$ {total.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
