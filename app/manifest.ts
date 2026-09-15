import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "NEBUCHADREKTZAR",
    short_name: "N3BU",
    description: "The rapper for the trenches. Music, memes and $N3BU.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#100e17",
    theme_color: "#100e17",
    categories: ["music", "entertainment"],
    icons: [
      { src: "/pwa-icon?size=192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon?size=512", sizes: "512x512", type: "image/png", purpose: "any maskable" },
    ],
  };
}
