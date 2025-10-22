import { useState } from "react";

type VideoCardProps = {
  title: string;
  videoId: string;
  description?: string;
};

const VideoCard = ({ title, videoId, description }: VideoCardProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <article className="flex flex-col gap-3 rounded-3xl border border-subtle bg-card-surface p-5 shadow-subtle">
        <div className="aspect-video overflow-hidden rounded-2xl border border-subtle bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📹</div>
            <p className="text-sm text-muted">Vídeo temporariamente indisponível</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        {description && <p className="text-sm text-muted">{description}</p>}
      </article>
    );
  }

  return (
  <article className="flex flex-col gap-3 rounded-3xl border border-subtle bg-card-surface p-5 shadow-subtle">
    <div className="aspect-video overflow-hidden rounded-2xl border border-subtle bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&playsinline=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
        loading="lazy"
        style={{ 
          border: 'none',
          borderRadius: '16px'
        }}
        onError={(e) => {
          console.error('Video load error:', e);
          setHasError(true);
        }}
        onLoad={() => setHasError(false)}
      />
    </div>
    <h3 className="text-lg font-semibold text-primary">{title}</h3>
    {description && <p className="text-sm text-muted">{description}</p>}
  </article>
  );
};

export default VideoCard;
