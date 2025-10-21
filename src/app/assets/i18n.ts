export type Language = "pt" | "en" | "es";

type TranslationLeaf = Record<Language, string>;

type TranslationNode = {
  [key: string]: TranslationLeaf | TranslationNode;
};

const translationsDefinition = {
  navigation: {
    home: {
      pt: "Home",
      en: "Home",
      es: "Inicio",
    },
    agenda: {
      pt: "Agenda",
      en: "Schedule",
      es: "Agenda",
    },
    races: {
      pt: "Percursos",
      en: "Races",
      es: "Carreras",
    },
    explore: {
      pt: "Explore",
      en: "Explore",
      es: "Explorar",
    },
    media: {
      pt: "Media",
      en: "Media",
      es: "Media",
    },
  },
  home: {
    heroTitle: {
      pt: "Seu hub oficial Paraty Brazil by UTMB",
      en: "Your official Paraty Brazil by UTMB hub",
      es: "Tu hub oficial Paraty Brazil by UTMB",
    },
    heroSubtitle: {
      pt: "Agenda, percursos, cupons e atualizações em um só lugar. Instale o app e fique por dentro do evento.",
      en: "Schedule, race details, local perks and live updates in one place. Install the app and stay ready for the event.",
      es: "Agenda, recorridos, beneficios locales y actualizaciones en un solo lugar. Instala la app y mantente listo para el evento.",
    },
    highlightsTitle: {
      pt: "Destaques rápidos",
      en: "At a glance",
      es: "De un vistazo",
    },
    highlights: {
      agenda: {
        pt: "Confira horários de largada, briefings e ativações oficiais.",
        en: "Check start times, briefings and official activations.",
        es: "Consulta horarios de largada, briefings y activaciones oficiales.",
      },
      races: {
        pt: "Percursos com altimetria, GPX e mapas Strava incorporados.",
        en: "Routes with elevation profiles, GPX files and embedded Strava maps.",
        es: "Recorridos con altimetría, archivos GPX y mapas de Strava incrustados.",
      },
      explore: {
        pt: "Cupons e locais parceiros para aproveitar Paraty durante o evento.",
        en: "Coupons and partner spots to enjoy Paraty during the event.",
        es: "Cupones y lugares aliados para disfrutar Paraty durante el evento.",
      },
    },
    nextEventLabel: {
      pt: "Próxima prova",
      en: "Next race",
      es: "Próxima carrera",
    },
    ctaAgenda: {
      pt: "Ver agenda completa",
      en: "View full schedule",
      es: "Ver agenda completa",
    },
    ctaExplore: {
      pt: "Descobrir cupons",
      en: "Discover coupons",
      es: "Descubrir cupones",
    },
  },
  agenda: {
    title: {
      pt: "Agenda oficial",
      en: "Official schedule",
      es: "Agenda oficial",
    },
    description: {
      pt: "Filtre por categoria e dia para acompanhar todas as atividades do evento.",
      en: "Filter by category and day to follow every activity at the event.",
      es: "Filtra por categoría y día para seguir todas las actividades del evento.",
    },
    empty: {
      pt: "Nenhuma atividade programada para os filtros selecionados.",
      en: "No activities scheduled for the selected filters.",
      es: "No hay actividades programadas para los filtros seleccionados.",
    },
    filters: {
      allDays: {
        pt: "Todos",
        en: "All days",
        es: "Todos",
      },
      allCategories: {
        pt: "Todas",
        en: "All categories",
        es: "Todas",
      },
    },
    categories: {
      sports: {
        pt: "Esportes",
        en: "Sports",
        es: "Deportes",
      },
      entertainment: {
        pt: "Entretenimento",
        en: "Entertainment",
        es: "Entretenimiento",
      },
      brand: {
        pt: "Ações de marca",
        en: "Brand activations",
        es: "Activaciones de marca",
      },
    },
  },
  races: {
    title: {
      pt: "Percursos",
      en: "Routes",
      es: "Recorridos",
    },
    description: {
      pt: "Conheça detalhes de altimetria, horários e links oficiais de cada prova.",
      en: "Review elevation, schedule and official links for each race.",
      es: "Revisa altimetría, horarios y enlaces oficiales de cada carrera.",
    },
  },
  explore: {
    title: {
      pt: "Explore Paraty",
      en: "Explore Paraty",
      es: "Explora Paraty",
    },
    description: {
      pt: "Cupons, ativações de marca e locais úteis para viver o evento ao máximo.",
      en: "Coupons, brand activations and useful spots to enjoy the event fully.",
      es: "Cupones, activaciones de marca y lugares útiles para vivir el evento al máximo.",
    },
    filters: {
      all: {
        pt: "Todos",
        en: "All",
        es: "Todos",
      },
    },
    sections: {
      partners: {
        pt: "Parceiros e benefícios",
        en: "Partners & perks",
        es: "Aliados y beneficios",
      },
    },
    actions: {
      visitWebsite: {
        pt: "Visitar site",
        en: "Visit website",
        es: "Visitar sitio",
      },
      openMaps: {
        pt: "Como chegar",
        en: "Open in Maps",
        es: "Ver no mapa",
      },
    },
    labels: {
      promoCode: {
        pt: "Código",
        en: "Code",
        es: "Código",
      },
    },
    empty: {
      partners: {
        pt: "Cadastre parceiros na planilha para exibi-los aqui.",
        en: "Add partners in the sheet to display them here.",
        es: "Agrega aliados en la planilla para mostrarlos aquí.",
      },
    },
  },
  media: {
    title: {
      pt: "Media Center",
      en: "Media Center",
      es: "Centro de Media",
    },
    description: {
      pt: "Assista briefings, after movies e melhores momentos do Paraty Brazil by UTMB.",
      en: "Watch briefings, after movies and highlights from Paraty Brazil by UTMB.",
      es: "Mira briefings, after movies y momentos destacados del Paraty Brazil by UTMB.",
    },
  },
  common: {
    comingSoon: {
      pt: "Conteúdo em preparação. Fique ligado.",
      en: "Content in preparation. Stay tuned.",
      es: "Contenido en preparación. Mantente atento.",
    },
  },
} as const satisfies TranslationNode;

export const translations = translationsDefinition;

type ExtractTranslationKeys<T> = {
  [K in keyof T]: T[K] extends TranslationLeaf
    ? Extract<K, string>
    : T[K] extends TranslationNode
      ? `${Extract<K, string>}.${ExtractTranslationKeys<T[K]>}`
      : never;
}[keyof T];

export type TranslationKey = ExtractTranslationKeys<typeof translationsDefinition>;
