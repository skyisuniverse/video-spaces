import React from "react";
import Image from "next/image";

// Tiny reusable component that gracefully falls back to the placeholder
export function AdrImage({
  src,
  alt,
  width,
  height,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
}) {
  const [imgSrc, setImgSrc] = React.useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 280px"
      loading="lazy"
      style={{
        width: "100%",
        height: "auto",
        objectFit: "cover",
      }}
      onError={() => {
        // If the product image is missing → use the placeholder once
        setImgSrc("/images/adr-placeholder.png");
      }}
    />
  );
}