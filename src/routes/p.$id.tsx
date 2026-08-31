import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { carregarPratica } from "@/lib/praticas";
import { PraticaView } from "@/components/PraticaView";

export const Route = createFileRoute("/p/$id")({
  head: () => ({
    meta: [
      { title: "Prática compartilhada — Compêta" },
      {
        name: "description",
        content:
          "Prática pedagógica alinhada aos PCN e à BNCC Computação, com versão plugada e desplugada, compartilhada pelo Compêta.",
      },
      { property: "og:title", content: "Prática pedagógica — Compêta" },
      {
        property: "og:description",
        content: "Plano de aula com conexão PCN × BNCC Computação, plugado e desplugado.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  errorComponent: () => (
    <div className="grid min-h-screen place-items-center bg-ink text-mist">
      Não foi possível abrir esta prática.
    </div>
  ),
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center bg-ink text-mist">Prática não encontrada.</div>
  ),
  component: Compartilhada,
});

function Compartilhada() {
  const { id } = Route.useParams();
  const { data, isPending, isError } = useQuery({
    queryKey: ["pratica", id],
    queryFn: () => carregarPratica(id),
  });

  return (
    <div className="relative min-h-screen bg-ink font-sans text-mist">
      <div className="pointer-events-none absolute inset-0 aurora-glow" />
      <div className="relative mx-auto max-w-4xl px-6 py-8">
        <div className="no-print mb-5 flex items-center justify-between">
          <Link to="/" className="font-display text-base font-bold text-white">
            Compêta
          </Link>
          <Link
            to="/"
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-mist/70 hover:border-aurora/40"
          >
            Gerar minha prática
          </Link>
        </div>
        <section className="panel rounded-3xl p-6">
          {isPending && <p className="text-sm text-mist/60">Carregando prática…</p>}
          {(isError || (!isPending && !data)) && (
            <p className="text-sm text-aurora3">Prática não encontrada.</p>
          )}
          {data && (
            <PraticaView
              pratica={data.dados}
              ctx={{
                disciplina: data.disciplina,
                serie: data.serie,
                conteudo: data.conteudo,
                tema: data.tema,
                eixo: data.eixo,
                duracao: data.duracao,
              }}
            />
          )}
        </section>
      </div>
    </div>
  );
}
