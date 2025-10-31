"use client";

import Link from "next/link";
import Card from "../../components/Card";
import PhotoHighlightCard from "../../components/PhotoHighlightCard";
import { useTranslate } from "../../hooks/useLanguage";

const HomePage = () => {
  const t = useTranslate();

  const photoHighlights = [
    {
      imageSrc: "/images/hero.jpeg",
      logoSrc: "/images/logo-white.png",
      logoAlt: "Paraty Brazil by UTMB",
      imagePosition: "center 25%",
      title: t("home.heroTitle"),
      description: t("home.heroSubtitle"),
      ctaLabel: t("home.ctaAgenda"),
      ctaHref: "/agenda",
    },
    {
      imageSrc: "/images/explore.jpeg",
      imagePosition: "center 50%",
      badge: "Explore",
      title: t("navigation.explore"),
      description: t("home.highlights.explore"),
      ctaLabel: t("home.ctaExplore"),
      ctaHref: "/explore",
    },
  ];

  const highlightCards = [
    {
      title: t("navigation.agenda"),
      description: t("home.highlights.agenda"),
      href: "/agenda",
      actionLabel: t("home.ctaAgenda"),
    },
    {
      title: t("navigation.races"),
      description: t("home.highlights.races"),
      href: "/races",
    },
    {
      title: t("navigation.explore"),
      description: t("home.highlights.explore"),
      href: "/explore",
      actionLabel: t("home.ctaExplore"),
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        {photoHighlights.map((item) => (
          <PhotoHighlightCard key={item.title} {...item} />
        ))}
      </section>

      {/* Seção "Próxima Prova" oculta - não será usada */}
      {/* 
      <section className="rounded-3xl border border-subtle bg-card-surface p-6 shadow-subtle">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-muted">
              {t("home.nextEventLabel")}
            </span>
            <h2 className="text-xl font-semibold text-primary">PTR 20</h2>
            <p className="text-sm text-muted">
              06 Setembro • Largada 07:00 • Pontal Beach
            </p>
          </div>
          <div className="rounded-full border border-brand-teal/30 bg-brand-teal/10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-brand-teal">
            20 KM • 1.100 D+
          </div>
        </div>
      </section>
      */}

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-primary">
            {t("home.highlightsTitle")}
          </h2>
          <Link
            href="/media"
            className="text-sm font-semibold text-brand-teal hover:underline"
          >
            {t("navigation.media")}
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {highlightCards.map((card) => (
            <Card key={card.title} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
