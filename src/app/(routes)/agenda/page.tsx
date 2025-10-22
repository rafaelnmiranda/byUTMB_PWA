"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Card from "../../components/Card";
import FilterTabs from "../../components/FilterTabs";
import MapLink from "../../components/MapLink";
import { useFetchSheetData, type SheetRow } from "../../hooks/useFetchSheetData";
import { useTranslate } from "../../hooks/useLanguage";
import { SHEET_GIDS } from "../../assets/sheets";

type AgendaItem = {
  id: string;
  dateISO: string;
  weekday: string;
  weekdayLabel: string;
  categoria: "Sports" | "Entertainment" | "Brand Activations";
  titulo: string;
  hora_inicio: string;
  hora_fim?: string;
  local: string;
  link_maps?: string;
  descricao?: string;
  imagem?: string;
};

type FallbackAgendaItem = {
  id: string;
  dia: string;
  categoria: AgendaItem["categoria"];
  titulo: string;
  hora_inicio: string;
  hora_fim?: string;
  local: string;
  link_maps?: string;
  descricao?: string;
};

const fallbackAgenda: FallbackAgendaItem[] = [
  {
    id: "1",
    dia: "qui",
    categoria: "Brand Activations",
    titulo: "Retirada de Kit • Arena Village",
    hora_inicio: "10:00",
    hora_fim: "18:00",
    local: "Arena Village",
    link_maps: "https://maps.google.com",
    descricao: "Garanta seu kit oficial e aproveite as ativações dos parceiros.",
  },
  {
    id: "2",
    dia: "sex",
    categoria: "Sports",
    titulo: "Briefing Técnico PTR 35",
    hora_inicio: "19:00",
    local: "Auditório Principal",
    descricao: "Últimos detalhes sobre percurso, logística e regras da prova.",
  },
  {
    id: "3",
    dia: "sab",
    categoria: "Sports",
    titulo: "Largada UTSB 110",
    hora_inicio: "04:00",
    local: "Igreja da Matriz, Centro Histórico",
    link_maps: "https://maps.google.com",
  },
];

const weekdayKeys = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"] as const;
const weekdayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"] as const;

const normalizeDate = (value: SheetRow["data"]) => {
  if (typeof value === "string") {
    // Accept ISO (2025-09-18) or BR format (18/09/2025)
    if (/^\d{4}-\d{2}-\d{2}/.test(value)) {
      return value;
    }
    if (/^\d{2}\/\d{2}\/\d{4}/.test(value)) {
      const [day, month, year] = value.split("/");
      return `${year}-${month}-${day}`;
    }
  }
  return undefined;
};

const normalizeTime = (value: SheetRow["hora"]) => {
  if (typeof value === "string" && /^\d{1,2}:\d{2}/.test(value)) {
    const formatted = value.length === 5 ? value : value.padStart(5, "0");
    return formatted;
  }
  if (typeof value === "number") {
    const totalMinutes = Math.round(value * 24 * 60);
    const hours = Math.floor(totalMinutes / 60)
      .toString()
      .padStart(2, "0");
    const minutes = (totalMinutes % 60).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }
  return undefined;
};

const parseDurationMinutes = (value: SheetRow["duracao"]) => {
  if (typeof value === "number") {
    return Math.round(value / 60);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value.replace(",", "."));
    if (!Number.isNaN(parsed)) {
      // assume seconds if >= 100, otherwise minutes
      return parsed >= 100 ? Math.round(parsed / 60) : Math.round(parsed);
    }
  }
  return undefined;
};

const addMinutesToTime = (time: string, minutesToAdd: number) => {
  const [hours, minutes] = time.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return undefined;
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const normalized = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60);
  const endHours = Math.floor(normalized / 60)
    .toString()
    .padStart(2, "0");
  const endMinutes = (normalized % 60).toString().padStart(2, "0");
  return `${endHours}:${endMinutes}`;
};

const normalizeCategory = (value: SheetRow["tipo"]): AgendaItem["categoria"] => {
  const normalized = typeof value === "string" ? value.toLowerCase() : "";
  if (normalized.includes("esporte")) return "Sports";
  if (normalized.includes("entreten") || normalized.includes("media")) return "Entertainment";
  return "Brand Activations";
};

const formatDateLabel = (isoDate: string) => {
  try {
    const date = new Date(`${isoDate}T00:00:00`);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    })
      .format(date)
      .replace(".", "")
      .toUpperCase();
  } catch {
    return isoDate;
  }
};

const AgendaPage = () => {
  const t = useTranslate();
  const [day, setDay] = useState<string>("all");
  const [category, setCategory] = useState<string>("all");

  const mapAgendaRow = useCallback(
    (row: SheetRow, index: number): AgendaItem | null => {
      const rawDate = normalizeDate(row.data);
      const title = typeof row.titulo === "string" ? row.titulo : undefined;
      if (!rawDate || !title) {
        return null;
      }

      const dateInstance = new Date(`${rawDate}T00:00:00`);
      const weekdayIndex = dateInstance.getUTCDay();
      const weekday = weekdayKeys[weekdayIndex] ?? "qui";
      const weekdayLabel = weekdayLabels[weekdayIndex] ?? "Qui";

      const startTime = normalizeTime(row.hora);
      const explicitEnd =
        typeof row.hora_fim === "string"
          ? row.hora_fim
          : typeof row.fim === "string"
            ? row.fim
            : undefined;
      const durationMinutes = parseDurationMinutes(row.duracao);
      const computedEnd =
        explicitEnd ??
        (startTime && durationMinutes
          ? addMinutesToTime(startTime, durationMinutes)
          : undefined);

      const location =
        typeof row.local === "string"
          ? row.local
          : typeof row.area === "string"
            ? row.area
            : typeof row.setor === "string"
              ? row.setor
              : typeof row.espaco === "string"
                ? row.espaco
                : typeof row.tipo === "string"
                  ? row.tipo.toUpperCase()
                  : "";

      return {
        id: `${rawDate}-${index}`,
        dateISO: rawDate,
        weekday,
        weekdayLabel,
        categoria: normalizeCategory(row.tipo),
        titulo: title,
        hora_inicio: startTime ?? "00:00",
        hora_fim: computedEnd,
        local: location,
        descricao: typeof row.descricao === "string" ? row.descricao : undefined,
        link_maps:
          typeof row.link_maps === "string"
            ? row.link_maps
            : typeof row.maps === "string"
              ? row.maps
              : undefined,
        imagem:
          typeof row.imagem === "string"
            ? row.imagem
            : typeof row.cover === "string"
              ? row.cover
              : undefined,
      };
    },
    [],
  );

  const { data, isLoading, error } = useFetchSheetData<AgendaItem>("dados", {
    enabled: Boolean(process.env.NEXT_PUBLIC_SHEETS_BASE_URL),
    gid: SHEET_GIDS.dados,
    mapRow: mapAgendaRow,
  });

  const agendaItems = useMemo(() => {
    // Se está carregando e não tem dados ainda, não mostra fallbacks
    if (isLoading && data.length === 0) {
      return [];
    }
    
    // Se tem dados do Google Sheets, usa eles
    if (data.length > 0) {
      return data;
    }
    
    // Se não está carregando e não tem dados, mostra fallbacks
    return fallbackAgenda.map((item) => {
      const weekdayIndex = weekdayKeys.indexOf(item.dia as (typeof weekdayKeys)[number]);
      const label = weekdayIndex >= 0 ? weekdayLabels[weekdayIndex] : item.dia.toUpperCase();
      return {
        id: item.id,
        dateISO: "2025-09-18",
        weekday: item.dia,
        weekdayLabel: label,
        categoria: item.categoria,
        titulo: item.titulo,
        hora_inicio: item.hora_inicio,
        hora_fim: item.hora_fim,
        local: item.local ?? "",
        descricao: item.descricao,
        link_maps: item.link_maps,
        imagem: undefined,
      } satisfies AgendaItem;
    });
  }, [data, isLoading]);

  const categoryLabelMap = useMemo(
    () => ({
      Sports: t("agenda.categories.sports"),
      Entertainment: t("agenda.categories.entertainment"),
      "Brand Activations": t("agenda.categories.brand"),
    }),
    [t],
  );

  const sortedAgendaItems = useMemo(() => {
    return [...agendaItems].sort((a, b) => {
      const dateCompare = a.dateISO.localeCompare(b.dateISO);
      if (dateCompare !== 0) return dateCompare;
      return a.hora_inicio.localeCompare(b.hora_inicio);
    });
  }, [agendaItems]);

  const dayTabs = useMemo(() => {
    const seen = new Set<string>();
    const result: { value: string; label: string }[] = [];

    sortedAgendaItems.forEach((item) => {
      if (!seen.has(item.weekday)) {
        seen.add(item.weekday);
        result.push({ value: item.weekday, label: item.weekdayLabel });
      }
    });

    return [{ value: "all", label: t("agenda.filters.allDays") }, ...result];
  }, [sortedAgendaItems, t]);

  const categoryTabs = useMemo(() => {
    const seen = new Set<AgendaItem["categoria"]>();
    const result: { value: string; label: string }[] = [];

    sortedAgendaItems.forEach((item) => {
      if (!seen.has(item.categoria)) {
        seen.add(item.categoria);
        result.push({
          value: item.categoria,
          label: categoryLabelMap[item.categoria] ?? item.categoria,
        });
      }
    });

    return [{ value: "all", label: t("agenda.filters.allCategories") }, ...result];
  }, [categoryLabelMap, sortedAgendaItems, t]);

  useEffect(() => {
    if (day !== "all" && !dayTabs.some((tab) => tab.value === day)) {
      setDay("all");
    }
  }, [day, dayTabs]);

  useEffect(() => {
    if (category !== "all" && !categoryTabs.some((tab) => tab.value === category)) {
      setCategory("all");
    }
  }, [category, categoryTabs]);

  const filteredItems = useMemo(() => {
    return sortedAgendaItems.filter((item) => {
      const matchDay = day === "all" || item.weekday === day;
      const matchCategory = category === "all" || item.categoria === category;
      return matchDay && matchCategory;
    });
  }, [sortedAgendaItems, category, day]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-primary">{t("agenda.title")}</h1>
        <p className="text-sm text-muted">{t("agenda.description")}</p>
      </header>

      <section className="flex flex-col gap-4">
        <FilterTabs tabs={dayTabs} activeValue={day} onChange={setDay} />
        <FilterTabs
          tabs={categoryTabs}
          activeValue={category}
          onChange={setCategory}
        />
      </section>

      {isLoading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-teal border-t-transparent"></div>
          <p className="text-sm text-muted">Carregando agenda em tempo real...</p>
        </div>
      )}

      {error && (
        <p className="text-xs text-brand-yellow/80">
          Falha ao sincronizar com Google Sheets. Exibindo programação padrão.
        </p>
      )}

      {!isLoading && (
        <section className="flex flex-col gap-4">
        {filteredItems.length === 0 && (
          <p className="text-sm text-muted">{t("agenda.empty")}</p>
        )}

        {filteredItems.map((item) => {
          const timeLabel = item.hora_inicio
            ? item.hora_fim
              ? `${item.hora_inicio} • ${item.hora_fim}`
              : item.hora_inicio
            : undefined;
          const locationLabel =
            typeof item.local === "string" && item.local.trim().length > 0
              ? item.local
              : undefined;
          const categoryLabel = categoryLabelMap[item.categoria] ?? item.categoria;

          return (
            <Card
              key={item.id}
              badge={`${item.weekdayLabel} • ${formatDateLabel(item.dateISO)}`}
              title={item.titulo}
              subtitle={timeLabel}
              description={item.descricao}
              meta={locationLabel}
              footer={
                item.link_maps ? (
                  <MapLink href={item.link_maps} />
                ) : (
                  <span>{categoryLabel}</span>
                )
              }
            />
          );
        })}
        </section>
      )}
    </div>
  );
};

export default AgendaPage;
