import Link from "next/link";
import { ReactNode } from "react";

type CardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  meta?: string;
  badge?: string;
  href?: string;
  actionLabel?: string;
  media?: ReactNode;
  footer?: ReactNode;
};

const Card = ({
  title,
  subtitle,
  description,
  meta,
  badge,
  href,
  actionLabel = "Ver detalhes",
  media,
  footer,
}: CardProps) => {
  const className = "group flex flex-col gap-4 rounded-3xl border border-subtle bg-card-surface p-5 shadow-subtle transition-transform hover:-translate-y-0.5 hover:border-strong hover:bg-[var(--card-hover)]";

  if (href) {
    return (
      <Link
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
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
        {badge && (
          <span className="w-fit rounded-full bg-brand-teal/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-teal">
            {badge}
          </span>
        )}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          {subtitle && <p className="text-sm font-medium text-brand-yellow">{subtitle}</p>}
          {meta && <p className="text-xs uppercase tracking-wide text-muted">{meta}</p>}
          {description && <p className="text-sm text-muted">{description}</p>}
        </div>
        {media}
        {footer ? (
          <div className="flex items-center justify-between pt-2 text-sm text-muted">
            {footer}
          </div>
        ) : (
          href && (
            <span className="flex items-center gap-2 text-sm font-semibold text-brand-teal">
              {actionLabel}
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
          )
        )}
      </>
    );
  }
};

export default Card;
