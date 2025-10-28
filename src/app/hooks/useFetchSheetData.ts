"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SHEETS_BASE_URL = process.env.NEXT_PUBLIC_SHEETS_BASE_URL || "https://docs.google.com/spreadsheets/d/1tsRN2gHLSVr59h3YCTWAXQuVXN8Kc2wqRENCtPTeR_0/gviz/tq";

type SheetRowValue = string | number | boolean | null;

export type SheetRow = Record<string, SheetRowValue>;

type Options<TData> = {
  enabled?: boolean;
  queryString?: string;
  gid?: string;
  mapRow?: (row: SheetRow, index: number) => TData | null;
};

type SheetState<TData> = {
  data: TData[];
  isLoading: boolean;
  error?: Error;
  refresh: () => Promise<void>;
};

const normalizeKey = (key: string, fallbackIndex: number) => {
  const safeKey = key && key.length > 0 ? key : `col_${fallbackIndex}`;
  return safeKey
    .toString()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
};

const parseSheetResponse = (payload: string): SheetRow[] => {
  const jsonStart = payload.indexOf("{");
  if (jsonStart === -1) {
    throw new Error("Unexpected Google Sheets response format");
  }

  const jsonEnd = payload.lastIndexOf("}");
  if (jsonEnd === -1) {
    throw new Error("Unexpected Google Sheets response termination");
  }

  const jsonSlice = payload.slice(jsonStart, jsonEnd + 1);

  const parsed = JSON.parse(jsonSlice);
  let columns =
    parsed?.table?.cols?.map(
      (col: { label?: string; id?: string }, index: number) =>
        normalizeKey(col?.label ?? col?.id ?? "", index),
    ) ?? [];

  const rows = parsed?.table?.rows ?? [];

  const matrix: SheetRowValue[][] = rows.map(
    (row: { c?: Array<{ v?: SheetRowValue; f?: SheetRowValue }> }) => {
      const cells = row?.c ?? [];
      return columns.map((_: unknown, index: number) => {
        const cell = cells[index];
        const value =
          cell?.f !== undefined && cell.f !== null
            ? cell.f
            : cell?.v !== undefined
              ? cell.v
              : null;
        return typeof value === "string" ? value.trim() : value;
      });
    },
  );

  const hasMeaningfulLabels = columns.some(
    (key: unknown, index: number) =>
      key &&
      key !== `col_${index}` &&
      !/^[a-z]$/.test(String(key)) &&
      !/^col_\d+$/.test(String(key)),
  );

  let dataMatrix = matrix;

  if (!hasMeaningfulLabels && matrix.length > 0) {
    const headerRow = matrix[0];
    const derivedHeaders = headerRow.map((value, index) => {
      if (typeof value === "string" && value.trim().length > 0) {
        const normalized = normalizeKey(value, index);
        if (normalized && normalized !== `col_${index}`) {
          return normalized;
        }
      }
      return `col_${index}`;
    });

    const hasUsefulHeader = derivedHeaders.some(
      (header, index) => header !== `col_${index}`,
    );

    if (hasUsefulHeader) {
      columns = derivedHeaders;
      dataMatrix = matrix.slice(1);
    } else if (matrix.length > 1) {
      const secondRow = matrix[1];
      const derivedFromSecondRow = secondRow.map((value, index) => {
        if (typeof value === "string" && value.trim().length > 0) {
          const normalized = normalizeKey(value, index);
          if (normalized && normalized !== `col_${index}`) {
            return normalized;
          }
        }
        return `col_${index}`;
      });

      const hasHeadersFromSecondRow = derivedFromSecondRow.some(
        (header, index) => header !== `col_${index}`,
      );

      if (hasHeadersFromSecondRow) {
        columns = derivedFromSecondRow;
        dataMatrix = matrix.slice(1);
      }
    }
  }

  const debugPayload = {
    columns,
    matrix,
    dataMatrix,
  };

  if (typeof window !== "undefined") {
    (window as typeof window & {
      __lastSheetDebug?: {
        columns: string[];
        matrix: SheetRowValue[][];
        dataMatrix: SheetRowValue[][];
      };
    }).__lastSheetDebug = debugPayload;
  }

  console.log(
    typeof window === "undefined" ? "Sheet debug (server)" : "Sheet debug",
    debugPayload,
  );

  return dataMatrix
    .map((rowValues) => {
      const record: SheetRow = {};
      columns.forEach((columnKey: unknown, index: number) => {
        record[String(columnKey)] =
          rowValues[index] ?? null;
      });
      return record;
    })
    .filter((row: SheetRow) =>
      Object.values(row).some((value) => value !== null && value !== ""),
    );
};

const buildSheetUrl = (sheet: string, gid?: string, queryString?: string) => {
  if (!SHEETS_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SHEETS_BASE_URL environment variable");
  }

  const url = new URL(SHEETS_BASE_URL);
  if (gid) {
    url.searchParams.set("gid", gid);
  } else {
    url.searchParams.set("sheet", sheet);
  }
  if (queryString) {
    url.searchParams.set("q", queryString);
  }
  
  const finalUrl = url.toString();
  console.log("Google Sheets URL:", finalUrl);
  return finalUrl;
};

export const useFetchSheetData = <TData,>(
  sheet: string,
  options: Options<TData> = {},
): SheetState<TData> => {
  const { enabled = true, queryString, gid, mapRow } = options;
  const [data, setData] = useState<TData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<Error>();

  const mapRowRef = useRef<Options<TData>["mapRow"]>(mapRow);

  useEffect(() => {
    mapRowRef.current = mapRow;
  }, [mapRow]);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setData([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(undefined);
      
      // Debug para entender o que está acontecendo no Vercel
      console.log("Fetching sheet data:", {
        sheet,
        gid,
        queryString,
        enabled,
        hasEnvVar: Boolean(process.env.NEXT_PUBLIC_SHEETS_BASE_URL),
        envVar: process.env.NEXT_PUBLIC_SHEETS_BASE_URL,
        sheetsBaseUrl: SHEETS_BASE_URL,
      });
      
      const response = await fetch(buildSheetUrl(sheet, gid, queryString), {
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`Sheets request failed with ${response.status}`);
      }

      const payload = await response.text();
      console.log("Raw sheet payload", payload.slice(0, 120));
      const parsedRows = parseSheetResponse(payload);
      if (typeof window !== "undefined") {
        (window as typeof window & { __parsedRows?: SheetRow[] }).__parsedRows =
          parsedRows;
      }
      console.log("Parsed sheet rows", parsedRows);
      const mapper = mapRowRef.current;
      const mapped = mapper
        ? parsedRows
            .map((row, index) => mapper(row, index))
            .filter(Boolean) as TData[]
        : (parsedRows as unknown as TData[]);
      setData(mapped);
    } catch (err) {
      console.error("Sheet fetch error", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [enabled, queryString, sheet, gid]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    data,
    isLoading,
    error,
    refresh,
  };
};
