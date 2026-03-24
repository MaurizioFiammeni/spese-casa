// 13 categorie di spesa
export const CATEGORIES = [
  'Università',
  'Vitto',
  'Abbigliamento',
  'Casa',
  'Auto',
  'Trasporti e viaggi',
  'Bollette acqua',
  'Bollette Luce',
  'Bollette Maddalena',
  'Tasse',
  'Sanità',
  'Varie',
  'Pulizie',
] as const;

export type Category = (typeof CATEGORIES)[number];
