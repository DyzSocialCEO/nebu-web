import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEBUCHADREKTZAR — $N4X33",
  description: "The king looked at the chart. The chart looked back.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
