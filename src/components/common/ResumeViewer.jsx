import { useState } from "react";

export default function ResumeViewer({ url, style = {} }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    // <iframe
    //   src={`https://docs.google.com/viewer?url=${encodeURIComponent(
    //     url
    //   )}&embedded=true`}
    //   loading="lazy"
    //   style={{
    //     width: "100%",
    //     maxHeight: "60vh",
    //     aspectRatio: "1 / 1",
    //     ...style,
    //   }}
    //   className={isLoading ? "bg-black/20 blur animate-pulse" : ""}
    //   onLoad={function () {
    //     setIsLoading(false);
    //   }}
    // />
    <embed
      src={url}
      type="application/pdf"
      style={{
        width: "100%",
        maxHeight: "60vh",
        aspectRatio: "1 / 1",
        ...style,
      }}
      className={isLoading ? "animate-pulse bg-black/20 blur" : ""}
      onLoad={function () {
        setIsLoading(false);
      }}
    />
  );
}
