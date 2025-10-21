type VideoCardProps = {
  title: string;
  videoId: string;
  description?: string;
};

const VideoCard = ({ title, videoId, description }: VideoCardProps) => (
  <article className="flex flex-col gap-3 rounded-3xl border border-subtle bg-card-surface p-5 shadow-subtle">
    <div className="aspect-video overflow-hidden rounded-2xl border border-subtle bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="h-full w-full"
        loading="lazy"
      />
    </div>
    <h3 className="text-lg font-semibold text-primary">{title}</h3>
    {description && <p className="text-sm text-muted">{description}</p>}
  </article>
);

export default VideoCard;
