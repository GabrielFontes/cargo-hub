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
import { Plus, Trash2 } from "lucide-react";

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
      setHasFichaTecnica(item.hasFichaTecnica);
      setPrevisto([...(item.previsto || Array(12).fill(0))]);
      setFichaTecnica(item.fichaTecnica || []);
      
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

      if (item.resumo) {
        setResumo({ ...item.resumo });
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
    setFichaTecnica([]);
    setResumo({
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

  const updateSazonalidadeNota = (index: number, value: string) => {
    const nota = Math.min(3, Math.max(1, parseInt(value) || 1));
    const newNotas = [...sazonalidade.notas];
    newNotas[index] = nota;
    
    const total = newNotas.reduce((sum, n) => sum + n, 0);
    const newPercentuais = newNotas.map(n => total > 0 ? (n / total) * 100 : 0);
    
    setSazonalidade({ notas: newNotas, percentuais: newPercentuais });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${type === "despesa" ? "bg-rose-500" : "bg-emerald-500"}`} />
            Editar {type === "despesa" ? "Despesa" : "Receita"}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="geral" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="flex-shrink-0 w-full justify-start">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="valores">Valores</TabsTrigger>
            {type === "receita" && (
              <TabsTrigger value="sazonalidade">Sazonalidade</TabsTrigger>
            )}
            {hasFichaTecnica && (
              <TabsTrigger value="fichaTecnica">Ficha Técnica</TabsTrigger>
            )}
            {type === "receita" && (
              <TabsTrigger value="resumo">Resumo</TabsTrigger>
            )}
            {type === "despesa" && (
              <TabsTrigger value="precos">Preços</TabsTrigger>
            )}
          </TabsList>

          <div className="flex-1 overflow-y-auto py-4">
            {/* Tab: Geral */}
            <TabsContent value="geral" className="mt-0 space-y-4">
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

              <div className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg">
                <Checkbox
                  id="fichaTecnica"
                  checked={hasFichaTecnica}
                  onCheckedChange={(checked) => setHasFichaTecnica(checked as boolean)}
                />
                <Label htmlFor="fichaTecnica" className="text-sm cursor-pointer">
                  Possui Ficha Técnica
                </Label>
              </div>
            </TabsContent>

            {/* Tab: Valores */}
            <TabsContent value="valores" className="mt-0 space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Label className="text-sm font-medium">Modo:</Label>
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
                <Label className="text-sm font-medium">
                  {isPrevisto 
                    ? `Valores Previstos (${CURRENT_YEAR})` 
                    : `Valores Realizados (${selectedYear})`
                  }
                </Label>
                <div className="grid grid-cols-4 gap-3">
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
                        className="h-9"
                        step="0.01"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab: Sazonalidade (only for receitas) */}
            {type === "receita" && (
              <TabsContent value="sazonalidade" className="mt-0 space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Defina uma nota de 1 a 3 para cada mês. O percentual é calculado automaticamente.
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {months.map((month, idx) => (
                    <div key={month} className="space-y-1.5 p-3 bg-muted/20 rounded-lg">
                      <Label className="text-xs font-medium">{month}</Label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min={1}
                          max={3}
                          value={sazonalidade.notas[idx]}
                          onChange={(e) => updateSazonalidadeNota(idx, e.target.value)}
                          className="h-8 w-16 text-center"
                        />
                        <div className="h-8 flex-1 flex items-center justify-center bg-primary/10 text-primary rounded text-xs font-semibold">
                          {sazonalidade.percentuais[idx].toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {/* Tab: Ficha Técnica */}
            {hasFichaTecnica && (
              <TabsContent value="fichaTecnica" className="mt-0">
                <FichaTecnicaTab
                  items={fichaTecnica}
                  onChange={setFichaTecnica}
                  readonly={false}
                />
              </TabsContent>
            )}

            {/* Tab: Resumo (only for receitas) */}
            {type === "receita" && (
              <TabsContent value="resumo" className="mt-0">
                <ResumoTab
                  resumo={resumo}
                  onChange={setResumo}
                />
              </TabsContent>
            )}

            {/* Tab: Preços (only for despesas) */}
            {type === "despesa" && (
              <TabsContent value="precos" className="mt-0">
                <PrecosTab
                  items={item?.precos || []}
                  onChange={(precos) => {
                    if (item) {
                      onSave({ ...item, precos });
                    }
                  }}
                />
              </TabsContent>
            )}
          </div>
        </Tabs>

        <DialogFooter className="flex-shrink-0 pt-4 border-t">
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
