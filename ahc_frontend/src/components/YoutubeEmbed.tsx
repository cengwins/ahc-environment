const YoutubeEmbed = ({ embedId }:{ embedId: string }) => (
  <div className="video-responsive">
    <iframe
      width="100%"
      height="720"
      src={`https://www.youtube.com/embed/${embedId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Introduction to AHC Experimentation Environment"
    />
  </div>
);

export default YoutubeEmbed;
