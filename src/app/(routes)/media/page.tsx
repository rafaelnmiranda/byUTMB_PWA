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

const fallbackMedia: MediaEntry[] = [
  {
    sectionId: "highlights",
    sectionTitle: "Highlights",
    id: "highlight-1",
    title: "Paraty Brazil by UTMB - Highlights",
    videoId: "dQw4w9WgXcQ", // Placeholder YouTube ID
    description: "Melhores momentos do evento Paraty Brazil by UTMB",
  },
  {
    sectionId: "briefings",
    sectionTitle: "Briefings",
    id: "briefing-1", 
    title: "Briefing Técnico - PTR 20",
    videoId: "dQw4w9WgXcQ", // Placeholder YouTube ID
    description: "Instruções técnicas para a prova PTR 20",
  },
];

const MediaPage = () => {
  const t = useTranslate();

  const mapMediaRow = (row: SheetRow, index: number): MediaEntry | null => {
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

  const { data: sheetMedia, isLoading, error } = useFetchSheetData<MediaEntry>("videos", {
    enabled: true, // Sempre tentar carregar, mesmo sem env var
    gid: SHEET_GIDS.videos,
    mapRow: mapMediaRow,
  });


  const mediaEntries = useMemo(() => {
    // Se está carregando e não tem dados ainda, não mostra fallbacks
    if (isLoading && sheetMedia.length === 0) {
      return [];
    }
    
    // Se tem dados do Google Sheets, usa eles
    if (sheetMedia.length > 0) {
      return sheetMedia;
    }
    
    // Se não está carregando e não tem dados, mostra fallbacks
    return fallbackMedia;
  }, [sheetMedia, isLoading]);


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

      {isLoading && (
        <div className="flex flex-col items-center gap-3 py-8">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-teal border-t-transparent"></div>
          <p className="text-sm text-muted">Carregando vídeos...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-brand-yellow/30 bg-brand-yellow/10 p-4">
          <p className="text-sm text-brand-yellow">
            ⚠️ Falha ao carregar vídeos do Google Sheets. Exibindo conteúdo padrão.
          </p>
          <p className="text-xs text-muted mt-2">
            Erro: {error.message}
          </p>
        </div>
      )}


      {!isLoading && sections.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-8">
          <p className="text-sm text-muted">Nenhum vídeo disponível no momento.</p>
        </div>
      )}

      {!isLoading && sections.map((section) => (
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
