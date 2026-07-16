import type { Metadata } from "next";
import "./globals.css";
import "./photo-carousel.css";

export const metadata: Metadata = {
  title: "Corrente — Encontros que seguem a maré",
  description: "Conexões reais para quem vive o oceano.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Corrente — Encontros que seguem a maré",
    description: "Conexões reais para quem vive o oceano.",
    images: [{ url: "https://corrente-surf-dating.brunobelolimacp.chatgpt.site/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["https://corrente-surf-dating.brunobelolimacp.chatgpt.site/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
