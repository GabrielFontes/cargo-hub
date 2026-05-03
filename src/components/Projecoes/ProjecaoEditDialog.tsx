import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ProjecaoItem, FichaTecnicaItem, ResumoReceita } from "./types";
import { FichaTecnicaTab } from "./FichaTecnicaTab";
import { ResumoTab } from "./ResumoTab";
import { Check } from "lucide-react";

interface DespesaOption {
  id: string; name: string;
  precoMedio?: number; medida?: string; faixaMin?: number; faixaMax?: number;
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
const MEDIDAS_RECEITA = ["Atendimento", "Sessão", "Procedimento", "Hora", "Pacote", "Mensalidade"];
const MEDIDAS_DESPESA = ["un", "ml", "g", "tubete", "envelope", "par", "kit", "caixa", "pacote"];

const defaultResumo = (): ResumoReceita => ({
  precoVendaUnidade: 0, custoTotalUnitario: 0, custoVariavel: 0,
  impostoPercentual: 6, impostoValor: 0, custoAquisicao: 0,
  comissaoPercentual: 0, comissaoValor: 0,
  margemContribuicaoPercent: 0, margemContribuicaoValor: 0,
  lucroMedioPercent: 0, lucroMedioValor: 0,
});

export function ProjecaoEditDialog({
  open, onOpenChange, item, onSave, months, type, despesas = [],
}: ProjecaoEditDialogProps) {
  const [name, setName] = useState("");
  const [isPrevisto, setIsPrevisto] = useState(true);
  const [selectedYear, setSelectedYear] = useState(CURRENT_YEAR);
  const [previsto, setPrevisto] = useState<number[]>(Array(12).fill(0));
  const [valores, setValores] = useState<number[]>(Array(12).fill(0));
  const [qtdProj, setQtdProj] = useState<number[]>(Array(12).fill(0));
  const [qtdReal, setQtdReal] = useState<number[]>(Array(12).fill(0));
  const [hasFichaTecnica, setHasFichaTecnica] = useState(false);
  const [fichaTecnica, setFichaTecnica] = useState<FichaTecnicaItem[]>([]);
  const [resumo, setResumo] = useState<ResumoReceita>(defaultResumo());

  // Receita meta
  const [precoUnitario, setPrecoUnitario] = useState(0);
  const [medida, setMedida] = useState("Atendimento");
  const [cmv, setCmv] = useState(0);
  const [impostoPercent, setImpostoPercent] = useState(0);
  const [variavelPercent, setVariavelPercent] = useState(0);
  const [comissaoPercent, setComissaoPercent] = useState(0);

  // Despesa meta
  const [faixaMin, setFaixaMin] = useState(0);
  const [faixaMax, setFaixaMax] = useState(0);
  const [precoMedio, setPrecoMedio] = useState(0);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setPrevisto([...(item.previsto || Array(12).fill(0))]);
      setHasFichaTecnica(item.hasFichaTecnica);
      setFichaTecnica(item.fichaTecnica || []);
      setQtdProj([...(item.qtdProj || Array(12).fill(0))]);
      setQtdReal([...(item.qtdReal || Array(12).fill(0))]);

      const key = `valores${selectedYear}` as keyof ProjecaoItem;
      setValores([...((item[key] as number[]) || Array(12).fill(0))]);

      setResumo(item.resumo ? { ...item.resumo } : defaultResumo());

      setPrecoUnitario(item.precoUnitario || 0);
      setMedida(item.medida || (type === "receita" ? "Atendimento" : "un"));
      setCmv(item.cmv || 0);
      setImpostoPercent(item.impostoPercent || 0);
      setVariavelPercent(item.variavelPercent || 0);
      setComissaoPercent(item.comissaoPercent || 0);

      setFaixaMin(item.faixaMin || 0);
      setFaixaMax(item.faixaMax || 0);
      setPrecoMedio(item.precoMedio || 0);
    } else {
      setName(""); setIsPrevisto(true); setSelectedYear(CURRENT_YEAR);
      setPrevisto(Array(12).fill(0)); setValores(Array(12).fill(0));
      setQtdProj(Array(12).fill(0)); setQtdReal(Array(12).fill(0));
      setHasFichaTecnica(false); setFichaTecnica([]);
      setResumo(defaultResumo());
    }
  }, [item, open, selectedYear]);

  const handleSave = () => {
    if (!item || !name.trim()) return;
    const updated: ProjecaoItem = {
      ...item,
      name: name.trim(),
      hasFichaTecnica,
      previsto,
      qtdProj, qtdReal,
      fichaTecnica: hasFichaTecnica ? fichaTecnica : undefined,
      resumo: type === "receita" ? resumo : undefined,
      precoUnitario: type === "receita" ? precoUnitario : undefined,
      medida,
      cmv: type === "receita" ? cmv : undefined,
      impostoPercent: type === "receita" ? impostoPercent : undefined,
      variavelPercent: type === "receita" ? variavelPercent : undefined,
      comissaoPercent: type === "receita" ? comissaoPercent : undefined,
      faixaMin: type === "despesa" ? faixaMin : undefined,
      faixaMax: type === "despesa" ? faixaMax : undefined,
      precoMedio: type === "despesa" ? precoMedio : undefined,
    };
    if (!isPrevisto) {
      const key = `valores${selectedYear}` as keyof ProjecaoItem;
      (updated as any)[key] = valores;
    }
    onSave(updated);
    onOpenChange(false);
  };

  const updArr = (setter: (v: number[]) => void, arr: number[], idx: number, value: string) => {
    const next = [...arr]; next[idx] = parseFloat(value) || 0; setter(next);
  };

  const isReceita = type === "receita";
  const totalQtd = qtdProj.reduce((s, v) => s + v, 0);
  const totalValor = isReceita
    ? qtdProj.reduce((s, v) => s + v * precoUnitario, 0)
    : qtdProj.reduce((s, v) => s + v * precoMedio, 0);

  // ==== Receita: campos meta ====
  const metaReceita = (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-3 space-y-1">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Preço unit. (R$)</Label>
        <Input type="number" value={precoUnitario || ""} onChange={(e) => setPrecoUnitario(parseFloat(e.target.value) || 0)}
          className="h-7 text-xs" step="0.01" />
      </div>
      <div className="col-span-3 space-y-1">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Medida</Label>
        <Select value={medida} onValueChange={setMedida}>
          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{MEDIDAS_RECEITA.map(m => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="col-span-2 space-y-1">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">% Imposto</Label>
        <Input type="number" value={impostoPercent || ""} onChange={(e) => setImpostoPercent(parseFloat(e.target.value) || 0)} className="h-7 text-xs" />
      </div>
      <div className="col-span-2 space-y-1">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">% Variável</Label>
        <Input type="number" value={variavelPercent || ""} onChange={(e) => setVariavelPercent(parseFloat(e.target.value) || 0)} className="h-7 text-xs" />
      </div>
      <div className="col-span-2 space-y-1">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">% Comissão</Label>
        <Input type="number" value={comissaoPercent || ""} onChange={(e) => setComissaoPercent(parseFloat(e.target.value) || 0)} className="h-7 text-xs" />
      </div>
    </div>
  );

  const metaDespesa = (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-3 space-y-1">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Medida</Label>
        <Select value={medida} onValueChange={setMedida}>
          <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
          <SelectContent>{MEDIDAS_DESPESA.map(m => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className="col-span-3 space-y-1">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Faixa mín. (R$)</Label>
        <Input type="number" value={faixaMin || ""} onChange={(e) => setFaixaMin(parseFloat(e.target.value) || 0)} className="h-7 text-xs" step="0.01" />
      </div>
      <div className="col-span-3 space-y-1">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Faixa máx. (R$)</Label>
        <Input type="number" value={faixaMax || ""} onChange={(e) => setFaixaMax(parseFloat(e.target.value) || 0)} className="h-7 text-xs" step="0.01" />
      </div>
      <div className="col-span-3 space-y-1">
        <Label className="text-[10px] text-muted-foreground uppercase tracking-wider">Preço médio (R$)</Label>
        <Input type="number" value={precoMedio || ""} onChange={(e) => setPrecoMedio(parseFloat(e.target.value) || 0)} className="h-7 text-xs" step="0.01" />
      </div>
    </div>
  );

  const qtyMatrix = (
    <div className="space-y-2">
      <div className="flex items-center gap-3 text-xs">
        <span className={isPrevisto ? "text-foreground font-medium" : "text-muted-foreground"}>Projetado</span>
        <Switch checked={!isPrevisto} onCheckedChange={(c) => setIsPrevisto(!c)} className="scale-75" />
        <span className={!isPrevisto ? "text-foreground font-medium" : "text-muted-foreground"}>Realizado</span>
        {!isPrevisto && (
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-20 h-7 text-xs ml-auto"><SelectValue /></SelectTrigger>
            <SelectContent>{YEARS.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}</SelectContent>
          </Select>
        )}
        <span className="text-[10px] text-muted-foreground ml-auto">
          Qtd anual: <span className="font-semibold text-foreground">{totalQtd}</span> · Total: <span className="font-semibold text-foreground">R$ {totalValor.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
        </span>
      </div>

      <div className="grid grid-cols-6 gap-x-2 gap-y-1.5">
        {months.map((month, idx) => (
          <div key={month} className="space-y-0.5">
            <Label className="text-[10px] text-muted-foreground">{month}</Label>
            <Input
              type="number"
              value={isPrevisto ? qtdProj[idx] : qtdReal[idx]}
              onChange={(e) => isPrevisto
                ? updArr(setQtdProj, qtdProj, idx, e.target.value)
                : updArr(setQtdReal, qtdReal, idx, e.target.value)}
              className="h-7 text-xs border-0 bg-muted/30 shadow-none focus-visible:bg-muted/50"
              step="1"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const fichaSection = (
    <div className="space-y-3 pt-3 border-t border-border">
      <div className="flex items-center gap-2">
        <Checkbox
          id="fichaTecnica"
          checked={hasFichaTecnica}
          onCheckedChange={(c) => { setHasFichaTecnica(!!c); if (!c) setFichaTecnica([]); }}
        />
        <label htmlFor="fichaTecnica" className="text-xs font-medium text-foreground cursor-pointer">
          Ficha Técnica
        </label>
      </div>
      {hasFichaTecnica && (
        <FichaTecnicaTab items={fichaTecnica} onChange={setFichaTecnica} despesas={despesas} />
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isReceita ? 'max-w-5xl' : 'max-w-3xl'} max-h-[85vh] overflow-hidden flex flex-col gap-0 p-0`}>
        <div className="px-5 pt-5 pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full shrink-0 ${type === "despesa" ? "bg-destructive" : "bg-emerald-500"}`} />
            <Input value={name} onChange={(e) => setName(e.target.value)}
              placeholder={`Nome da ${type}...`}
              className="border-0 p-0 h-auto text-base font-semibold shadow-none focus-visible:ring-0 bg-transparent" />
          </div>
        </div>

        {isReceita ? (
          <div className="flex-1 overflow-hidden flex">
            <div className="flex-1 overflow-y-auto px-5 py-4 border-r border-border space-y-4">
              {metaReceita}
              {qtyMatrix}
              {fichaSection}
            </div>
            <div className="w-[320px] shrink-0 overflow-y-auto px-4 py-4 bg-muted/10">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Resumo</span>
              <div className="mt-3"><ResumoTab resumo={resumo} onChange={setResumo} /></div>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
            {metaDespesa}
            {qtyMatrix}
            {fichaSection}
          </div>
        )}

        <div className="px-5 py-3 border-t border-border flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)} className="text-xs h-8">Cancelar</Button>
          <Button size="sm" onClick={handleSave} disabled={!name.trim()} className="text-xs h-8 gap-1.5">
            <Check className="h-3.5 w-3.5" /> Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
