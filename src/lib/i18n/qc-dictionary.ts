export const qcDictionary: Record<string, string> = {
  voiture: "char",
  "petit-ami": "chum",
  "petite-amie": "blonde",
  ennuyeux: "platte",
  froid: "frette",
  amusant: "le fun",
  travailler: "fesser",
  beaucoup: "une coupe de",
  bureau: "office",
  déjeuner: "déjeuner", // QC: breakfast, FR: lunch
  dîner: "dîner", // QC: lunch, FR: dinner
  souper: "souper", // QC: dinner, FR: supper
  chaussettes: "bas",
  pastèque: "melon d'eau",
  boisson: "breuvage",
  tasse: "bol",
  ami: "chum",
  copain: "chum",
  copine: "blonde",
  pantalon: "culottes",
  glissant: "glissant",
  neige: "poudrerie",
  magasin: "shop",
  "faire du shopping": "magasiner",
};

export const joualDictionary: Record<string, string> = {
  ...qcDictionary,
  bonjour: "Salut là",
  "comment ça va": "Comment ça va mon chum?",
  "je ne sais pas": "J'sais pas trop",
  "c'est bien": "C'est tiguidou",
  "il pleut": "Y mouille",
  "il fait froid": "Y fait frette en maudit",
  regarder: "checker",
  comprendre: "piger",
};

export function translateToQC(
  text: string,
  mode: "QC" | "JOUAL" | "FR" = "QC",
): string {
  if (mode === "FR") return text;

  const dict = mode === "JOUAL" ? joualDictionary : qcDictionary;
  let translated = text;

  Object.entries(dict).forEach(([fr, qc]) => {
    const regex = new RegExp(`\\b${fr}\\b`, "gi");
    translated = translated.replace(regex, qc);
  });

  return translated;
}
