import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
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
import { ProjecaoItem, FichaTecnicaItem, ResumoReceita } from "./types";
import { FichaTecnicaTab } from "./FichaTecnicaTab";
import { ResumoTab } from "./ResumoTab";
import { Check } from "lucide-react";

interface DespesaOption {
  id: string;
  name: string;
}

interface ProjecaoEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ProjecaoItem | null;
  onSave: (item: ProjecaoItem) => void;
  months: string[];
  type: "despesa" | "receita";
  despesas?: DespesaOption[];
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
  despesas = [],
}: ProjecaoEditDialogProps) {
  const [name, setName] = useState("");
  const [isPrevisto, setIsPrevisto] = useState(true);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [previsto, setPrevisto] = useState<number[]>(Array(12).fill(0));
  const [valores, setValores] = useState<number[]>(Array(12).fill(0));
  const [hasFichaTecnica, setHasFichaTecnica] = useState(false);
  const [fichaTecnica, setFichaTecnica] = useState<FichaTecnicaItem[]>([]);
  const [resumo, setResumo] = useState<ResumoReceita>({
    precoVendaUnidade: 0,
    custoTotalUnitario: 0,
    custoVariavel: 0,
    impostoPercentual: 6,
    impostoValor: 0,
    custoAquisicao: 0,
    margemContribuicaoPercent: 0,
    margemContribuicaoValor: 0,
    lucroMedioPercent: 0,
    lucroMedioValor: 0,
  });

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPrevisto([...(item.previsto || Array(12).fill(0))]);
      setHasFichaTecnica(item.hasFichaTecnica);
      setFichaTecnica(item.fichaTecnica || []);
      
      const key = `valores${selectedYear}` as keyof ProjecaoItem;
      setValores([...((item[key] as number[]) || Array(12).fill(0))]);

      if (item.resumo) setResumo({ ...item.resumo });
    } else {
      setName("");
      setIsPrevisto(true);
      setSelectedYear(CURRENT_YEAR);
      setPrevisto(Array(12).fill(0));
      setValores(Array(12).fill(0));
      setHasFichaTecnica(false);
      setFichaTecnica([]);
    }
  }, [item, open, selectedYear]);

  const handleSave = () => {
    if (!item || !name.trim()) return;

    const updatedItem: ProjecaoItem = {
      ...item,
      name: name.trim(),
      hasFichaTecnica,
      previsto,
      fichaTecnica: hasFichaTecnica ? fichaTecnica : undefined,
      resumo: type === "receita" ? resumo : undefined,
    };

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

  const isReceita = type === "receita";
  const totalValue = (isPrevisto ? previsto : valores).reduce((s, v) => s + v, 0);

  const formContent = (
    <div className="space-y-5">
      {/* Values section */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-xs">
          <span className={isPrevisto ? "text-foreground font-medium" : "text-muted-foreground"}>Previsto</span>
          <Switch
            checked={!isPrevisto}
            onCheckedChange={(checked) => setIsPrevisto(!checked)}
            className="scale-75"
          />
          <span className={!isPrevisto ? "text-foreground font-medium" : "text-muted-foreground"}>Realizado</span>
          {!isPrevisto && (
            <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
              <SelectTrigger className="w-20 h-7 text-xs ml-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="grid grid-cols-6 gap-x-2 gap-y-1.5">
          {months.map((month, idx) => (
            <div key={month} className="space-y-0.5">
              <Label className="text-[10px] text-muted-foreground">{month}</Label>
              <Input
                type="number"
                value={isPrevisto ? previsto[idx] : valores[idx]}
                onChange={(e) => isPrevisto ? updatePrevisto(idx, e.target.value) : updateValor(idx, e.target.value)}
                className="h-7 text-xs border-0 bg-muted/30 shadow-none focus-visible:bg-muted/50"
                step="0.01"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <span className="text-[11px] text-muted-foreground tabular-nums">
            Total: <span className="font-semibold text-foreground">
              R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </span>
        </div>
      </div>

      {/* Ficha Técnica checkbox - only for despesas */}
      {type === "despesa" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="fichaTecnica"
              checked={hasFichaTecnica}
              onCheckedChange={(checked) => {
                setHasFichaTecnica(!!checked);
                if (!checked) setFichaTecnica([]);
              }}
            />
            <label htmlFor="fichaTecnica" className="text-xs font-medium text-foreground cursor-pointer">
              Ficha Técnica
            </label>
          </div>

          {hasFichaTecnica && (
            <FichaTecnicaTab
              items={fichaTecnica}
              onChange={setFichaTecnica}
              despesas={despesas}
              readonly={false}
            />
          )}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isReceita ? 'max-w-4xl' : 'max-w-2xl'} max-h-[80vh] overflow-hidden flex flex-col gap-0 p-0`}>
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full shrink-0 ${type === "despesa" ? "bg-destructive" : "bg-emerald-500"}`} />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Nome da ${type}...`}
              className="border-0 p-0 h-auto text-base font-semibold shadow-none focus-visible:ring-0 bg-transparent"
            />
          </div>
        </div>

        {/* Body */}
        {isReceita ? (
          <div className="flex-1 overflow-hidden flex">
            <div className="flex-1 overflow-y-auto px-5 py-4 border-r border-border">
              {formContent}
            </div>
            <div className="w-[300px] shrink-0 overflow-y-auto px-4 py-4">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Resumo</span>
              <div className="mt-3">
                <ResumoTab resumo={resumo} onChange={setResumo} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {formContent}
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs h-8">
            Cancelar
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!name.trim()} className="text-xs h-8 gap-1.5">
            <Check className="h-3.5 w-3.5" />
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
