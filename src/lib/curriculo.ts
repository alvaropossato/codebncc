export const DISCIPLINAS = [
  "Computação e Tecnologia",
  "Língua Portuguesa",
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

export type Pratica = {
  titulo: string;
  codigo: string;
  habilidade: string;
  resumo: string;
  objetivo: string;
  recursos: string;
  avaliacao: string;
  etapas: string[];
  desplugada: string;
};
