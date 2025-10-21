"use client";

import Image from "next/image";
import Link from "next/link";
import LangSwitcher from "./LangSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 flex h-[var(--header-height)] items-center justify-between border-b border-subtle bg-header-surface px-5 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-3">
        <div className="relative h-10 w-auto min-w-[120px]">
          <Image
            src="/images/LOGO_PARATYBRAZIL_V3_COLOR.png"
            alt="Paraty Brazil by UTMB"
            width={160}
            height={48}
            className="h-full w-auto object-contain"
            priority
          />
        </div>
      </Link>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <LangSwitcher />
      </div>
    </header>
  );
};

export default Header;
