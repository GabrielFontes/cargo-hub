import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FichaTecnicaItem } from "./types";

interface FichaTecnicaTabProps {
  items: FichaTecnicaItem[];
  onChange: (items: FichaTecnicaItem[]) => void;
  readonly?: boolean;
}

export function FichaTecnicaTab({ items, onChange, readonly = false }: FichaTecnicaTabProps) {
  const addRow = () => {
    const newItem: FichaTecnicaItem = {
      id: `ft-${Date.now()}`,
      materiaPrima: "",
      composto: false,
      fixo: false,
      custo: 0,
      unidade: "",
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

  return (
    <div className="space-y-3">
      {items.length === 0 && !readonly && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">Nenhum insumo adicionado</p>
          <p className="text-xs mt-1">Adicione matérias-primas para compor a ficha técnica</p>
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} className="group relative grid grid-cols-12 gap-2 items-end p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
          {/* Name - spans 4 cols */}
          <div className="col-span-4 space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Insumo</label>
            <Input
              value={item.materiaPrima}
              onChange={(e) => updateItem(item.id, "materiaPrima", e.target.value)}
              className="h-8 text-xs"
              disabled={readonly}
              placeholder="Nome do insumo"
            />
          </div>

          {/* Unit cost */}
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Custo (R$)</label>
            <Input
              type="number"
              value={item.custo || ""}
              onChange={(e) => updateItem(item.id, "custo", parseFloat(e.target.value) || 0)}
              className="h-8 text-xs"
              disabled={readonly}
              step="0.01"
              placeholder="0,00"
            />
          </div>

          {/* Quantity */}
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Qtd.</label>
            <Input
              type="number"
              value={item.qnt || ""}
              onChange={(e) => updateItem(item.id, "qnt", parseFloat(e.target.value) || 0)}
              className="h-8 text-xs"
              disabled={readonly}
              placeholder="0"
            />
          </div>

          {/* Unit */}
          <div className="col-span-1 space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Un.</label>
            <Input
              value={item.unidade}
              onChange={(e) => updateItem(item.id, "unidade", e.target.value)}
              className="h-8 text-xs text-center"
              disabled={readonly}
              placeholder="un"
            />
          </div>

          {/* Total */}
          <div className="col-span-2 space-y-1">
            <label className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</label>
            <div className="h-8 flex items-center text-xs font-medium text-foreground bg-muted/40 rounded-md px-2">
              R$ {item.custoTotal.toFixed(2)}
            </div>
          </div>

          {/* Remove */}
          {!readonly && (
            <div className="col-span-1 flex justify-end">
              <button
                onClick={() => removeItem(item.id)}
                className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      ))}

      {!readonly && (
        <button
          onClick={addRow}
          className="w-full h-9 border border-dashed border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Adicionar insumo
        </button>
      )}

      {items.length > 0 && (
        <div className="flex justify-end pt-2 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Total: <span className="font-semibold text-foreground">R$ {total.toFixed(2)}</span>
          </span>
        </div>
      )}
    </div>
  );
}
