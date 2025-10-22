"use client";

import { useMemo } from "react";
import VideoCard from "../../components/VideoCard";
import { useFetchSheetData, type SheetRow } from "../../hooks/useFetchSheetData";
import { useTranslate } from "../../hooks/useLanguage";
import { SHEET_GIDS } from "../../assets/sheets";

type MediaEntry = {
  sectionId: string;
  sectionTitle: string;
  id: string;
  title: string;
  videoId: string;
  description?: string;
};

const extractYouTubeId = (input: string) => {
  const trimmed = input.trim();
  const idPattern = /^[a-zA-Z0-9_-]{11}$/;
  if (idPattern.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const candidate = url.pathname.split("/").filter(Boolean)[0] ?? "";
      if (idPattern.test(candidate)) {
        return candidate;
      }
    }

    if (host.endsWith("youtube.com")) {
      const paramId = url.searchParams.get("v");
      if (paramId && idPattern.test(paramId)) {
        return paramId;
      }

      const segments = url.pathname.split("/").filter(Boolean);
      for (let index = segments.length - 1; index >= 0; index -= 1) {
        const candidate = segments[index];
        if (idPattern.test(candidate)) {
          return candidate;
        }
      }
    }
  } catch {
    // ignore parse errors
  }

  const fallback = trimmed.match(/[a-zA-Z0-9_-]{11}/);
  return fallback ? fallback[0] : "";
};

const MediaPage = () => {
  const t = useTranslate();

  const mapMediaRow = (row: SheetRow, index: number): MediaEntry | null => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("Media row", index, row);
    }
    const title =
      typeof row.titulo === "string"
        ? row.titulo
        : typeof row.nome === "string"
          ? row.nome
          : undefined;
    const videoValue =
      typeof row.video === "string"
        ? row.video
        : typeof row.link === "string"
          ? row.link
          : undefined;

    if (!title || !videoValue) {
      return null;
    }

    const videoId = extractYouTubeId(videoValue);
    if (!videoId) {
      return null;
    }

    const section =
      typeof row.secao === "string"
        ? row.secao
        : typeof row.categoria === "string"
          ? row.categoria
          : "Media";

    const sectionId = section
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return {
      sectionId: sectionId || `section-${index}`,
      sectionTitle: section,
      id:
        typeof row.id === "string" && row.id.length > 0
          ? row.id
          : `${sectionId}-${index}`,
      title,
      videoId,
      description:
        typeof row.descricao === "string" ? row.descricao : undefined,
    };
  };

  const { data: mediaEntries } = useFetchSheetData<MediaEntry>("videos", {
    enabled: Boolean(process.env.NEXT_PUBLIC_SHEETS_BASE_URL),
    gid: SHEET_GIDS.videos,
    mapRow: mapMediaRow,
  });

  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    (window as typeof window & {
      __mediaEntries?: MediaEntry[];
    }).__mediaEntries = mediaEntries;
    console.debug("Media entries", mediaEntries);
  }

  const sections = useMemo(() => {
    const grouped = new Map<string, MediaEntry[]>();

    mediaEntries.forEach((entry) => {
      const list = grouped.get(entry.sectionId);
      if (list) {
        list.push(entry);
      } else {
        grouped.set(entry.sectionId, [entry]);
      }
    });

    return Array.from(grouped.entries()).map(([sectionId, items]) => ({
      id: sectionId,
      title: items[0]?.sectionTitle ?? sectionId,
      items,
    }));
  }, [mediaEntries]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-primary">
          {t("media.title")}
        </h1>
        <p className="text-sm text-muted">{t("media.description")}</p>
      </header>

      {sections.map((section) => (
        <section key={section.id} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-brand-yellow">
            {section.title}
          </h2>
          <div className="flex flex-col gap-5">
            {section.items.map((item) => (
              <VideoCard
                key={item.id}
                title={item.title}
                videoId={item.videoId}
                description={item.description}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MediaPage;
