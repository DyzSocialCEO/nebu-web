import type { Metadata } from "next";
import "./globals.css";
import "./player-inline.css";
import "./hire-cta.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://n4x33.xyz"),
  alternates: { canonical: "/" },
  title: "NEBUCHADREKTZAR — $N4X33",
  description: "I’m not wrong. I’m early. King. Rapper. Formerly extremely liquid. NEBUCHADREKTZAR · $N4X33.",
  icons: { icon: "/nebu-avatar.webp", apple: "/nebu-avatar.webp" },
  openGraph: { title: "NEBUCHADREKTZAR — I’M EARLY.", description: "King. Rapper. Formerly extremely liquid.", images: [{ url: "/nebu-world.webp", width: 1536, height: 1024 }] },
  twitter: { card: "summary_large_image", title: "NEBUCHADREKTZAR — I’M EARLY.", images: ["/nebu-world.webp"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preload" as="image" href="/nebu-garden.webp" media="(min-width:561px)" />
        <link rel="preload" as="image" href="/nebu-garden-sm.webp" media="(max-width:560px)" />
        <link rel="preload" as="image" href="/nebu-neutral.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/nebu-cover.webp" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/dm-sans-400.woff2" crossOrigin="anonymous" />
        <link rel="preload" as="font" type="font/woff2" href="/fonts/barlow-condensed-700.woff2" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
