const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoId = videoUrl?.split("vimeo.com/")[1]?.split("/")[0];
  const videoSecret = videoUrl?.split("vimeo.com/")[1]?.split("/")[1];
  return (
    <iframe
      src={`https://player.vimeo.com/video/${videoId}?h=${videoSecret}&title=0&byline=0&portrait=0&dnt=1`}
      allow="autoplay; fullscreen; picture-in-picture"
      className="aspect-video w-full h-full"
    />
  );
};

export default VideoPlayer;
