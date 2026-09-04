import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { gerarPratica } from "@/lib/pratica.functions";
import {
  DISCIPLINAS,
  SERIES,
  EIXOS,
  RESUMOS_EIXOS,
  DURACOES,
  conteudosPara,
  TEMAS_TRANSVERSAIS,
  PUBLICOS_PCD,
  type Eixo,
  type Pratica,
} from "@/lib/curriculo";
import {
  carregarCurriculo,
  FONTES,
  filtrar,
  unidadesTematicas,
  objetosDeConhecimento,
  habilidades as habilidadesDe,
  type Fonte,
} from "@/lib/bncc";

import { PraticaView } from "@/components/PraticaView";
import { salvarPratica, type Contexto } from "@/lib/praticas";
import { useAuth } from "@/hooks/useAuth";
import codeLogoAsset from "@/assets/code-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CODE — Práticas de Computação alinhadas à BNCC" },
      {
        name: "description",
        content:
          "Escolha disciplina, conteúdo dos PCN (1º ao 9º ano), série e competência e receba uma prática plugada e desplugada alinhada à BNCC Computação.",
      },
      { property: "og:title", content: "CODE — Práticas de Computação alinhadas à BNCC" },
      {
        property: "og:description",
        content:
          "Gerador com IA de práticas pedagógicas de Educação Digital e Midiática para professores da rede municipal.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const gerar = useServerFn(gerarPratica);
  const { user } = useAuth();
  const [disciplina, setDisciplina] = useState<string>("Língua Portuguesa");
  const [serie, setSerie] = useState<string>("2º ano");
  const [duracao, setDuracao] = useState<string>(DURACOES[1]);
  const [eixo, setEixo] = useState<Eixo>(EIXOS[0]);
  const [competencia, setCompetencia] = useState("");
  const [tema, setTema] = useState<string>(TEMAS_TRANSVERSAIS[0]);
  const [conteudo, setConteudo] = useState<string>("");
  const [unidade, setUnidade] = useState<string>("");
  const [objeto, setObjeto] = useState<string>("");
  const [habilidade, setHabilidade] = useState<string>("");
  const [link, setLink] = useState<string | null>(null);
  const [salvaId, setSalvaId] = useState<string | null>(null);
  const [erroLink, setErroLink] = useState("");
  const [publicosPcd, setPublicosPcd] = useState<string[]>([...PUBLICOS_PCD]);
  const [fontes, setFontes] = useState<Fonte[]>(["bncc", "paulista"]);

  const alternarPublico = (p: string) =>
    setPublicosPcd((atual) =>
      atual.includes(p) ? atual.filter((x) => x !== p) : [...atual, p],
    );

  const conteudos = conteudosPara(disciplina, serie);
  const conteudoAtual = conteudos.includes(conteudo) ? conteudo : (conteudos[0] ?? "");

  const { data: baseBncc = [] } = useQuery({
    queryKey: ["curriculo", [...fontes].sort().join("+")],
    queryFn: () => carregarCurriculo(fontes),
    staleTime: Infinity,
  });

  const rotuloFonte =
    FONTES.filter((f) => fontes.includes(f.value))
      .map((f) => f.curto)
      .join(" + ") || "Nenhuma fonte";

  const itensBncc = filtrar(baseBncc, disciplina, serie);
  const unidades = unidadesTematicas(itensBncc);
  const unidadeAtual = unidades.includes(unidade) ? unidade : (unidades[0] ?? "");
  const objetos = objetosDeConhecimento(itensBncc, unidadeAtual);
  const objetoAtual = objetos.includes(objeto) ? objeto : (objetos[0] ?? "");
  const habs = habilidadesDe(itensBncc, unidadeAtual, objetoAtual);
  const habAtual = habs.find((h) => h.c === habilidade) ?? habs[0];


  const ctx: Contexto = {
    disciplina,
    serie,
    conteudo: objetoAtual || conteudoAtual,
    tema,
    eixo,
    duracao,
    unidade_tematica: unidadeAtual,
    objeto_conhecimento: objetoAtual,
    habilidade_codigo: habAtual?.c ?? "",
    habilidade_texto: habAtual?.t ?? "",
  };

  const mutation = useMutation<Pratica>({
    mutationFn: () =>
      gerar({
        data: {
          disciplina,
          serie,
          conteudo: objetoAtual || conteudoAtual,
          tema,
          eixo,
          duracao,
          competencia,
          unidadeTematica: unidadeAtual,
          objetoConhecimento: objetoAtual,
          habilidadeCodigo: habAtual?.c ?? "",
          habilidadeTexto: habAtual?.t ?? "",
          fonteCurricular: rotuloFonte,
          publicosPcd,

        },
      }),
    onSuccess: async (p) => {
      setLink(null);
      setSalvaId(null);
      try {
        const id = await salvarPratica(p, ctx, user?.id ?? null);
        setSalvaId(id);
      } catch {
        /* sem conexão: prática segue disponível na tela */
      }
    },
  });

  const compartilhar = useMutation({
    mutationFn: async () => {
      const id = salvaId ?? (await salvarPratica(mutation.data!, ctx, user?.id ?? null));
      setSalvaId(id);
      return `${window.location.origin}/p/${id}`;
    },
    onSuccess: async (url) => {
      setLink(url);
      setErroLink("");
      if (navigator.share) {
        try {
          await navigator.share({ title: mutation.data?.titulo ?? "Prática", url });
        } catch {
          /* usuário cancelou */
        }
      }
    },
    onError: (e) => setErroLink((e as Error).message),
  });

  const pratica = mutation.data;

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-ink font-sans text-mist">
      <div className="pointer-events-none absolute inset-0 aurora-glow" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-5 lg:px-10">
        <header className="no-print grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <img
              src={codeLogoAsset.url}
              alt="CODE"
              className="size-28 shrink-0 rounded-xl object-contain sm:size-40"
            />
             <div className="min-w-0">
              <p className="font-display text-base font-bold leading-none text-white">
                
              </p>
              <p className="mt-1 text-[10px] uppercase leading-relaxed tracking-[0.16em] text-mist/45 sm:text-[11px] sm:tracking-[0.22em]">
                BNCC  
COMPUTAÇÃO
              </p>
            </div>
          </div>
          <nav className="grid grid-cols-3 gap-2 sm:flex sm:items-center" aria-label="Navegação principal">
            <Link
              to="/adaptacoes"
              className="flex min-h-11 items-center justify-center rounded-lg border border-white/10 px-2 py-2 text-center text-[11px] leading-tight text-mist/75 hover:border-aurora/40 sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs"
            >
              Adaptações PCD
            </Link>
            <Link
              to="/historico"
              className="flex min-h-11 items-center justify-center rounded-lg border border-white/10 px-2 py-2 text-center text-[11px] leading-tight text-mist/75 hover:border-aurora/40 sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs"
            >
              Meu histórico
            </Link>
            {!user && (
              <Link
                to="/auth"
                className="flex min-h-11 items-center justify-center rounded-lg bg-gradient-to-r from-aurora via-aurora2 to-aurora3 px-2 py-2 text-center text-[11px] font-bold text-ink sm:min-h-0 sm:px-3 sm:py-1.5 sm:text-xs"
              >
                Entrar
              </Link>
            )}
          </nav>
        </header>

        <main className="mt-5 grid min-w-0 flex-1 gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
          <section className="panel no-print min-w-0 rounded-2xl p-4 sm:rounded-3xl sm:p-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-aurora" />
              <h1 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Montar prática
              </h1>
            </div>
            <p className="mt-2 text-sm text-mist/55">
              Conteúdos das BNCC do 1º ao 9º ano ligados às habilidades da BNCC Computação.
            </p>

            <div className="mt-6 space-y-5">
              <Campo label="Disciplina" id="disciplina">
                <select
                  id="disciplina"
                  value={disciplina}
                  onChange={(e) => {
                    setDisciplina(e.target.value);
                    setConteudo("");
                      setUnidade("");
                      setObjeto("");
                      setHabilidade("");
                  }}
                  className="field field-focus pr-10"
                >
                  {DISCIPLINAS.map((d) => (
                    <option key={d} value={d} className="bg-ink-soft">
                      {d}
                    </option>
                  ))}
                </select>
              </Campo>

              <div className="grid grid-cols-1 gap-4 min-[390px]:grid-cols-2">
                <Campo label="Série" id="serie">
                  <select
                    id="serie"
                    value={serie}
                    onChange={(e) => {
                      setSerie(e.target.value);
                      setConteudo("");
                      setUnidade("");
                      setObjeto("");
                      setHabilidade("");
                    }}
                    className="field field-focus pr-10"
                  >
                    {SERIES.map((s) => (
                      <option key={s.value} value={s.value} className="bg-ink-soft">
                        {s.value}
                      </option>
                    ))}
                  </select>
                </Campo>
                <Campo label="Duração" id="duracao">
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
                </Campo>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/50">
                  Fonte curricular
                </span>
                <div
                  role="group"
                  aria-label="Fonte curricular"
                  className="mt-2 grid grid-cols-2 gap-2"
                >
                  {FONTES.map((f) => {
                    const ativa = fontes.includes(f.value);
                    const sozinha = ativa && fontes.length === 1;
                    return (
                      <button
                        key={f.value}
                        type="button"
                        title={
                          sozinha
                            ? `Somar ${FONTES.filter((o) => o.value !== f.value)
                                .map((o) => o.curto)
                                .join(" e ")}`
                            : `Usar ${f.label}`
                        }
                        aria-pressed={ativa}
                        onClick={() => {
                          setFontes((atual) => {
                            const jaAtiva = atual.includes(f.value);
                            if (!jaAtiva) return [...atual, f.value];
                            // já ativa: se acompanhada, isola; se sozinha, ativa todas
                            if (atual.length > 1) return [f.value];
                            return FONTES.map((o) => o.value);
                          });
                          setUnidade("");
                          setObjeto("");
                          setHabilidade("");
                        }}
                        className={`min-h-10 rounded-full border px-2 py-2 text-[11px] leading-tight transition ${
                          ativa
                            ? "border-aurora/60 bg-aurora/15 text-aurora"
                            : "border-white/10 bg-white/5 text-mist/60 hover:border-white/25"
                        }`}
                      >
                        {f.curto}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] leading-snug text-mist/40">
                  Fonte em uso: {rotuloFonte}. Toque para usar só uma; toque de novo
                  para somar as duas.
                </p>
              </div>



              <Campo label={`Unidade temática (${rotuloFonte})`} id="unidade">
                <select
                  id="unidade"
                  value={unidadeAtual}
                  disabled={unidades.length === 0}
                  onChange={(e) => {
                    setUnidade(e.target.value);
                    setObjeto("");
                    setHabilidade("");
                  }}
                  className="field field-focus pr-10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {unidades.length === 0 && <option value="">Nenhum registro para esta seleção</option>}
                  {unidades.map((u) => (
                    <option key={u} value={u} className="bg-ink-soft">
                      {u}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo label={`Objeto de conhecimento (${rotuloFonte})`} id="objeto">
                <select
                  id="objeto"
                  value={objetoAtual}
                  disabled={objetos.length === 0}
                  onChange={(e) => {
                    setObjeto(e.target.value);
                    setHabilidade("");
                  }}
                  className="field field-focus pr-10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {objetos.length === 0 && <option value="">Nenhum registro para esta seleção</option>}
                  {objetos.map((o) => (
                    <option key={o} value={o} className="bg-ink-soft">
                      {o}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo label={`Habilidade (${rotuloFonte})`} id="habilidade">
                <select
                  id="habilidade"
                  value={habAtual?.c ?? ""}
                  disabled={habs.length === 0}
                  onChange={(e) => setHabilidade(e.target.value)}
                  className="field field-focus pr-10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {habs.length === 0 && <option value="">Nenhuma habilidade para esta seleção</option>}
                  {habs.map((h) => (
                    <option key={h.c} value={h.c} className="bg-ink-soft">
                      {h.c} — {h.t.slice(0, 90)}
                      {h.t.length > 90 ? "…" : ""}
                    </option>
                  ))}
                </select>
              </Campo>
              {habAtual && (
                <p className="-mt-2 rounded-xl bg-white/5 px-3 py-2 text-xs leading-relaxed text-mist/60">
                  <span className="font-semibold text-aurora">{habAtual.c}</span> {habAtual.t}
                </p>
              )}


              <Campo label="Tema transversal" id="tema">
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
              </Campo>

               <Campo label="COMPETÊNCIA BNCC COMPUTAÇÃO" id="eixo">
                <select
                  id="eixo"
                  value={eixo}
                  onChange={(e) => setEixo(e.target.value as Eixo)}
                  className="field field-focus pr-10"
                >
                  {EIXOS.map((e) => (
                    <option key={e} value={e} className="bg-ink-soft">
                      {e}
                    </option>
                  ))}
                </select>
              </Campo>
              <p className="-mt-2 rounded-xl border border-aurora/20 bg-aurora/[0.07] px-3 py-2.5 text-xs leading-relaxed text-mist/70">
                <span className="font-semibold text-aurora">Resumo:</span>{" "}
                {RESUMOS_EIXOS[eixo]}
              </p>
              <textarea
                rows={3}
                value={competencia}
                onChange={(e) => setCompetencia(e.target.value)}
                className="field field-focus resize-none"
                placeholder="Foco opcional: ex. algoritmos, dados e privacidade, fake news…"
              />

              <div>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/50">
                    Adaptações PCD
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPublicosPcd(
                        publicosPcd.length === PUBLICOS_PCD.length ? [] : [...PUBLICOS_PCD],
                      )
                    }
                    className="min-h-10 px-1 text-right text-[11px] leading-tight text-aurora hover:underline"
                  >
                    {publicosPcd.length === PUBLICOS_PCD.length ? "Limpar" : "Selecionar todos"}
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PUBLICOS_PCD.map((p) => {
                    const ativo = publicosPcd.includes(p);
                    return (
                      <button
                        key={p}
                        type="button"
                        aria-pressed={ativo}
                        onClick={() => alternarPublico(p)}
                        className={`min-h-10 rounded-full border px-3 py-2 text-[11px] leading-tight transition-colors ${
                          ativo
                            ? "border-aurora/60 bg-aurora/15 text-white"
                            : "border-white/10 text-mist/55 hover:border-aurora/30"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] text-mist/40">
                  {publicosPcd.length === 0
                    ? "Nenhum público selecionado: a prática virá com todas as adaptações."
                    : `A IA gerará adaptações apenas para ${publicosPcd.length} público(s).`}
                </p>
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
              {user
                ? "Suas práticas compartilhadas ficam salvas no seu histórico."
                : "Você pode usar sem cadastro. Cadastre-se para salvar o histórico."}
            </div>
          </section>

          <section className="panel min-w-0 rounded-2xl p-4 sm:rounded-3xl sm:p-6">
            {mutation.isError && (
              <p className="text-sm text-aurora3">{(mutation.error as Error).message}</p>
            )}

            {!pratica && !mutation.isError && (
              <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                <p className="font-display text-xl font-bold text-white">
                  {mutation.isPending ? "Montando a prática…" : "Nenhuma prática gerada ainda"}
                </p>
                <p className="mt-2 max-w-sm text-sm text-mist/55">
                  Escolha disciplina, conteúdo dos objetos de conhecimento da BNCC, série e competência ao lado e clique em
                  gerar.
                </p>
              </div>
            )}

            {pratica && (
              <>
                <PraticaView
                  pratica={pratica}
                  ctx={ctx}
                  onCompartilhar={() => compartilhar.mutate()}
                  compartilhando={compartilhar.isPending}
                  linkCompartilhado={link}
                />
                {erroLink && <p className="mt-3 text-sm text-aurora3">{erroLink}</p>}
              </>
            )}
          </section>
        </main>

        <footer className="no-print mt-6 flex flex-col gap-1 text-center text-[11px] leading-relaxed text-mist/35 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:text-left">
          <span>Desenvolvido por Alvaro Possato · Secretaria Municipal de Educação e Cultura de Potim</span>
          <span>BNCC  (1º ao 9º ano) · BNCC Computação</span>
        </footer>
      </div>
    </div>
  );
}

function Campo({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.14em] text-mist/50">
        {label}
      </label>
      <div className="relative mt-2">
        {children}
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-mist/40">
          ▾
        </span>
      </div>
    </div>
  );
}
