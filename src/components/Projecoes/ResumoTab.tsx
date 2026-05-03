import { Input } from "@/components/ui/input";
import { ResumoReceita } from "./types";

interface ResumoTabProps {
  resumo: ResumoReceita;
  onChange: (resumo: ResumoReceita) => void;
}

function Row({ label, children, highlight }: { label: string; children: React.ReactNode; highlight?: "green" | "amber" }) {
  return (
    <div className={`flex items-center justify-between py-2 px-3 rounded-md ${
      highlight === "green" ? "bg-emerald-500/5" :
      highlight === "amber" ? "bg-amber-500/5" : ""
    }`}>
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}

export function ResumoTab({ resumo, onChange }: ResumoTabProps) {
  const recalc = (r: ResumoReceita): ResumoReceita => {
    const impostoValor = (r.precoVendaUnidade * r.impostoPercentual) / 100;
    const comissaoValor = (r.precoVendaUnidade * r.comissaoPercentual) / 100;
    const custoTotal = r.custoTotalUnitario + r.custoVariavel + impostoValor + r.custoAquisicao + comissaoValor;
    const margemValor = r.precoVendaUnidade - custoTotal;
    const margemPercent = r.precoVendaUnidade > 0 ? (margemValor / r.precoVendaUnidade) * 100 : 0;
    return {
      ...r,
      impostoValor,
      comissaoValor,
      margemContribuicaoValor: margemValor,
      margemContribuicaoPercent: margemPercent,
      lucroMedioValor: margemValor,
      lucroMedioPercent: margemPercent,
    };
  };

  const updateField = (field: keyof ResumoReceita, value: number) => {
    onChange(recalc({ ...resumo, [field]: value }));
  };

  const moneyInput = (field: keyof ResumoReceita) => (
    <>
      <span className="text-[10px] text-muted-foreground">R$</span>
      <Input
        type="number"
        value={(resumo[field] as number) || ""}
        onChange={(e) => updateField(field, parseFloat(e.target.value) || 0)}
        className="h-7 w-24 text-right text-xs border-0 bg-muted/30 shadow-none"
        step="0.01"
      />
    </>
  );

  const pctInput = (pctField: keyof ResumoReceita, valor: number) => (
    <>
      <div className="flex items-center gap-1 bg-muted/30 rounded-md px-2 h-7">
        <Input
          type="number"
          value={(resumo[pctField] as number) || ""}
          onChange={(e) => updateField(pctField, parseFloat(e.target.value) || 0)}
          className="h-5 w-10 text-right text-[10px] border-0 bg-transparent shadow-none p-0"
          step="0.01"
        />
        <span className="text-[10px] text-muted-foreground">%</span>
      </div>
      <span className="text-xs text-muted-foreground tabular-nums w-20 text-right">R$ {valor.toFixed(2)}</span>
    </>
  );

  return (
    <div className="space-y-1">
      <Row label="Preço de venda (un.)">{moneyInput("precoVendaUnidade")}</Row>
      <Row label="CMV unitário">{moneyInput("custoTotalUnitario")}</Row>
      <Row label="(-) Custo variável">{moneyInput("custoVariavel")}</Row>
      <Row label="(-) Imposto">{pctInput("impostoPercentual", resumo.impostoValor)}</Row>
      <Row label="(-) Custo aquisição">{moneyInput("custoAquisicao")}</Row>
      <Row label="(-) Comissão">{pctInput("comissaoPercentual", resumo.comissaoValor)}</Row>

      <div className="border-t border-border my-2" />

      <Row label="Margem de contribuição" highlight="green">
        <span className="text-xs font-medium text-emerald-600">{resumo.margemContribuicaoPercent.toFixed(1)}%</span>
        <span className="text-xs font-semibold tabular-nums">R$ {resumo.margemContribuicaoValor.toFixed(2)}</span>
      </Row>

      <Row label="Lucro líquido por venda" highlight="amber">
        <span className="text-xs font-medium text-amber-600">{resumo.lucroMedioPercent.toFixed(1)}%</span>
        <span className="text-xs font-semibold tabular-nums">R$ {resumo.lucroMedioValor.toFixed(2)}</span>
      </Row>
    </div>
  );
}
