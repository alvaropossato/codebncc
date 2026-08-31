import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { gerarPratica } from "@/lib/pratica.functions";
import {
  DISCIPLINAS,
  SERIES,
  EIXOS,
  DURACOES,
  CONTEUDOS_PCN,
  TEMAS_TRANSVERSAIS,
  type Atividade,
  type Pratica,
} from "@/lib/curriculo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Compêta — Práticas de Computação alinhadas à BNCC" },
      {
        name: "description",
        content:
          "Escolha disciplina, série e competência e receba uma prática pedagógica pronta, alinhada ao Currículo de Computação de Potim e à BNCC.",
      },
      { property: "og:title", content: "Compêta — Práticas de Computação alinhadas à BNCC" },
      {
        property: "og:description",
        content:
          "Gerador de práticas pedagógicas de Educação Digital e Midiática para professores da rede municipal.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const gerar = useServerFn(gerarPratica);
  const [disciplina, setDisciplina] = useState<string>(DISCIPLINAS[0]);
  const [serie, setSerie] = useState<string>("2º ano");
  const [duracao, setDuracao] = useState<string>(DURACOES[1]);
  const [eixo, setEixo] = useState<string>(EIXOS[0]);
  const [competencia, setCompetencia] = useState("");
  const [tema, setTema] = useState<string>(TEMAS_TRANSVERSAIS[0]);
  const conteudos = CONTEUDOS_PCN[disciplina] ?? [];
  const [conteudo, setConteudo] = useState<string>(conteudos[0] ?? "");

  const conteudoAtual = conteudos.includes(conteudo) ? conteudo : (conteudos[0] ?? "");

  const mutation = useMutation<Pratica>({
    mutationFn: () =>
      gerar({
        data: {
          disciplina,
          serie,
          eixo,
          duracao,
          conteudo: conteudoAtual,
          tema,
          competencia,
        },
      }),
  });

  const pratica = mutation.data;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ink font-sans text-mist">
      <div className="pointer-events-none absolute inset-0 aurora-glow" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-5 lg:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-aurora to-aurora2 font-display text-lg font-bold text-ink">
              C
            </div>
            <div>
              <p className="font-display text-base font-bold leading-none text-white">Compêta</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-mist/45">
                BNCC · Computação
              </p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-mist/70 md:flex">
            <span className="text-white">Práticas</span>
            <span>Currículo de Potim</span>
            <span>Competências</span>
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">Rede Municipal</p>
              <p className="text-[11px] text-mist/45">Potim · SP</p>
            </div>
            <div className="grid size-10 place-items-center rounded-full bg-ink-soft text-sm font-semibold text-aurora ring-1 ring-white/10">
              P
            </div>
          </div>
        </header>

        <main className="mt-8 grid flex-1 gap-5 lg:grid-cols-[420px_1fr]">
          <section className="panel rounded-3xl p-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-aurora" />
              <h1 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Montar prática
              </h1>
            </div>
            <p className="mt-2 text-sm text-mist/55">
              Defina o contexto e gere uma prática alinhada à BNCC de computação.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="disciplina"
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/50"
                >
                  Disciplina
                </label>
                <div className="relative mt-2">
                  <select
                    id="disciplina"
                    value={disciplina}
                    onChange={(e) => {
                      setDisciplina(e.target.value);
                      setConteudo(CONTEUDOS_PCN[e.target.value]?.[0] ?? "");
                    }}
                    className="field field-focus pr-10"
                  >
                    {DISCIPLINAS.map((d) => (
                      <option key={d} value={d} className="bg-ink-soft">
                        {d}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-mist/40">
                    ▾
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="conteudo"
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/50"
                >
                  Conteúdo (PCN)
                </label>
                <div className="relative mt-2">
                  <select
                    id="conteudo"
                    value={conteudoAtual}
                    onChange={(e) => setConteudo(e.target.value)}
                    className="field field-focus pr-10"
                  >
                    {conteudos.map((c) => (
                      <option key={c} value={c} className="bg-ink-soft">
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-mist/40">
                    ▾
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="tema"
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/50"
                >
                  Tema transversal
                </label>
                <div className="relative mt-2">
                  <select
                    id="tema"
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    className="field field-focus pr-10"
                  >
                    {TEMAS_TRANSVERSAIS.map((t) => (
                      <option key={t} value={t} className="bg-ink-soft">
                        {t}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-mist/40">
                    ▾
                  </span>
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="serie"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/50"
                  >
                    Série
                  </label>
                  <div className="relative mt-2">
                    <select
                      id="serie"
                      value={serie}
                      onChange={(e) => setSerie(e.target.value)}
                      className="field field-focus pr-10"
                    >
                      {SERIES.map((s) => (
                        <option key={s.value} value={s.value} className="bg-ink-soft">
                          {s.value}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-mist/40">
                      ▾
                    </span>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="duracao"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/50"
                  >
                    Duração
                  </label>
                  <div className="relative mt-2">
                    <select
                      id="duracao"
                      value={duracao}
                      onChange={(e) => setDuracao(e.target.value)}
                      className="field field-focus pr-10"
                    >
                      {DURACOES.map((d) => (
                        <option key={d} value={d} className="bg-ink-soft">
                          {d}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-mist/40">
                      ▾
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="eixo"
                  className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/50"
                >
                  Competência BNCC
                </label>
                <div className="relative mt-2">
                  <select
                    id="eixo"
                    value={eixo}
                    onChange={(e) => setEixo(e.target.value)}
                    className="field field-focus pr-10"
                  >
                    {EIXOS.map((e) => (
                      <option key={e} value={e} className="bg-ink-soft">
                        {e}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-mist/40">
                    ▾
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={competencia}
                  onChange={(e) => setCompetencia(e.target.value)}
                  className="field field-focus mt-3 resize-none"
                  placeholder="Foco opcional: ex. algoritmos, dados e privacidade, fake news…"
                />
              </div>

              <button
                onClick={() => mutation.mutate()}
                disabled={mutation.isPending}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-aurora via-aurora2 to-aurora3 px-5 py-3.5 font-display text-sm font-bold text-ink transition-transform active:scale-[0.99] disabled:opacity-60"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {mutation.isPending ? "Gerando prática…" : "Gerar prática alinhada"}
                  <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </button>
            </div>

            <div className="mt-5 flex items-center gap-2 rounded-xl bg-aurora/10 px-3 py-2.5 text-xs text-mist/70">
              <span className="size-1.5 rounded-full bg-aurora" />
              Currículo de Computação de Potim · Educação Digital e Midiática
            </div>
          </section>

          <section className="panel rounded-3xl p-6">
            {mutation.isError && (
              <p className="text-sm text-aurora3">
                {(mutation.error as Error).message}
              </p>
            )}

            {!pratica && !mutation.isError && (
              <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                <p className="font-display text-xl font-bold text-white">
                  {mutation.isPending ? "Montando a prática…" : "Nenhuma prática gerada ainda"}
                </p>
                <p className="mt-2 max-w-sm text-sm text-mist/55">
                  Escolha disciplina, série e competência ao lado e clique em gerar.
                </p>
              </div>
            )}

            {pratica && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full bg-aurora/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-aurora">
                      <span className="size-1.5 rounded-full bg-aurora" />
                      Gerado
                    </span>
                    <span className="text-xs text-mist/40">{pratica.codigo}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(toTexto(pratica))}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-mist/80"
                    >
                      Copiar
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-mist/80"
                    >
                      Imprimir
                    </button>
                  </div>
                </div>

                <h2 className="mt-5 font-display text-2xl font-bold leading-tight text-white">
                  {pratica.titulo}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-mist/65">
                  {pratica.resumo}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/10 bg-ink-soft/60 px-3 py-1 text-xs text-mist/70">
                    {serie}
                  </span>
                  <span className="rounded-full border border-white/10 bg-ink-soft/60 px-3 py-1 text-xs text-mist/70">
                    {duracao}
                  </span>
                  <span className="rounded-full border border-white/10 bg-ink-soft/60 px-3 py-1 text-xs text-mist/70">
                    {disciplina}
                  </span>
                  <span className="rounded-full border border-white/10 bg-ink-soft/60 px-3 py-1 text-xs text-mist/70">
                    {conteudoAtual}
                  </span>
                  <span className="rounded-full border border-aurora/30 bg-aurora/10 px-3 py-1 text-xs text-aurora">
                    {eixo}
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
                  <AtividadeCard
                    rotulo="Prática desplugada"
                    atividade={pratica.desplugadaAtividade}
                  />
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

              </>
            )}
          </section>
        </main>

        <footer className="mt-6 flex items-center justify-between text-[11px] text-mist/35">
          <span>Compêta · Secretaria Municipal de Educação e Cultura de Potim</span>
          <span>Baseado no Currículo de Computação e na BNCC</span>
        </footer>
      </div>
    </div>
  );
}

function toTexto(p: Pratica) {
  return [
    p.titulo,
    `Habilidade ${p.codigo}: ${p.habilidade}`,
    `Resumo: ${p.resumo}`,
    `Objetivo: ${p.objetivo}`,
    `Recursos: ${p.recursos}`,
    `Etapas:\n${p.etapas.map((e, i) => `${i + 1}. ${e}`).join("\n")}`,
    `Versão desplugada: ${p.desplugada}`,
    `Avaliação: ${p.avaliacao}`,
  ].join("\n\n");
}
