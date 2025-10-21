"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useTranslate } from "../hooks/useLanguage";

type TabItem = {
  href: string;
  icon: ReactNode;
  labelKey:
    | "navigation.home"
    | "navigation.agenda"
    | "navigation.races"
    | "navigation.explore"
    | "navigation.media";
};

const navItems: TabItem[] = [
  {
    href: "/",
    icon: (
      <path
        d="M12 4 4 11.25V20h5.5v-4.5h5V20H20v-8.75L12 4Z"
        stroke="currentColor"
        strokeWidth={1.6}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    labelKey: "navigation.home",
  },
  {
    href: "/agenda",
    icon: (
      <>
        <rect
          x="4"
          y="5.5"
          width="16"
          height="14"
          rx="2"
          stroke="currentColor"
          strokeWidth={1.6}
          fill="none"
        />
        <path
          d="M8 3v4.5M16 3v4.5M4 10.5h16"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      </>
    ),
    labelKey: "navigation.agenda",
  },
  {
    href: "/races",
    icon: (
      <>
        <circle
          cx="12"
          cy="12"
          r="7"
          stroke="currentColor"
          strokeWidth={1.6}
          fill="none"
        />
        <path
          d="M8.5 14.5 10.8 10l2.2 5 1.5-2.8"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    labelKey: "navigation.races",
  },
  {
    href: "/explore",
    icon: (
      <>
        <path
          d="M12 3v6M18 9l-6 12-6-12"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx="12"
          cy="9"
          r="2.5"
          stroke="currentColor"
          strokeWidth={1.6}
          fill="none"
        />
      </>
    ),
    labelKey: "navigation.explore",
  },
  {
    href: "/media",
    icon: (
      <>
        <rect
          x="4"
          y="6"
          width="16"
          height="12"
          rx="3"
          stroke="currentColor"
          strokeWidth={1.6}
          fill="none"
        />
        <path
          d="m11 10 4 2-4 2v-4Z"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    labelKey: "navigation.media",
  },
];

const TabMenu = () => {
  const pathname = usePathname();
  const t = useTranslate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto flex h-[var(--tab-bar-height)] w-full max-w-3xl items-center justify-between rounded-t-3xl border border-subtle bg-tab-surface px-4 backdrop-blur-xl">
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group flex flex-1 flex-col items-center gap-1 rounded-2xl py-2 text-xs font-semibold transition-colors ${
              isActive
                ? "bg-[var(--tab-active-bg)] text-[var(--tab-active-fg)]"
                : "text-muted hover:text-primary"
            }`}
         >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className={`transition-transform ${
                isActive ? "scale-105" : "group-hover:scale-105"
              }`}
            >
              {item.icon}
            </svg>
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default TabMenu;
