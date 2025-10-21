type MapLinkProps = {
  href: string;
  label?: string;
};

const MapLink = ({ href, label = "Open in Maps" }: MapLinkProps) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 rounded-full border border-brand-teal/50 bg-brand-teal/15 px-4 py-2 text-sm font-semibold text-brand-teal transition-colors hover:bg-brand-teal/25"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="2.5"
        stroke="currentColor"
        strokeWidth={1.6}
      />
    </svg>
    {label}
  </a>
);

export default MapLink;
