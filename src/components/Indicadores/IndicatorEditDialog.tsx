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

interface IndicatorData {
  name: string;
  previsto: number[];
  realizado2022: number[];
  realizado2023: number[];
  realizado2024: number[];
  realizado2025: number[];
  realizado2026: number[];
}

interface IndicatorEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  indicator: IndicatorData | null;
  onSave: (indicator: IndicatorData) => void;
  months: string[];
}

export function IndicatorEditDialog({
  open,
  onOpenChange,
  indicator,
  onSave,
  months,
}: IndicatorEditDialogProps) {
  const [name, setName] = useState("");
  const [previsto, setPrevisto] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    if (indicator) {
      setName(indicator.name);
      setPrevisto([...indicator.previsto]);
    } else {
      setName("");
      setPrevisto(Array(12).fill(0));
    }
  }, [indicator, open]);

  const handleSave = () => {
    if (!name.trim()) return;

    const newIndicator: IndicatorData = {
      name: name.trim(),
      previsto,
      realizado2022: indicator?.realizado2022 || Array(12).fill(0),
      realizado2023: indicator?.realizado2023 || Array(12).fill(0),
      realizado2024: indicator?.realizado2024 || Array(12).fill(0),
      realizado2025: indicator?.realizado2025 || Array(12).fill(0),
      realizado2026: indicator?.realizado2026 || Array(12).fill(0),
    };

    onSave(newIndicator);
    onOpenChange(false);
  };

  const updatePrevisto = (index: number, value: string) => {
    const newPrevisto = [...previsto];
    newPrevisto[index] = parseInt(value) || 0;
    setPrevisto(newPrevisto);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {indicator ? "Editar Indicador" : "Novo Indicador"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Indicador</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do indicador"
            />
          </div>

          <div className="space-y-2">
            <Label>Valores Previstos por Mês</Label>
            <div className="grid grid-cols-4 gap-2">
              {months.map((month, idx) => (
                <div key={month} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{month}</Label>
                  <Input
                    type="number"
                    value={previsto[idx]}
                    onChange={(e) => updatePrevisto(idx, e.target.value)}
                    className="h-8"
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
