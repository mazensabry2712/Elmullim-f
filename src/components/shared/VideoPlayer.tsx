const buildVimeoEmbedUrl = (videoUrl: string): string | null => {
  try {
    const parsedUrl = new URL(videoUrl);
    const hostname = parsedUrl.hostname.toLowerCase();
    const isPlayerUrl = hostname === "player.vimeo.com";
    const isVimeoUrl =
      isPlayerUrl ||
      hostname === "vimeo.com" ||
      hostname === "www.vimeo.com";

    if (!isVimeoUrl) return null;

    const segments = parsedUrl.pathname.split("/").filter(Boolean);
    const videoId =
      isPlayerUrl && segments[0] === "video"
        ? segments[1]
        : segments[0];

    if (!videoId || !/^\d+$/.test(videoId)) return null;

    const pathHash =
      isPlayerUrl && segments[0] === "video"
        ? segments[2]
        : segments[1];
    const videoHash = parsedUrl.searchParams.get("h")?.trim() || pathHash;

    const params = new URLSearchParams({
      title: "0",
      byline: "0",
      portrait: "0",
      dnt: "1",
    });

    if (videoHash && /^[a-zA-Z0-9_-]+$/.test(videoHash)) {
      params.set("h", videoHash);
    }

    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  } catch {
    return null;
  }
};

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const embedUrl = buildVimeoEmbedUrl(videoUrl);

  if (!embedUrl) {
    return (
      <div className="flex h-full min-h-24 items-center justify-center bg-slate-950 px-4 text-center text-sm text-white">
        <a href={videoUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">
          Open video
        </a>
      </div>
    );
  }

  return (
    <iframe
      title="Course lecture video"
      src={embedUrl}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
      className="aspect-video h-full w-full"
    />
  );
};

export default VideoPlayer;
