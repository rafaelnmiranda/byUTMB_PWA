"use client";

import Image from "next/image";
import { useCallback, useMemo } from "react";
import Card from "../../components/Card";
import MapLink from "../../components/MapLink";
import { useFetchSheetData, type SheetRow } from "../../hooks/useFetchSheetData";
import { useTranslate } from "../../hooks/useLanguage";
import { SHEET_GIDS } from "../../assets/sheets";
import StravaRouteEmbed from "../../components/StravaRouteEmbed";

type Race = {
  id: string;
  nome: string;
  distancia: string;
  elevacao: string;
  horario: string;
  dataISO?: string;
  dataLabel?: string;
  largada: string;
  chegada: string;
  link_gpx?: string;
  link_mapa_strava?: string;
  imagem_altimetria?: string;
  stravaEmbedId?: string;
  stravaEmbedMapHash?: string;
  stravaEmbedClubId?: string;
  stravaEmbedStyle?: "standard" | "minimal";
  site?: string;
  tempoCorte?: string;
};

const racesFallback: Race[] = [
  {
    id: "fun7",
    nome: "Fun 7K",
    distancia: "7 km",
    elevacao: "+180 m",
    horario: "08:00",
    dataISO: "2025-09-06",
    dataLabel: "06 set",
    largada: "Pontal Beach",
    chegada: "Arena Village",
    link_mapa_strava: "https://www.strava.com",
  },
  {
    id: "ptr20",
    nome: "PTR 20",
    distancia: "20 km",
    elevacao: "+1.100 m",
    horario: "07:00",
    dataISO: "2025-09-06",
    dataLabel: "06 set",
    largada: "Centro Histórico",
    chegada: "Praça da Matriz",
    link_gpx: "#",
    link_mapa_strava: "https://www.strava.com",
  },
  {
    id: "utsb110",
    nome: "UTSB 110",
    distancia: "110 km",
    elevacao: "+5.700 m",
    horario: "04:00",
    dataISO: "2025-09-06",
    dataLabel: "06 set",
    largada: "Igreja da Matriz",
    chegada: "Arena Village",
    link_gpx: "#",
    link_mapa_strava: "https://www.strava.com",
  },
];

const parseRaceDate = (value: SheetRow["data"]) => {
  if (typeof value !== "string") {
    return { iso: undefined, label: undefined };
  }

  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (!match) {
    return { iso: undefined, label: undefined };
  }

  const [, dayRaw, monthRaw, yearRaw] = match;
  const day = dayRaw.padStart(2, "0");
  const month = monthRaw.padStart(2, "0");
  let year = yearRaw;

  if (year.length === 2) {
    const numeric = Number(year);
    year = (numeric >= 70 ? 1900 + numeric : 2000 + numeric).toString();
  }

  const iso = `${year}-${month}-${day}`;

  try {
    const formatted = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    })
      .format(new Date(`${iso}T00:00:00`))
      .replace(".", "");
    const cleaned = formatted.replace(" de ", " ").toLowerCase();
    return { iso, label: cleaned };
  } catch {
    return { iso, label: undefined };
  }
};

const extractStravaEmbedId = (...candidates: Array<SheetRow[string]>) => {
  for (const value of candidates) {
    if (typeof value === "string" && value.trim().length > 0) {
      const match = value.match(/(\d{6,})/);
      if (match) {
        return match[1];
      }
    }
  }
  return undefined;
};

const extractStravaStyle = (value: SheetRow[string]): Race["stravaEmbedStyle"] => {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "minimal") {
      return "minimal";
    }
  }
  return "standard";
};

const RacePage = () => {
  const t = useTranslate();

  const mapRaceRow = useCallback(
    (row: SheetRow, index: number): Race | null => {
      const name =
        typeof row.nome === "string"
          ? row.nome
          : typeof row.prova === "string"
            ? row.prova
            : undefined;
      if (!name) {
        return null;
      }

      const distance =
        typeof row.distancia === "string"
          ? row.distancia
          : typeof row.distance === "string"
            ? row.distance
            : "";

      const elevation =
        typeof row.elevacao === "string"
          ? row.elevacao
          : typeof row.altimetria === "string"
            ? row.altimetria
            : "";

      const schedule =
        typeof row.horario === "string"
          ? row.horario
          : typeof row.start_time === "string"
            ? row.start_time
            : "";

      const { iso: dateISO, label: dateLabel } = parseRaceDate(row.data);
      const stravaLink =
        typeof row.link_mapa_strava === "string"
          ? row.link_mapa_strava
          : typeof row.strava === "string"
            ? row.strava
            : undefined;
      const stravaEmbedId = extractStravaEmbedId(
        row.strava_embed_id,
        row.strava_id,
        row.strava_route_id,
        stravaLink || "",
      );
      const stravaMapHash =
        typeof row.strava_map_hash === "string" ? row.strava_map_hash : undefined;
      const stravaClubId =
        typeof row.strava_club_id === "string" ? row.strava_club_id : undefined;
      const stravaStyle = extractStravaStyle(row.strava_embed_style);
      const site =
        typeof row.site === "string"
          ? row.site
          : typeof row.website === "string"
            ? row.website
            : undefined;
      const tempoCorte =
        typeof row.tempo_corte === "string"
          ? row.tempo_corte
          : typeof row.cutoff === "string"
            ? row.cutoff
            : undefined;

      return {
        id:
          typeof row.id === "string" && row.id.length > 0 ? row.id : `${index}`,
        nome: name,
        distancia: distance,
        elevacao: elevation,
        horario: schedule,
        dataISO: dateISO,
        dataLabel: dateLabel,
        largada:
          typeof row.largada === "string"
            ? row.largada
            : typeof row.start === "string"
              ? row.start
              : "",
        chegada:
          typeof row.chegada === "string"
            ? row.chegada
            : typeof row.finish === "string"
              ? row.finish
              : "",
        link_gpx:
          typeof row.link_gpx === "string"
            ? row.link_gpx
            : typeof row.gpx === "string"
              ? row.gpx
              : undefined,
        link_mapa_strava: stravaLink,
        imagem_altimetria:
          typeof row.imagem_altimetria === "string"
            ? row.imagem_altimetria
            : typeof row.altimetria_img === "string"
              ? row.altimetria_img
              : undefined,
        stravaEmbedId,
        stravaEmbedMapHash: stravaMapHash,
        stravaEmbedClubId: stravaClubId,
        stravaEmbedStyle: stravaStyle,
        site,
        tempoCorte,
      };
    },
    [],
  );

  const { data: sheetRaces, isLoading } = useFetchSheetData<Race>("percursos", {
    enabled: Boolean(process.env.NEXT_PUBLIC_SHEETS_BASE_URL),
    gid: SHEET_GIDS.percursos,
    mapRow: mapRaceRow,
  });

  const races = useMemo(() => {
    // Se está carregando e não tem dados ainda, não mostra fallbacks
    if (isLoading && sheetRaces.length === 0) {
      return [];
    }
    
    // Se tem dados do Google Sheets, usa eles
    if (sheetRaces.length > 0) {
      return sheetRaces;
    }
    
    // Se não está carregando e não tem dados, mostra fallbacks
    return racesFallback;
  }, [sheetRaces, isLoading]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-primary">{t("races.title")}</h1>
        <p className="text-sm text-muted">{t("races.description")}</p>
      </header>

      {isLoading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-teal border-t-transparent"></div>
          <p className="text-sm text-muted">Carregando percursos em tempo real...</p>
        </div>
      )}

      {!isLoading && (
        <section className="flex flex-col gap-4">
        {races.map((race) => {
          const subtitleParts = [
            race.distancia,
            race.elevacao,
            race.tempoCorte ? `Tempo limite: ${race.tempoCorte}` : undefined,
          ].filter((value): value is string => Boolean(value && value.length > 0));
          const subtitle = subtitleParts.join(" • ");
          const scheduleParts = [race.dataLabel, race.horario]
            .filter((value): value is string => Boolean(value && value.length > 0))
            .join(" • ");
          const locationParts = [race.largada, race.chegada]
            .filter((value): value is string => Boolean(value && value.length > 0))
            .join(" → ");
          const description = [scheduleParts, locationParts]
            .filter((value) => value.length > 0)
            .join(" • ");

          return (
            <Card
              key={race.id}
              title={race.nome}
              subtitle={subtitle}
              description={description}
              media={
                <div className="flex flex-col gap-4">
                  {race.imagem_altimetria && (
                    <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-surface-alt">
                      <Image
                        src={race.imagem_altimetria}
                        alt={`Altimetria ${race.nome}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 360px"
                      />
                    </div>
                  )}
                  {race.stravaEmbedId && (
                    <div className="flex justify-center">
                      <div className="w-full max-w-3xl">
                        <StravaRouteEmbed
                          embedId={race.stravaEmbedId}
                          mapHash={race.stravaEmbedMapHash}
                          clubId={race.stravaEmbedClubId}
                          style={race.stravaEmbedStyle}
                        />
                      </div>
                    </div>
                  )}
                </div>
              }
              footer={
                <div className="flex w-full flex-wrap items-center justify-between gap-2 text-xs text-muted">
                  {race.site ? (
                    <a
                      href={race.site}
                      target={race.site.startsWith("http") ? "_blank" : undefined}
                      rel={race.site.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-primary/15"
                    >
                      + detalhes
                    </a>
                  ) : (
                    <span />
                  )}
                  {race.stravaEmbedId ? (
                    <span className="uppercase tracking-wide text-muted">Strava Route</span>
                  ) : race.link_mapa_strava ? (
                    <MapLink href={race.link_mapa_strava} label="Strava" />
                  ) : (
                    <span />
                  )}
                  {race.link_gpx ? (
                    <a
                      href={race.link_gpx}
                      className="rounded-full border border-subtle px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary"
                      target={race.link_gpx.startsWith("http") ? "_blank" : undefined}
                      rel={race.link_gpx.startsWith("http") ? "noopener noreferrer" : undefined}
                    >
                      GPX
                    </a>
                  ) : (
                    <span />
                  )}
                </div>
              }
            />
          );
        })}
        </section>
      )}
    </div>
  );
};

export default RacePage;
