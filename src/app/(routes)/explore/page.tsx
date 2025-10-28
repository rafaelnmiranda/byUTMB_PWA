"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import MapLink from "../../components/MapLink";
import FilterTabs from "../../components/FilterTabs";
import { useTranslate } from "../../hooks/useLanguage";
import { useFetchSheetData, type SheetRow } from "../../hooks/useFetchSheetData";
import { SHEET_GIDS } from "../../assets/sheets";

type PartnerEntry = {
  id: string;
  name: string;
  benefits?: string;
  description?: string;
  promoCode?: string;
  website?: string;
  mapsUrl?: string;
  location?: string;
  category: string;
  logo?: string;
  cover?: string;
};

const normalizeImagePath = (value?: string | null) => {
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("/")) {
    return trimmed;
  }
  const withExtension = /\.\w+$/.test(trimmed) ? trimmed : `${trimmed}.jpg`;
  return `/images/partners/${withExtension}`;
};

const fallbackPartners: PartnerEntry[] = [
  {
    id: "pupus",
    name: "Pupu's Panc Paraty",
    benefits: "Sábado de degustação 10% de desconto",
    description:
      "Creperia local com menu especial para atletas durante o evento.",
    promoCode: "UTMBPUPU10",
    website: "https://www.instagram.com/pupusparaty",
    mapsUrl: "https://maps.app.goo.gl/SNiwS9weV87kHiiN8",
    category: "food",
    logo: "/images/partners/pupus_logo.png",
    cover: "/images/partners/pupus_cover.jpg",
  },
  {
    id: "hoka",
    name: "Hoka",
    benefits: "Marca global de 15% de desconto",
    description: "Tenda oficial com os principais lançamentos da Hoka.",
    promoCode: "UTMBHOKA15",
    website: "https://www.hoka.com",
    mapsUrl: "https://maps.app.goo.gl/szJR3yOSaKrS",
    category: "running",
    logo: "/images/partners/hoka_logo.png",
    cover: "/images/partners/hoka_cover.jpg",
  },
];

const ExplorePage = () => {
  const t = useTranslate();
  const [category, setCategory] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const mapPartnerRow = useCallback(
    (row: SheetRow, index: number): PartnerEntry | null => {
      const name =
        typeof row.name === "string"
          ? row.name
          : typeof row.nome === "string"
            ? row.nome
            : undefined;
      if (!name) {
        return null;
      }

      const category =
        typeof row.category === "string"
          ? row.category
          : typeof row.categoria === "string"
            ? row.categoria
            : "other";

      const promoCode =
        typeof row.promocode === "string"
          ? row.promocode
          : typeof row.promo_code === "string"
            ? row.promo_code
            : undefined;

      const website =
        typeof row.website === "string"
          ? row.website
          : typeof row.site === "string"
            ? row.site
            : undefined;

      const mapsUrl =
        typeof row.maps === "string"
          ? row.maps
          : typeof row.location_url === "string"
            ? row.location_url
            : typeof row.location === "string" && row.location.startsWith("http")
              ? row.location
              : undefined;

      return {
        id: typeof row.id === "string" && row.id.length > 0 ? row.id : `partner-${index}`,
        name,
        benefits:
          typeof row.benefits === "string"
            ? row.benefits
            : typeof row.vantagens === "string"
              ? row.vantagens
              : undefined,
        description:
          typeof row.description === "string"
            ? row.description
            : typeof row.descricao === "string"
              ? row.descricao
              : undefined,
        promoCode: promoCode ?? undefined,
        website: website ?? undefined,
        mapsUrl,
        location:
          typeof row.location === "string" && !row.location.startsWith("http")
            ? row.location
            : undefined,
        category,
        logo: normalizeImagePath(
          typeof row.logo === "string" ? row.logo : typeof row.partner_logo === "string" ? row.partner_logo : undefined,
        ),
        cover: normalizeImagePath(
          typeof row.partner_cover === "string"
            ? row.partner_cover
            : typeof row.cover === "string"
              ? row.cover
              : undefined,
        ),
      };
    },
    [],
  );

  const { data: sheetPartners } = useFetchSheetData<PartnerEntry>("parceiros", {
    enabled: true, // Sempre tentar carregar, mesmo sem env var
    gid: SHEET_GIDS.parceiros,
    mapRow: mapPartnerRow,
  });

  const partners = sheetPartners.length ? sheetPartners : fallbackPartners;

  const categories = useMemo(() => {
    const unique = new Map<string, string>();
    partners.forEach((partner) => {
      const value = partner.category.trim();
      if (!unique.has(value)) {
        unique.set(value, value);
      }
    });
    return Array.from(unique.values());
  }, [partners]);

  const categoryTabs = useMemo(() => {
    const base = [{ value: "all", label: t("explore.filters.all") }];
    const rest = categories.map((value) => ({
      value,
      label: value,
    }));
    return [...base, ...rest];
  }, [categories, t]);

  useEffect(() => {
    if (category !== "all" && !categories.includes(category)) {
      setCategory("all");
    }
  }, [categories, category]);

  useEffect(() => {
    setExpandedId(null);
  }, [category]);

  const filteredPartners = useMemo(() => {
    const list = category === "all"
      ? partners
      : partners.filter((partner) => partner.category === category);
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [partners, category]);

  const togglePartner = useCallback(
    (id: string) => {
      setExpandedId((current) => (current === id ? null : id));
    },
    [],
  );

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-primary">{t("explore.title")}</h1>
        <p className="text-sm text-muted">{t("explore.description")}</p>
      </header>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-brand-yellow">{t("explore.sections.partners")}</h2>
          <FilterTabs tabs={categoryTabs} activeValue={category} onChange={setCategory} />
        </div>

        <div className="flex flex-col gap-4">
          {filteredPartners.length === 0 && (
            <p className="text-sm text-muted">{t("explore.empty.partners")}</p>
          )}

          {filteredPartners.map((partner) => {
            const isExpanded = partner.id === expandedId;

            return (
              <article
                key={partner.id}
                className={`rounded-3xl border bg-card-surface shadow-subtle transition-all ${
                  isExpanded ? "border-strong shadow-lg" : "border-subtle"
                }`}
              >
                <button
                  type="button"
                  onClick={() => togglePartner(partner.id)}
                  className="flex w-full items-center gap-4 p-5 text-left"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-subtle bg-surface-alt">
                    {partner.logo ? (
                      <Image
                        src={partner.logo}
                        alt={partner.name}
                        fill
                        className="object-contain p-3"
                        sizes="80px"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-muted">
                        {partner.name.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-teal/15 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-brand-teal">
                        {partner.category}
                      </span>
                      {partner.location && (
                        <span className="text-xs uppercase tracking-wide text-muted">
                          {partner.location}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-primary">{partner.name}</h3>
                    {partner.benefits && (
                      <p className="text-sm text-muted">{partner.benefits}</p>
                    )}
                  </div>
                  <span
                    className={`transition-transform ${
                      isExpanded ? "rotate-90 text-brand-teal" : "text-muted"
                    }`}
                    aria-hidden
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="m9 6 6 6-6 6"
                        stroke="currentColor"
                        strokeWidth={1.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>

                {isExpanded && (
                  <div className="flex flex-col gap-4 border-t border-subtle px-5 pb-5">
                    {partner.cover && (
                      <div className="relative h-44 w-full overflow-hidden rounded-2xl">
                        <Image
                          src={partner.cover}
                          alt={`Cover ${partner.name}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 420px"
                        />
                      </div>
                    )}
                    {partner.description && (
                      <p className="text-sm text-muted">{partner.description}</p>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {partner.promoCode && (
                        <div className="rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10 px-3 py-2 text-sm font-semibold text-brand-yellow">
                          {t("explore.labels.promoCode")}:{" "}
                          <span className="font-mono uppercase text-primary">
                            {partner.promoCode}
                          </span>
                        </div>
                      )}
                      {partner.benefits && (
                        <div className="rounded-2xl border border-brand-teal/30 bg-brand-teal/10 px-3 py-2 text-sm text-brand-teal">
                          {partner.benefits}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {partner.website && (
                        <a
                          href={partner.website}
                          target={partner.website.startsWith("http") ? "_blank" : undefined}
                          rel={partner.website.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/15"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M12 5a7 7 0 0 0 0 14m0-14a7 7 0 0 1 0 14m0-14c1.933 0 3.5 3.134 3.5 7S13.933 19 12 19m0-14C10.067 5 8.5 8.134 8.5 12s1.567 7 3.5 7m-7.5-7h15"
                              stroke="currentColor"
                              strokeWidth={1.6}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {t("explore.actions.visitWebsite")}
                        </a>
                      )}
                      {partner.mapsUrl && (
                        <MapLink href={partner.mapsUrl} label={t("explore.actions.openMaps")} />
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ExplorePage;
