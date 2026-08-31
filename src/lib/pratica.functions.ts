import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { CODIGOS, SERIES, type Pratica } from "./curriculo";

const schema = z.object({
  disciplina: z.string().min(1),
  serie: z.string().min(1),
  eixo: z.string().min(1),
  duracao: z.string().min(1),
  competencia: z.string().max(600).optional().default(""),
});

export const gerarPratica = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }): Promise<Pratica> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("Serviço de geração indisponível no momento.");

    const prefix = SERIES.find((s) => s.value === data.serie)?.prefix ?? "EF02";
    const codigos = CODIGOS[prefix] ?? [];

    const prompt = `Você é formador do Currículo de Computação (Educação Digital e Midiática) da Rede Municipal de Potim/SP, alinhado à BNCC Computação (Complemento à BNCC) e à Resolução CNE nº 1/2022.

Gere UMA prática pedagógica transversal, em português do Brasil, para:
- Componente/disciplina: ${data.disciplina}
- Etapa/ano: ${data.serie}
- Eixo (competência): ${data.eixo}
- Duração: ${data.duracao}
- Foco indicado pelo professor: ${data.competencia || "livre, coerente com o eixo"}

Escolha UMA habilidade entre os códigos válidos desta etapa: ${codigos.join(", ")}.
A habilidade escolhida deve pertencer ao eixo "${data.eixo}". Escreva a descrição da habilidade conforme a BNCC Computação.

Regras: linguagem clara para professores da rede pública; atividade viável com poucos recursos; sempre inclua uma alternativa desplugada; conecte explicitamente o conteúdo da disciplina com a habilidade de computação; nada de jargão desnecessário.

Responda SOMENTE com JSON válido no formato:
{"titulo":"","codigo":"","habilidade":"","resumo":"","objetivo":"","recursos":"","avaliacao":"","etapas":["","","",""],"desplugada":""}`;

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
    const parsed = JSON.parse(content.replace(/^```json\s*|```$/g, "").trim()) as Pratica;
    return {
      titulo: parsed.titulo ?? "Prática de Computação",
      codigo: parsed.codigo ?? codigos[0] ?? "",
      habilidade: parsed.habilidade ?? "",
      resumo: parsed.resumo ?? "",
      objetivo: parsed.objetivo ?? "",
      recursos: parsed.recursos ?? "",
      avaliacao: parsed.avaliacao ?? "",
      etapas: Array.isArray(parsed.etapas) ? parsed.etapas : [],
      desplugada: parsed.desplugada ?? "",
    };
  });
