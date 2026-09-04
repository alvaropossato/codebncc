import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  CODIGOS,
  PUBLICOS_PCD,
  SERIES,
  type AdaptacaoPcd,
  type Atividade,
  type Pratica,
} from "./curriculo";

const schema = z.object({
  disciplina: z.string().min(1),
  serie: z.string().min(1),
  eixo: z.string().min(1),
  duracao: z.string().min(1),
  conteudo: z.string().min(1),
  tema: z.string().max(120).optional().default("Nenhum"),
  competencia: z.string().max(600).optional().default(""),
  unidadeTematica: z.string().max(200).optional().default(""),
  objetoConhecimento: z.string().max(300).optional().default(""),
  habilidadeCodigo: z.string().max(20).optional().default(""),
  habilidadeTexto: z.string().max(1200).optional().default(""),
  fonteCurricular: z.string().max(60).optional().default("BNCC"),
  publicosPcd: z.array(z.string().max(120)).optional().default([]),

});

function normAtividade(a: unknown): Atividade {
  const o = (a ?? {}) as Partial<Atividade>;
  return {
    titulo: o.titulo ?? "",
    materiais: o.materiais ?? "",
    etapas: Array.isArray(o.etapas) ? o.etapas : [],
  };
}

export const gerarPratica = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<Pratica> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Serviço de geração indisponível no momento.");

    const prefix = SERIES.find((s) => s.value === data.serie)?.prefix ?? "EF02";
    const codigos = CODIGOS[prefix] ?? [];
    const publicos =
      data.publicosPcd && data.publicosPcd.length > 0
        ? data.publicosPcd
        : [...PUBLICOS_PCD];

    const prompt = `Você é formador do Currículo de Computação (Educação Digital e Midiática) da Rede Municipal de Potim/SP, alinhado à BNCC Computação (Complemento à BNCC), à Resolução CNE nº 1/2022 e aos Parâmetros Curriculares Nacionais (PCN) do Ensino Fundamental — 1º ao 5º ano (primeiro e segundo ciclos) e 6º ao 9º ano (terceiro e quarto ciclos).

Gere UMA prática pedagógica transversal, em português do Brasil, para:
- Componente/disciplina: ${data.disciplina}
- Etapa/ano: ${data.serie}
- Conteúdo que o professor quer desenvolver: ${data.conteudo}
- Referencial curricular escolhido pelo professor: ${data.fonteCurricular}
- Unidade temática (${data.fonteCurricular} — ${data.disciplina}): ${data.unidadeTematica || "não informada"}
- Objeto de conhecimento (${data.fonteCurricular}): ${data.objetoConhecimento || "não informado"}
- Habilidade do componente (${data.fonteCurricular}): ${data.habilidadeCodigo ? `${data.habilidadeCodigo} — ${data.habilidadeTexto}` : "não informada"}


- Tema transversal dos PCN: ${data.tema}
- Eixo da BNCC Computação: ${data.eixo}
- Duração: ${data.duracao}
- Observações do professor: ${data.competencia || "nenhuma"}

Escolha UMA habilidade entre os códigos válidos desta etapa: ${codigos.join(", ")}.
A habilidade escolhida deve pertencer ao eixo "${data.eixo}" e dialogar diretamente com a unidade temática, o objeto de conhecimento e a habilidade da BNCC do componente indicados. Escreva a descrição da habilidade conforme a BNCC Computação.

Em "conexao", explique em 2 a 3 frases como a habilidade da BNCC do componente (unidade temática e objeto de conhecimento) se liga à habilidade de computação escolhida, citando os dois códigos.
Em "plugada", proponha a atividade COM tecnologia digital (computador, tablet, celular, robô ou apps gratuitos), viável na rede pública.
Em "desplugadaAtividade", proponha a MESMA aprendizagem SEM nenhum dispositivo (papel, corpo, cartões, giz, jogos).
Em "desplugada", resuma em uma frase a versão desplugada.
Em "adaptacoesPcd", proponha adaptações inclusivas da MESMA prática para estudantes público-alvo da Educação Especial (PCD), na perspectiva da educação inclusiva (LBI 13.146/2015 e Política Nacional de Educação Especial Inclusiva). Gere um item para CADA um destes públicos (apenas estes, nenhum outro), nesta ordem: ${publicos.join("; ")}. Em cada item: "publico" com o nome do público, "sugestoes" com 3 a 4 adaptações concretas de como realizar as atividades plugada e desplugada (ajustes de material, comunicação, tempo, avaliação e mediação, incluindo tecnologia assistiva gratuita quando fizer sentido) e "recursos" com os recursos/apoios necessários em uma frase.

Regras: linguagem clara para professores da rede pública; poucos recursos; nenhuma etapa em markdown (texto puro, sem asteriscos e sem numeração); 4 a 6 etapas em cada atividade; "etapas" geral deve trazer a sequência didática da aula inteira (4 a 6 frases).

Responda SOMENTE com JSON válido no formato:
{"titulo":"","codigo":"","habilidade":"","resumo":"","conexao":"","objetivo":"","recursos":"","avaliacao":"","etapas":["","","",""],"plugada":{"titulo":"","materiais":"","etapas":["","","",""]},"desplugadaAtividade":{"titulo":"","materiais":"","etapas":["","","",""]},"desplugada":"","adaptacoesPcd":[{"publico":"","sugestoes":["","",""],"recursos":""}]}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("Muitas solicitações. Tente novamente em instantes.");
    if (res.status === 402) throw new Error("Créditos de IA esgotados no workspace.");
    if (!res.ok) throw new Error("Não foi possível gerar a prática agora.");

    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = json.choices?.[0]?.message?.content ?? "";
    const parsed = JSON.parse(content.replace(/^```json\s*|```$/g, "").trim()) as Partial<Pratica>;
    return {
      titulo: parsed.titulo ?? "Prática de Computação",
      codigo: parsed.codigo ?? codigos[0] ?? "",
      habilidade: parsed.habilidade ?? "",
      resumo: parsed.resumo ?? "",
      conexao: parsed.conexao ?? "",
      objetivo: parsed.objetivo ?? "",
      recursos: parsed.recursos ?? "",
      avaliacao: parsed.avaliacao ?? "",
      etapas: Array.isArray(parsed.etapas) ? parsed.etapas : [],
      plugada: normAtividade(parsed.plugada),
      desplugadaAtividade: normAtividade(parsed.desplugadaAtividade),
      desplugada: parsed.desplugada ?? "",
      adaptacoesPcd: normAdaptacoes(parsed.adaptacoesPcd, publicos),
    };
  });
