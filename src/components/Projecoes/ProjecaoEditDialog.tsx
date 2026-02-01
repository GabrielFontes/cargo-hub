import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjecaoItem } from "./ProjecaoHeatmap";

interface ProjecaoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ProjecaoItem | null;
  onSave: (item: ProjecaoItem) => void;
  months: string[];
  type: "despesa" | "receita";
}

export function ProjecaoEditDialog({
  open,
  onOpenChange,
  item,
  onSave,
  months,
  type,
}: ProjecaoEditDialogProps) {
  const [name, setName] = useState("");
  const [valores2026, setValores2026] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    if (item) {
      setName(item.name);
      setValores2026([...item.valores2026]);
    } else {
      setName("");
      setValores2026(Array(12).fill(0));
    }
  }, [item, open]);

  const handleSave = () => {
    if (!item || !name.trim()) return;

    const updatedItem: ProjecaoItem = {
      ...item,
      name: name.trim(),
      valores2026,
    };

    onSave(updatedItem);
    onOpenChange(false);
  };

  const updateValor = (index: number, value: string) => {
    const newValores = [...valores2026];
    newValores[index] = parseFloat(value) || 0;
    setValores2026(newValores);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Editar {type === "despesa" ? "Despesa" : "Receita"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Nome da ${type}`}
            />
          </div>

          <div className="space-y-2">
            <Label>Valores por Mês (2026)</Label>
            <div className="grid grid-cols-4 gap-2">
              {months.map((month, idx) => (
                <div key={month} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{month}</Label>
                  <Input
                    type="number"
                    value={valores2026[idx]}
                    onChange={(e) => updateValor(idx, e.target.value)}
                    className="h-8"
                    step="0.01"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
