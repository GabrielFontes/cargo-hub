import { Input } from "@/components/ui/input";
import { ResumoReceita } from "./types";

interface ResumoTabProps {
  resumo: ResumoReceita;
  onChange: (resumo: ResumoReceita) => void;
}

function Row({ label, children, highlight }: { label: string; children: React.ReactNode; highlight?: "green" | "amber" }) {
  return (
    <div className={`flex items-center justify-between py-2.5 px-3 rounded-md ${
      highlight === "green" ? "bg-emerald-500/5" : 
      highlight === "amber" ? "bg-amber-500/5" : ""
    }`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}

export function ResumoTab({ resumo, onChange }: ResumoTabProps) {
  const updateField = (field: keyof ResumoReceita, value: number) => {
    const newResumo = { ...resumo, [field]: value };
    
    if (field === "impostoPercentual") {
      newResumo.impostoValor = (newResumo.precoVendaUnidade * value) / 100;
    }
    
    const custoTotal = newResumo.custoTotalUnitario + newResumo.custoVariavel + newResumo.impostoValor + newResumo.custoAquisicao;
    const margemValor = newResumo.precoVendaUnidade - custoTotal;
    const margemPercent = newResumo.precoVendaUnidade > 0 ? (margemValor / newResumo.precoVendaUnidade) * 100 : 0;
    
    newResumo.margemContribuicaoValor = margemValor;
    newResumo.margemContribuicaoPercent = margemPercent;
    newResumo.lucroMedioValor = margemValor;
    newResumo.lucroMedioPercent = margemPercent;
    
    onChange(newResumo);
  };

  return (
    <div className="space-y-1">
      <Row label="Preço de venda (un.)">
        <span className="text-[10px] text-muted-foreground">R$</span>
        <Input
          type="number"
          value={resumo.precoVendaUnidade}
          onChange={(e) => updateField("precoVendaUnidade", parseFloat(e.target.value) || 0)}
          className="h-7 w-24 text-right text-xs font-medium border-0 bg-muted/30 shadow-none"
          step="0.01"
        />
      </Row>

      <Row label="Custo unitário (produto)">
        <span className="text-[10px] text-muted-foreground">R$</span>
        <Input
          type="number"
          value={resumo.custoTotalUnitario}
          onChange={(e) => updateField("custoTotalUnitario", parseFloat(e.target.value) || 0)}
          className="h-7 w-24 text-right text-xs border-0 bg-muted/30 shadow-none"
          step="0.01"
        />
      </Row>

      <Row label="(-) Custo variável">
        <span className="text-[10px] text-muted-foreground">R$</span>
        <Input
          type="number"
          value={resumo.custoVariavel}
          onChange={(e) => updateField("custoVariavel", parseFloat(e.target.value) || 0)}
          className="h-7 w-24 text-right text-xs border-0 bg-muted/30 shadow-none"
          step="0.01"
        />
      </Row>

      <Row label="(-) Imposto">
        <div className="flex items-center gap-1.5 bg-muted/30 rounded-md px-2 h-7">
          <Input
            type="number"
            value={resumo.impostoPercentual}
            onChange={(e) => updateField("impostoPercentual", parseFloat(e.target.value) || 0)}
            className="h-5 w-10 text-right text-[10px] border-0 bg-transparent shadow-none p-0"
            step="0.01"
          />
          <span className="text-[10px] text-muted-foreground">%</span>
        </div>
        <span className="text-xs text-muted-foreground">R$ {resumo.impostoValor.toFixed(2)}</span>
      </Row>

      <Row label="(-) Custo aquisição">
        <span className="text-[10px] text-muted-foreground">R$</span>
        <Input
          type="number"
          value={resumo.custoAquisicao}
          onChange={(e) => updateField("custoAquisicao", parseFloat(e.target.value) || 0)}
          className="h-7 w-24 text-right text-xs border-0 bg-muted/30 shadow-none"
          step="0.01"
        />
      </Row>

      <div className="border-t border-border my-2" />

      <Row label="Margem de contribuição" highlight="green">
        <span className="text-xs font-medium text-emerald-600">{resumo.margemContribuicaoPercent.toFixed(1)}%</span>
        <span className="text-xs font-semibold">R$ {resumo.margemContribuicaoValor.toFixed(2)}</span>
      </Row>

      <Row label="Lucro médio por venda" highlight="amber">
        <span className="text-xs font-medium text-amber-600">{resumo.lucroMedioPercent.toFixed(1)}%</span>
        <span className="text-xs font-semibold">R$ {resumo.lucroMedioValor.toFixed(2)}</span>
      </Row>
    </div>
  );
}
