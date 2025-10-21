export const SHEET_GIDS = {
  dados: "1470123916",
  videos: "1211054175",
  percursos: "1671648398",
  parceiros: "1782037482",
} as const;

export type SheetKey = keyof typeof SHEET_GIDS;
