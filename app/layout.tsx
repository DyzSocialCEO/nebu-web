import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nebu-web-production.up.railway.app"),
  title: "NEBUCHADREKTZAR — $N4X33",
  description: "I’m not wrong. I’m early. King. Rapper. Formerly extremely liquid. NEBUCHADREKTZAR · $N4X33.",
  icons: { icon: "/nebu-avatar.webp", apple: "/nebu-avatar.webp" },
  openGraph: { title: "NEBUCHADREKTZAR — I’M EARLY.", description: "King. Rapper. Formerly extremely liquid.", images: [{ url: "/nebu-world.webp", width: 1536, height: 1024 }] },
  twitter: { card: "summary_large_image", title: "NEBUCHADREKTZAR — I’M EARLY.", images: ["/nebu-world.webp"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
