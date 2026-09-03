export const DISCIPLINAS = [
  "Computação e Tecnologia",
  "Língua Portuguesa",
  "Língua Inglesa",
  "Matemática",
  "Ciências da Natureza",
  "História",
  "Geografia",
  "Arte",
  "Educação Física",
  "Ensino Religioso",
  "Campos de Experiência (Ed. Infantil)",
] as const;


export const SERIES = [
  { value: "Educação Infantil – 4 e 5 anos", prefix: "EI03" },
  { value: "1º ano", prefix: "EF01" },
  { value: "2º ano", prefix: "EF02" },
  { value: "3º ano", prefix: "EF03" },
  { value: "4º ano", prefix: "EF04" },
  { value: "5º ano", prefix: "EF05" },
  { value: "6º ano", prefix: "EF06" },
  { value: "7º ano", prefix: "EF07" },
  { value: "8º ano", prefix: "EF08" },
  { value: "9º ano", prefix: "EF09" },
] as const;

export const EIXOS = [
  "Pensamento Computacional",
  "Mundo Digital",
  "Cultura Digital",
] as const;

export const DURACOES = ["1 aula", "2 aulas", "4 aulas", "Projeto"] as const;

/** Códigos de habilidades do Currículo de Computação de Potim, por ano. */
export const CODIGOS: Record<string, string[]> = {
  EI03: ["EI03CO01","EI03CO02","EI03CO03","EI03CO04","EI03CO05","EI03CO06","EI03CO07","EI03CO08","EI03CO09","EI03CO10","EI03CO11"],
  EF01: ["EF01CO01","EF01CO02","EF01CO03","EF01CO04","EF01CO05","EF01CO06","EF01CO07"],
  EF02: ["EF02CO01","EF02CO02","EF02CO03","EF02CO04","EF02CO05","EF02CO06"],
  EF03: ["EF03CO01","EF03CO02","EF03CO03","EF03CO04","EF03CO05","EF03CO06","EF03CO07","EF03CO08","EF03CO09"],
  EF04: ["EF04CO01","EF04CO02","EF04CO03","EF04CO04","EF04CO05","EF04CO06","EF04CO07","EF04CO08"],
  EF05: ["EF05CO01","EF05CO02","EF05CO03","EF05CO04","EF05CO05","EF05CO06","EF05CO07","EF05CO08","EF05CO09","EF05CO10"],
  EF06: ["EF06CO01","EF06CO02","EF06CO03","EF06CO04","EF06CO05","EF06CO06","EF06CO07","EF06CO08","EF06CO09","EF06CO10"],
  EF07: ["EF07CO01","EF07CO02","EF07CO03","EF07CO04","EF07CO05","EF07CO06","EF07CO07","EF07CO08","EF07CO09","EF07CO10","EF07CO11"],
  EF08: ["EF08CO01","EF08CO02","EF08CO03","EF08CO04","EF08CO05","EF08CO06","EF08CO07","EF08CO08","EF08CO09","EF08CO10","EF08CO11"],
  EF09: ["EF09CO01","EF09CO02","EF09CO03","EF09CO04","EF09CO05","EF09CO06","EF09CO07","EF09CO08","EF09CO09","EF09CO10"],
};

/** Blocos de conteúdo dos PCN (Ensino Fundamental 1º ao 5º ano), por área. */
export const CONTEUDOS_PCN: Record<string, string[]> = {
  "Língua Portuguesa": [
    "Prática de leitura e compreensão de textos",
    "Prática de produção de textos escritos",
    "Linguagem oral: escuta e produção",
    "Análise e reflexão sobre a língua (ortografia e gramática)",
    "Gêneros textuais e suportes de circulação",
    "Literatura infantil e leitura literária",
  ],
  "Língua Inglesa": [
    "Vocabulário do cotidiano e primeiras palavras",
    "Canções, rimas e brincadeiras em língua inglesa",
    "Leitura de imagens e palavras em contextos digitais",
  ],
  Matemática: [
    "Números e operações",
    "Espaço e forma (geometria)",

    "Grandezas e medidas",
    "Tratamento da informação (tabelas e gráficos)",
    "Resolução de problemas",
    "Frações e números decimais",
  ],
  "Ciências da Natureza": [
    "Ambiente: ecossistemas e cadeias alimentares",
    "Ser humano e saúde",
    "Recursos tecnológicos e transformação de materiais",
    "Água, solo, ar e ciclos da natureza",
    "Terra e Universo",
    "Seres vivos: classificação e ciclos de vida",
  ],
  História: [
    "História local e do cotidiano",
    "Organização social e trabalho",
    "Comunidades e povos indígenas e afro-brasileiros",
    "Memória, fontes históricas e patrimônio",
    "Tempo, marcação e periodização",
    "Deslocamentos, migrações e cidade",
  ],
  Geografia: [
    "O espaço vivido: casa, escola e bairro",
    "Paisagem urbana e rural",
    "Representação do espaço: mapas e maquetes",
    "População, trabalho e cultura",
    "Natureza, sociedade e meio ambiente",
    "Orientação, localização e pontos de referência",
  ],
  Arte: [
    "Artes visuais: produção e leitura de imagens",
    "Música: som, ritmo e paisagem sonora",
    "Teatro: jogo dramático e narrativa cênica",
    "Dança e movimento",
    "Patrimônio cultural e produção artística local",
  ],
  "Educação Física": [
    "Jogos e brincadeiras da cultura popular",
    "Esportes e regras",
    "Ginástica e movimento corporal",
    "Danças e expressão corporal",
    "Corpo, saúde e lazer",
  ],
  "Ensino Religioso": [
    "Diversidade cultural e religiosa",
    "Valores, ética e convivência",
    "Símbolos, ritos e narrativas",
    "Respeito às diferenças e cultura de paz",
  ],
  "Computação e Tecnologia": [
    "Algoritmos e sequências",
    "Dados, informação e representação",
    "Segurança, privacidade e cidadania digital",
    "Mídias digitais e produção de conteúdo",
    "Hardware, software e redes",
    "Robótica e automação",
  ],
  "Campos de Experiência (Ed. Infantil)": [
    "O eu, o outro e o nós",
    "Corpo, gestos e movimentos",
    "Traços, sons, cores e formas",
    "Escuta, fala, pensamento e imaginação",
    "Espaços, tempos, quantidades, relações e transformações",
  ],
};

/** Blocos de conteúdo dos PCN (Ensino Fundamental 6º ao 9º ano — terceiro e quarto ciclos), por área. */
export const CONTEUDOS_PCN_FINAIS: Record<string, string[]> = {
  "Língua Portuguesa": [
    "Leitura e interpretação de textos de diferentes gêneros",
    "Produção de textos escritos: argumentação e coesão",
    "Linguagem oral: debate, seminário e exposição",
    "Análise linguística: sintaxe, semântica e variação",
    "Mídia, publicidade e leitura crítica de textos",
    "Literatura: narrativa, poesia e leitura literária",
  ],
  "Língua Inglesa": [
    "Compreensão oral e escrita em língua estrangeira",
    "Produção escrita: bilhetes, e-mails e postagens",
    "Vocabulário temático e estratégias de leitura",
    "Aspectos interculturais e usos da língua no mundo digital",
  ],
  Matemática: [
    "Números racionais, inteiros e operações",
    "Álgebra: expressões, equações e funções",
    "Geometria: figuras planas, espaciais e transformações",
    "Grandezas, medidas e proporcionalidade",
    "Tratamento da informação: estatística e probabilidade",
    "Resolução de problemas e modelagem matemática",
  ],
  "Ciências da Natureza": [
    "Vida e ambiente: ecossistemas e biodiversidade",
    "Ser humano e saúde: corpo, sexualidade e prevenção",
    "Tecnologia e sociedade: ciência, técnica e impactos",
    "Terra e Universo: sistema solar e dinâmica terrestre",
    "Matéria e energia: transformações químicas e físicas",
    "Recursos naturais, energia e sustentabilidade",
  ],
  História: [
    "Formação do mundo moderno e contemporâneo",
    "Brasil: colônia, império e república",
    "Trabalho, cidadania e movimentos sociais",
    "Diversidade cultural: povos indígenas, africanos e migrações",
    "Fontes históricas, memória e patrimônio",
    "Conflitos, poder e relações internacionais",
  ],
  Geografia: [
    "O espaço geográfico e a produção do território",
    "Urbanização, população e redes",
    "Globalização, economia e trabalho",
    "Cartografia, geotecnologias e representação do espaço",
    "Meio ambiente, clima e riscos socioambientais",
    "Brasil e mundo: regionalizações e desigualdades",
  ],
  Arte: [
    "Artes visuais: linguagem, imagem e produção contemporânea",
    "Música: elementos sonoros e produção musical",
    "Teatro: dramaturgia, cena e performance",
    "Dança: composição e expressão corporal",
    "Arte, mídia e cultura digital",
  ],
  "Educação Física": [
    "Esportes coletivos e individuais: técnica e tática",
    "Ginásticas de condicionamento e consciência corporal",
    "Lutas e jogos de oposição",
    "Danças urbanas e manifestações da cultura corporal",
    "Saúde, atividade física e análise de desempenho",
  ],
  "Ensino Religioso": [
    "Tradições religiosas e diversidade cultural",
    "Ética, valores e projetos de vida",
    "Direitos humanos, respeito e cultura de paz",
    "Narrativas, símbolos e sentidos da existência",
  ],
  "Computação e Tecnologia": [
    "Algoritmos, programação e depuração",
    "Estruturas de dados e representação da informação",
    "Redes, internet e infraestrutura digital",
    "Segurança, privacidade e cidadania digital",
    "Produção de mídias digitais e autoria",
    "Robótica, automação e inteligência artificial",
  ],
};

/** Retorna os conteúdos dos PCN adequados à disciplina e ao ano escolhido. */
export function conteudosPara(disciplina: string, serie: string): string[] {
  const finais = /^[6789]º ano$/.test(serie);
  const fonte = finais ? CONTEUDOS_PCN_FINAIS : CONTEUDOS_PCN;
  return fonte[disciplina] ?? CONTEUDOS_PCN[disciplina] ?? [];
}

/** Temas transversais dos PCN. */
export const TEMAS_TRANSVERSAIS = [
  "Nenhum",
  "Ética",
  "Meio Ambiente",
  "Saúde",
  "Pluralidade Cultural",
  "Orientação Sexual",
  "Trabalho e Consumo",
] as const;


export type Atividade = {
  titulo: string;
  materiais: string;
  etapas: string[];
};

export type Pratica = {
  titulo: string;
  codigo: string;
  habilidade: string;
  resumo: string;
  conexao: string;
  objetivo: string;
  recursos: string;
  avaliacao: string;
  etapas: string[];
  plugada: Atividade;
  desplugadaAtividade: Atividade;
  desplugada: string;
  adaptacoesPcd?: AdaptacaoPcd[];
};

export type AdaptacaoPcd = {
  publico: string;
  sugestoes: string[];
  recursos: string;
};

export const PUBLICOS_PCD = [
  "Deficiência visual (cegueira e baixa visão)",
  "Deficiência auditiva e surdez",
  "Deficiência intelectual",
  "Deficiência física/motora",
  "Transtorno do Espectro Autista (TEA)",
  "Altas habilidades/superdotação",
] as const;
