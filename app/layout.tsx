import type { Metadata, Viewport } from "next";
import Atmosphere from "@/components/Atmosphere";
import PageFade from "@/components/PageFade";
import SiteNav from "@/components/SiteNav";
import { getSiteData } from "@/lib/site-data";
import "./globals.css";
import "./player-inline.css";
import "./hire-cta.css";
import "./launch-actions.css";
import "./public-pages.css";
import "./final-polish.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nebuchadrektzar.xyz"),
  alternates: { canonical: "/" },
  title: "NEBUCHADREKTZAR — $N3BU",
  description: "I’m not wrong. I’m early. King. Rapper. Formerly extremely liquid. NEBUCHADREKTZAR · $N3BU.",
  manifest: "/manifest.webmanifest",
  applicationName: "NEBUCHADREKTZAR",
  appleWebApp: { capable: true, title: "N3BU", statusBarStyle: "black-translucent" },
  icons: { icon: "/nebu-avatar.webp", apple: "/nebu-avatar.webp" },
  openGraph: { title: "NEBUCHADREKTZAR — I’M EARLY.", description: "King. Rapper. Formerly extremely liquid.", images: [{ url: "/nebu-world.webp", width: 1536, height: 1024 }] },
  twitter: { card: "summary_large_image", title: "NEBUCHADREKTZAR — I’M EARLY.", images: ["/nebu-world.webp"] },
};

export const viewport: Viewport = {
  themeColor: "#100e17",
  viewportFit: "cover",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const data = await getSiteData();

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
      <body>
        <Atmosphere />
        <SiteNav hireEnabled={data.hire.enabled} buyUrl={data.buyUrl} />
        <PageFade>{children}</PageFade>
      </body>
    </html>
  );
}
