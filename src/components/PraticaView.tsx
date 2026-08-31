import { useState } from "react";
import type { Atividade, Pratica } from "@/lib/curriculo";
import type { Contexto } from "@/lib/praticas";

export function atividadeTexto(rotulo: string, a: Atividade) {
  return [
    `${rotulo}: ${a.titulo}`,
    a.materiais ? `Materiais: ${a.materiais}` : "",
    a.etapas.map((e, i) => `${i + 1}. ${e}`).join("\n"),
  ]
    .filter(Boolean)
    .join("\n");
}

export function toTexto(p: Pratica) {
  return [
    p.titulo,
    `Habilidade ${p.codigo}: ${p.habilidade}`,
    `Resumo: ${p.resumo}`,
    `Conexão PCN × Computação: ${p.conexao}`,
    `Objetivo: ${p.objetivo}`,
    `Recursos: ${p.recursos}`,
    `Etapas:\n${p.etapas.map((e, i) => `${i + 1}. ${e}`).join("\n")}`,
    atividadeTexto("Prática plugada", p.plugada),
    atividadeTexto("Prática desplugada", p.desplugadaAtividade),
    `Avaliação: ${p.avaliacao}`,
  ].join("\n\n");
}

function AtividadeCard({
  rotulo,
  atividade,
  destaque = false,
}: {
  rotulo: string;
  atividade: Atividade;
  destaque?: boolean;
}) {
  if (!atividade.titulo && atividade.etapas.length === 0) return null;
  return (
    <div
      className={`rounded-2xl border p-4 ${
        destaque ? "border-aurora/30 bg-aurora/[0.06]" : "border-white/10 bg-ink-soft/50"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.14em] ${
          destaque ? "text-aurora" : "text-mist/50"
        }`}
      >
        {rotulo}
      </p>
      <p className="mt-2 font-display text-base font-bold text-white">{atividade.titulo}</p>
      {atividade.materiais && (
        <p className="mt-1 text-xs leading-relaxed text-mist/55">Materiais: {atividade.materiais}</p>
      )}
      <ol className="mt-3 space-y-2 text-sm text-mist/75">
        {atividade.etapas.map((etapa, i) => (
          <li key={i} className="flex gap-3">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-aurora/15 text-[11px] font-bold text-aurora">
              {i + 1}
            </span>
            {etapa}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function PraticaView({
  pratica,
  ctx,
  onCompartilhar,
  compartilhando = false,
  linkCompartilhado,
}: {
  pratica: Pratica;
  ctx: Contexto;
  onCompartilhar?: () => void;
  compartilhando?: boolean;
  linkCompartilhado?: string | null;
}) {
  const [copiado, setCopiado] = useState(false);

  return (
    <div className="print-area">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-aurora/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aurora">
            <span className="size-1.5 rounded-full bg-aurora" />
            Prática
          </span>
          <span className="text-xs text-mist/40">{pratica.codigo}</span>
        </div>
        <div className="no-print flex flex-wrap gap-2">
          <button
            onClick={() => {
              navigator.clipboard.writeText(toTexto(pratica));
              setCopiado(true);
              setTimeout(() => setCopiado(false), 1800);
            }}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-mist/80 hover:border-aurora/40"
          >
            {copiado ? "Copiado!" : "Copiar"}
          </button>
          {onCompartilhar && (
            <button
              onClick={onCompartilhar}
              disabled={compartilhando}
              className="rounded-lg border border-aurora/40 bg-aurora/10 px-3 py-1.5 text-xs font-semibold text-aurora disabled:opacity-60"
            >
              {compartilhando ? "Gerando link…" : "Compartilhar"}
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-mist/80 hover:border-aurora/40"
          >
            Salvar em PDF / Imprimir
          </button>
        </div>
      </div>

      {linkCompartilhado && (
        <div className="no-print mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-aurora/25 bg-aurora/[0.07] p-3">
          <input readOnly value={linkCompartilhado} className="field flex-1 text-xs" />
          <button
            onClick={() => navigator.clipboard.writeText(linkCompartilhado)}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-mist/80"
          >
            Copiar link
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`${pratica.titulo} — ${linkCompartilhado}`)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-mist/80"
          >
            WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(pratica.titulo)}&body=${encodeURIComponent(linkCompartilhado)}`}
            className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-mist/80"
          >
            E-mail
          </a>
        </div>
      )}

      <h2 className="mt-5 font-display text-2xl font-bold leading-tight text-white">
        {pratica.titulo}
      </h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist/65">{pratica.resumo}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {[ctx.serie, ctx.duracao, ctx.disciplina, ctx.conteudo].filter(Boolean).map((t) => (
          <span
            key={t}
            className="rounded-full border border-white/10 bg-ink-soft/60 px-3 py-1 text-xs text-mist/70"
          >
            {t}
          </span>
        ))}
        <span className="rounded-full border border-aurora/30 bg-aurora/10 px-3 py-1 text-xs text-aurora">
          {ctx.eixo}
        </span>
      </div>

      {pratica.conexao && (
        <div className="mt-5 rounded-2xl border border-aurora/25 bg-aurora/[0.07] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-aurora">
            Conteúdo PCN × BNCC Computação
          </p>
          <p className="mt-2 text-sm leading-relaxed text-mist/75">{pratica.conexao}</p>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-ink-soft/50 p-4">
          <p className="font-display text-lg font-bold text-white">Objetivo</p>
          <p className="mt-1 text-xs leading-relaxed text-mist/60">{pratica.objetivo}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-soft/50 p-4">
          <p className="font-display text-lg font-bold text-white">Recursos</p>
          <p className="mt-1 text-xs leading-relaxed text-mist/60">{pratica.recursos}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-ink-soft/50 p-4">
          <p className="font-display text-lg font-bold text-white">Avaliação</p>
          <p className="mt-1 text-xs leading-relaxed text-mist/60">{pratica.avaliacao}</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-ink-soft/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/50">
          Etapas da aula
        </p>
        <ol className="mt-3 space-y-2.5 text-sm text-mist/75">
          {pratica.etapas.map((etapa, i) => (
            <li key={i} className="flex gap-3">
              <span className="grid size-5 shrink-0 place-items-center rounded-full bg-aurora/15 text-[11px] font-bold text-aurora">
                {i + 1}
              </span>
              {etapa}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        <AtividadeCard rotulo="Prática plugada" atividade={pratica.plugada} destaque />
        <AtividadeCard rotulo="Prática desplugada" atividade={pratica.desplugadaAtividade} />
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-ink-soft/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/50">
          Habilidade {pratica.codigo}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-mist/70">{pratica.habilidade}</p>
        {pratica.desplugada && (
          <p className="mt-2 text-sm leading-relaxed text-mist/70">{pratica.desplugada}</p>
        )}
      </div>
    </div>
  );
}
