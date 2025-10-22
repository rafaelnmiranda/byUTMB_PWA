import Image from "next/image";
import Link from "next/link";

type PhotoHighlightCardProps = {
  imageSrc: string;
  title: string;
  description: string;
  badge?: string;
  ctaLabel?: string;
  ctaHref?: string;
  logoSrc?: string;
  logoAlt?: string;
  imagePosition?: string;
};

const PhotoHighlightCard = ({
  imageSrc,
  title,
  description,
  badge,
  ctaLabel,
  ctaHref,
  logoSrc,
  logoAlt,
  imagePosition,
}: PhotoHighlightCardProps) => {
  const className = "group relative block overflow-hidden rounded-3xl border border-subtle shadow-subtle transition-transform hover:-translate-y-0.5 hover:shadow-lg";

  if (ctaHref) {
    return (
      <Link
        href={ctaHref}
        target={ctaHref.startsWith("http") ? "_blank" : undefined}
        className={className}
      >
        {renderCardContent()}
      </Link>
    );
  }

  return (
    <article className={className}>
      {renderCardContent()}
    </article>
  );

  function renderCardContent() {
    return (
      <>
        <div className="relative h-52 w-full sm:h-56">
        <Image
          src={imageSrc}
          alt={title}
          fill
          priority
          className="object-cover"
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
          sizes="(max-width: 640px) 100vw, 640px"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-black/75 via-black/45 to-transparent" />
        {logoSrc && (
          <div className="absolute right-5 top-5">
            <Image
              src={logoSrc}
              alt={logoAlt ?? title}
              width={200}
              height={84}
              priority
              className="w-32 object-contain drop-shadow-lg sm:w-44"
            />
          </div>
        )}
        <div className="relative flex h-full flex-col justify-end gap-2 p-5">
          {badge && (
            <span className="w-fit rounded-full bg-brand-teal/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-teal">
              {badge}
            </span>
          )}
          <h2 className="text-xl font-semibold text-white">{title}</h2>
          <p className="text-sm text-white/80">{description}</p>
          {ctaLabel && ctaHref && (
            <span className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-brand-yellow">
              {ctaLabel}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="transition-transform group-hover:translate-x-1"
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          )}
        </div>
        </div>
      </>
    );
  }
};

export default PhotoHighlightCard;
