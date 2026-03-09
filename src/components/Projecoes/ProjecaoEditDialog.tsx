import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { PrecosTab } from "./PrecosTab";
import { Check } from "lucide-react";

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
  const [isPrevisto, setIsPrevisto] = useState(true);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [previsto, setPrevisto] = useState<number[]>(Array(12).fill(0));
  const [valores, setValores] = useState<number[]>(Array(12).fill(0));
  const [sazonalidade, setSazonalidade] = useState<{ notas: number[], percentuais: number[] }>({
    notas: Array(12).fill(1),
    percentuais: Array(12).fill(0),
  });
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
      setConta(item.conta || "");
      setPrevisto([...(item.previsto || Array(12).fill(0))]);
      setFichaTecnica(item.fichaTecnica || []);
      
      const key = `valores${selectedYear}` as keyof ProjecaoItem;
      setValores([...((item[key] as number[]) || Array(12).fill(0))]);
      
      if (item.sazonalidade) {
        setSazonalidade({ ...item.sazonalidade });
      } else {
        setSazonalidade({ notas: Array(12).fill(1), percentuais: Array(12).fill(0) });
      }

      if (item.resumo) setResumo({ ...item.resumo });
    } else {
      setName("");
      setConta("");
      setIsPrevisto(true);
      setSelectedYear(CURRENT_YEAR);
      setPrevisto(Array(12).fill(0));
      setValores(Array(12).fill(0));
      setSazonalidade({ notas: Array(12).fill(1), percentuais: Array(12).fill(0) });
      setFichaTecnica([]);
    }
  }, [item, open, selectedYear]);

  const handleSave = () => {
    if (!item || !name.trim()) return;

    const updatedItem: ProjecaoItem = {
      ...item,
      name: name.trim(),
      conta: conta.trim() || undefined,
      hasFichaTecnica: fichaTecnica.length > 0,
      previsto,
      sazonalidade: type === "receita" ? sazonalidade : undefined,
      fichaTecnica: fichaTecnica.length > 0 ? fichaTecnica : undefined,
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

  const updateSazonalidadeNota = (index: number, value: string) => {
    const nota = Math.min(3, Math.max(1, parseInt(value) || 1));
    const newNotas = [...sazonalidade.notas];
    newNotas[index] = nota;
    const total = newNotas.reduce((sum, n) => sum + n, 0);
    const newPercentuais = newNotas.map(n => total > 0 ? (n / total) * 100 : 0);
    setSazonalidade({ notas: newNotas, percentuais: newPercentuais });
  };

  // Build tabs based on type
  const tabs = [
    { id: "valores", label: "Valores" },
    ...(type === "receita" ? [{ id: "sazonalidade", label: "Sazonalidade" }] : []),
    { id: "fichatecnica", label: "Ficha Técnica" },
    ...(type === "receita" ? [{ id: "resumo", label: "Resumo" }] : []),
    ...(type === "despesa" ? [{ id: "precos", label: "Preços" }] : []),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col gap-0 p-0">
        {/* Compact header with name inline */}
        <div className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full shrink-0 ${type === "despesa" ? "bg-destructive" : "bg-emerald-500"}`} />
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={`Nome da ${type}...`}
              className="border-0 p-0 h-auto text-base font-semibold shadow-none focus-visible:ring-0 bg-transparent"
            />
            <Input
              value={conta}
              onChange={(e) => setConta(e.target.value)}
              placeholder="Conta"
              className="border-0 p-0 h-auto text-xs text-muted-foreground shadow-none focus-visible:ring-0 bg-transparent w-28 text-right"
            />
          </div>
        </div>

        <Tabs defaultValue="valores" className="flex-1 overflow-hidden flex flex-col">
          <div className="px-5 pt-2">
            <TabsList className="h-8 bg-muted/40 p-0.5">
              {tabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="text-xs h-7 px-3">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            {/* Valores */}
            <TabsContent value="valores" className="mt-0 space-y-4">
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

              <div className="grid grid-cols-6 gap-2">
                {months.map((month, idx) => (
                  <div key={month} className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">{month}</Label>
                    <Input
                      type="number"
                      value={isPrevisto ? previsto[idx] : valores[idx]}
                      onChange={(e) => isPrevisto ? updatePrevisto(idx, e.target.value) : updateValor(idx, e.target.value)}
                      className="h-8 text-xs"
                      step="0.01"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-1">
                <span className="text-xs text-muted-foreground">
                  Total: <span className="font-semibold text-foreground">
                    R$ {(isPrevisto ? previsto : valores).reduce((s, v) => s + v, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </span>
              </div>
            </TabsContent>

            {/* Sazonalidade */}
            {type === "receita" && (
              <TabsContent value="sazonalidade" className="mt-0 space-y-3">
                <p className="text-xs text-muted-foreground">Nota de 1 a 3 por mês. Percentual calculado automaticamente.</p>
                <div className="grid grid-cols-6 gap-2">
                  {months.map((month, idx) => (
                    <div key={month} className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">{month}</Label>
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          min={1}
                          max={3}
                          value={sazonalidade.notas[idx]}
                          onChange={(e) => updateSazonalidadeNota(idx, e.target.value)}
                          className="h-8 text-xs text-center w-10"
                        />
                        <div className="h-8 flex-1 flex items-center justify-center bg-primary/5 text-primary rounded text-[10px] font-medium">
                          {sazonalidade.percentuais[idx].toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {/* Ficha Técnica */}
            <TabsContent value="fichatecnica" className="mt-0">
              <FichaTecnicaTab
                items={fichaTecnica}
                onChange={setFichaTecnica}
                readonly={false}
              />
            </TabsContent>

            {/* Resumo */}
            {type === "receita" && (
              <TabsContent value="resumo" className="mt-0">
                <ResumoTab resumo={resumo} onChange={setResumo} />
              </TabsContent>
            )}

            {/* Preços */}
            {type === "despesa" && (
              <TabsContent value="precos" className="mt-0">
                <PrecosTab
                  items={item?.precos || []}
                  onChange={(precos) => {
                    if (item) onSave({ ...item, precos });
                  }}
                />
              </TabsContent>
            )}
          </div>
        </Tabs>

        {/* Slim footer */}
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
