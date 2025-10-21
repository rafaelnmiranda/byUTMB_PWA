const SUPPORT_NUMBER = "5521977770000"; // placeholder, replace with official contact

const WhatsAppButton = () => {
  const href = `https://wa.me/${SUPPORT_NUMBER}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[calc(var(--tab-bar-height)+24px)] right-5 flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal text-brand-midnight shadow-subtle transition-transform hover:scale-105"
      aria-label="Contact by WhatsApp"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M20.5 12.1c0 4.7-3.9 8.6-8.6 8.6-1.5 0-2.9-.4-4.1-1l-4.4 1.3 1.4-4.2c-.8-1.3-1.3-2.8-1.3-4.4 0-4.7 3.9-8.6 8.6-8.6 2.3 0 4.4.9 6 2.5 1.6 1.6 2.4 3.7 2.4 5.8Z"
          stroke="currentColor"
          strokeWidth={1.6}
          fill="none"
        />
        <path
          d="M15.6 14.1c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.1-.2.2-.4.1-.2-.1-.9-.3-1.7-1-.6-.5-1-1.1-1.2-1.3-.1-.2 0-.3.1-.4.1-.1.2-.2.3-.3.1-.1.2-.2.3-.3.1-.1.1-.2.2-.4.1-.2 0-.3 0-.4 0-.1-.4-1-0.5-1.4-.1-.4-.4-.4-.5-.4h-.4c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9 0 1.1.8 2.1.9 2.2.1.1 1.6 2.4 3.8 3.4.5.2.9.4 1.2.5.5.2.9.1 1.2.1.4-.1 1.4-.6 1.6-1.1.2-.5.2-.9.2-1 0-.1-.1-.1-.3-.2Z"
          fill="currentColor"
        />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
