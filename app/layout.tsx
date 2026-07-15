import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Corrente — Encontros que seguem a maré",
  description: "Conexões reais para quem vive o oceano.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
