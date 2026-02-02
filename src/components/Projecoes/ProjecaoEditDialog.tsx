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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProjecaoItem } from "./types";

interface ProjecaoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ProjecaoItem | null;
  onSave: (item: ProjecaoItem) => void;
  months: string[];
  type: "despesa" | "receita";
}

const YEARS = [2022, 2023, 2024, 2025, 2026];
const CURRENT_YEAR = 2026;

export function ProjecaoEditDialog({
  open,
  onOpenChange,
  item,
  onSave,
  months,
  type,
}: ProjecaoEditDialogProps) {
  const [name, setName] = useState("");
  const [conta, setConta] = useState("");
  const [hasFichaTecnica, setHasFichaTecnica] = useState(false);
  const [isPrevisto, setIsPrevisto] = useState(true); // true = previsto, false = realizado
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [previsto, setPrevisto] = useState<number[]>(Array(12).fill(0));
  const [valores, setValores] = useState<number[]>(Array(12).fill(0));
  const [sazonalidade, setSazonalidade] = useState<{ notas: number[], percentuais: number[] }>({
    notas: Array(12).fill(1),
    percentuais: Array(12).fill(0),
  });

  useEffect(() => {
    if (item) {
      setName(item.name);
      setConta(item.conta || "");
      setHasFichaTecnica(item.hasFichaTecnica);
      setPrevisto([...(item.previsto || Array(12).fill(0))]);
      
      // Load values based on selected year
      const key = `valores${selectedYear}` as keyof ProjecaoItem;
      setValores([...((item[key] as number[]) || Array(12).fill(0))]);
      
      if (item.sazonalidade) {
        setSazonalidade({ ...item.sazonalidade });
      } else {
        setSazonalidade({
          notas: Array(12).fill(1),
          percentuais: Array(12).fill(0),
        });
      }
    } else {
      resetForm();
    }
  }, [item, open, selectedYear]);

  const resetForm = () => {
    setName("");
    setConta("");
    setHasFichaTecnica(false);
    setIsPrevisto(true);
    setSelectedYear(CURRENT_YEAR);
    setPrevisto(Array(12).fill(0));
    setValores(Array(12).fill(0));
    setSazonalidade({
      notas: Array(12).fill(1),
      percentuais: Array(12).fill(0),
    });
  };

  const handleSave = () => {
    if (!item || !name.trim()) return;

    const updatedItem: ProjecaoItem = {
      ...item,
      name: name.trim(),
      conta: conta.trim() || undefined,
      hasFichaTecnica,
      previsto,
      sazonalidade: type === "receita" ? sazonalidade : undefined,
    };

    // Update valores for selected year if in realizado mode
    if (!isPrevisto) {
      const key = `valores${selectedYear}` as keyof ProjecaoItem;
      (updatedItem as any)[key] = valores;
    }

    onSave(updatedItem);
    onOpenChange(false);
  };

  const updatePrevisto = (index: number, value: string) => {
    const newPrevisto = [...previsto];
    newPrevisto[index] = parseFloat(value) || 0;
    setPrevisto(newPrevisto);
  };

  const updateValor = (index: number, value: string) => {
    const newValores = [...valores];
    newValores[index] = parseFloat(value) || 0;
    setValores(newValores);
  };

  const updateSazonalidadeNota = (index: number, value: string) => {
    const nota = Math.min(3, Math.max(1, parseInt(value) || 1));
    const newNotas = [...sazonalidade.notas];
    newNotas[index] = nota;
    
    // Recalculate percentages
    const total = newNotas.reduce((sum, n) => sum + n, 0);
    const newPercentuais = newNotas.map(n => total > 0 ? (n / total) * 100 : 0);
    
    setSazonalidade({ notas: newNotas, percentuais: newPercentuais });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Editar {type === "despesa" ? "Despesa" : "Receita"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic fields */}
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="conta">Conta (Plano de Contas)</Label>
              <Input
                id="conta"
                value={conta}
                onChange={(e) => setConta(e.target.value)}
                placeholder="Ex: 3.1.01.001"
              />
            </div>
          </div>

          {/* Checkbox for ficha técnica */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="fichaTecnica"
              checked={hasFichaTecnica}
              onCheckedChange={(checked) => setHasFichaTecnica(checked as boolean)}
            />
            <Label htmlFor="fichaTecnica" className="text-sm">
              Possui Ficha Técnica
            </Label>
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

          {/* Monthly values */}
          <div className="space-y-2">
            <Label>
              {isPrevisto 
                ? `Valores Previstos (${CURRENT_YEAR})` 
                : `Valores Realizados (${selectedYear})`
              }
              {type === "despesa" && !isPrevisto && (
                <span className="text-xs text-muted-foreground ml-2">
                  (Preços são lançados no painel lateral)
                </span>
              )}
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
                    step="0.01"
                    disabled={type === "despesa" && !isPrevisto}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Sazonalidade (only for receitas) */}
          {type === "receita" && (
            <div className="space-y-2">
              <Label>Sazonalidade</Label>
              <p className="text-xs text-muted-foreground">
                Defina uma nota de 1 a 3 para cada mês. O percentual é calculado automaticamente.
              </p>
              <div className="grid grid-cols-4 gap-2">
                {months.map((month, idx) => (
                  <div key={month} className="space-y-1">
                    <Label className="text-xs text-muted-foreground">{month}</Label>
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        min={1}
                        max={3}
                        value={sazonalidade.notas[idx]}
                        onChange={(e) => updateSazonalidadeNota(idx, e.target.value)}
                        className="h-8 w-14"
                      />
                      <div className="h-8 flex-1 flex items-center justify-center bg-muted rounded text-xs font-medium">
                        {sazonalidade.percentuais[idx].toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
