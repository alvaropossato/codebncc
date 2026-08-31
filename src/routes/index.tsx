import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { gerarPratica } from "@/lib/pratica.functions";
import {
  DISCIPLINAS,
  SERIES,
  EIXOS,
  DURACOES,
  conteudosPara,
  TEMAS_TRANSVERSAIS,
  type Pratica,
} from "@/lib/curriculo";
import { PraticaView } from "@/components/PraticaView";
import { salvarPratica, type Contexto } from "@/lib/praticas";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Compêta — Práticas de Computação alinhadas à BNCC" },
      {
        name: "description",
        content:
          "Escolha disciplina, conteúdo dos PCN (1º ao 9º ano), série e competência e receba uma prática plugada e desplugada alinhada à BNCC Computação.",
      },
      { property: "og:title", content: "Compêta — Práticas de Computação alinhadas à BNCC" },
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
  const [disciplina, setDisciplina] = useState<string>(DISCIPLINAS[0]);
  const [serie, setSerie] = useState<string>("2º ano");
  const [duracao, setDuracao] = useState<string>(DURACOES[1]);
  const [eixo, setEixo] = useState<string>(EIXOS[0]);
  const [competencia, setCompetencia] = useState("");
  const [tema, setTema] = useState<string>(TEMAS_TRANSVERSAIS[0]);
  const [conteudo, setConteudo] = useState<string>("");
  const [link, setLink] = useState<string | null>(null);
  const [erroLink, setErroLink] = useState("");

  const conteudos = conteudosPara(disciplina, serie);
  const conteudoAtual = conteudos.includes(conteudo) ? conteudo : (conteudos[0] ?? "");

  const ctx: Contexto = {
    disciplina,
    serie,
    conteudo: conteudoAtual,
    tema,
    eixo,
    duracao,
  };

  const mutation = useMutation<Pratica>({
    mutationFn: () => gerar({ data: { ...ctx, competencia } }),
    onSuccess: () => setLink(null),
  });

  const compartilhar = useMutation({
    mutationFn: async () => {
      const id = await salvarPratica(mutation.data!, ctx, user?.id ?? null);
      return `${window.location.origin}/p/${id}`;
    },
    onSuccess: async (url) => {
      setLink(url);
      setErroLink("");
      if (navigator.share) {
        try {
          await navigator.share({ title: mutation.data?.titulo, url });
        } catch {
          /* usuário cancelou */
        }
      }
    },
    onError: (e) => setErroLink((e as Error).message),
  });

  const pratica = mutation.data;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ink font-sans text-mist">
      <div className="pointer-events-none absolute inset-0 aurora-glow" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-5 lg:px-10">
        <header className="no-print flex items-center justify-between">
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
          <div className="flex items-center gap-2">
            <Link
              to="/historico"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-mist/75 hover:border-aurora/40"
            >
              Meu histórico
            </Link>
            {!user && (
              <Link
                to="/auth"
                className="rounded-lg bg-gradient-to-r from-aurora via-aurora2 to-aurora3 px-3 py-1.5 text-xs font-bold text-ink"
              >
                Entrar
              </Link>
            )}
          </div>
        </header>

        <main className="mt-8 grid flex-1 gap-5 lg:grid-cols-[420px_1fr]">
          <section className="panel no-print rounded-3xl p-6">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-aurora" />
              <h1 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-white">
                Montar prática
              </h1>
            </div>
            <p className="mt-2 text-sm text-mist/55">
              Conteúdos dos PCN do 1º ao 9º ano ligados às habilidades da BNCC Computação.
            </p>

            <div className="mt-6 space-y-5">
              <Campo label="Disciplina" id="disciplina">
                <select
                  id="disciplina"
                  value={disciplina}
                  onChange={(e) => {
                    setDisciplina(e.target.value);
                    setConteudo("");
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

              <div className="grid grid-cols-2 gap-4">
                <Campo label="Série" id="serie">
                  <select
                    id="serie"
                    value={serie}
                    onChange={(e) => {
                      setSerie(e.target.value);
                      setConteudo("");
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

              <Campo label="Conteúdo (PCN)" id="conteudo">
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
              </Campo>

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

              <Campo label="Competência BNCC" id="eixo">
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
              </Campo>
              <textarea
                rows={3}
                value={competencia}
                onChange={(e) => setCompetencia(e.target.value)}
                className="field field-focus resize-none"
                placeholder="Foco opcional: ex. algoritmos, dados e privacidade, fake news…"
              />

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

          <section className="panel rounded-3xl p-6">
            {mutation.isError && (
              <p className="text-sm text-aurora3">{(mutation.error as Error).message}</p>
            )}

            {!pratica && !mutation.isError && (
              <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                <p className="font-display text-xl font-bold text-white">
                  {mutation.isPending ? "Montando a prática…" : "Nenhuma prática gerada ainda"}
                </p>
                <p className="mt-2 max-w-sm text-sm text-mist/55">
                  Escolha disciplina, conteúdo dos PCN, série e competência ao lado e clique em
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

        <footer className="no-print mt-6 flex flex-wrap items-center justify-between gap-2 text-[11px] text-mist/35">
          <span>Compêta · Secretaria Municipal de Educação e Cultura de Potim</span>
          <span>PCN (1º ao 9º ano) · BNCC Computação</span>
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
