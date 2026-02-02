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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const YEARS = [2022, 2023, 2024, 2025, 2026];
const CURRENT_YEAR = 2026;

export function IndicatorEditDialog({
  open,
  onOpenChange,
  indicator,
  onSave,
  months,
}: IndicatorEditDialogProps) {
  const [name, setName] = useState("");
  const [isPrevisto, setIsPrevisto] = useState(true); // true = previsto, false = realizado
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [previsto, setPrevisto] = useState<number[]>(Array(12).fill(0));
  const [valores, setValores] = useState<number[]>(Array(12).fill(0));

  useEffect(() => {
    if (indicator) {
      setName(indicator.name);
      setPrevisto([...indicator.previsto]);
      
      // Load values based on selected year
      const key = `realizado${selectedYear}` as keyof IndicatorData;
      setValores([...((indicator[key] as number[]) || Array(12).fill(0))]);
    } else {
      resetForm();
    }
  }, [indicator, open, selectedYear]);

  const resetForm = () => {
    setName("");
    setIsPrevisto(true);
    setSelectedYear(CURRENT_YEAR);
    setPrevisto(Array(12).fill(0));
    setValores(Array(12).fill(0));
  };

  const handleSave = () => {
    if (!name.trim()) return;

    const newIndicator: IndicatorData = {
      name: name.trim(),
      previsto: isPrevisto ? previsto : (indicator?.previsto || Array(12).fill(0)),
      realizado2022: indicator?.realizado2022 || Array(12).fill(0),
      realizado2023: indicator?.realizado2023 || Array(12).fill(0),
      realizado2024: indicator?.realizado2024 || Array(12).fill(0),
      realizado2025: indicator?.realizado2025 || Array(12).fill(0),
      realizado2026: indicator?.realizado2026 || Array(12).fill(0),
    };

    // Update previsto if in previsto mode
    if (isPrevisto) {
      newIndicator.previsto = previsto;
    }

    // Update realizado for selected year if in realizado mode
    if (!isPrevisto) {
      const key = `realizado${selectedYear}` as keyof IndicatorData;
      (newIndicator as any)[key] = valores;
    }

    onSave(newIndicator);
    onOpenChange(false);
  };

  const updatePrevisto = (index: number, value: string) => {
    const newPrevisto = [...previsto];
    newPrevisto[index] = parseInt(value) || 0;
    setPrevisto(newPrevisto);
  };

  const updateValor = (index: number, value: string) => {
    const newValores = [...valores];
    newValores[index] = parseInt(value) || 0;
    setValores(newValores);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {indicator ? "Editar Indicador" : "Novo Indicador"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Indicador</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do indicador"
            />
          </div>

          {/* Toggle Previsto / Realizado */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Label className="text-sm font-medium">Modo de Edição:</Label>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${isPrevisto ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  Previsto
                </span>
                <Switch
                  checked={!isPrevisto}
                  onCheckedChange={(checked) => setIsPrevisto(!checked)}
                />
                <span className={`text-sm ${!isPrevisto ? "text-primary font-medium" : "text-muted-foreground"}`}>
                  Realizado
                </span>
              </div>
            </div>

            {!isPrevisto && (
              <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>
              {isPrevisto 
                ? `Valores Previstos (${CURRENT_YEAR})` 
                : `Valores Realizados (${selectedYear})`
              }
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {months.map((month, idx) => (
                <div key={month} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">{month}</Label>
                  <Input
                    type="number"
                    value={isPrevisto ? previsto[idx] : valores[idx]}
                    onChange={(e) => isPrevisto 
                      ? updatePrevisto(idx, e.target.value)
                      : updateValor(idx, e.target.value)
                    }
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
