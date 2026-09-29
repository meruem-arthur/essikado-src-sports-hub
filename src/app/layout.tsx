import "./globals.css";
import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")),
  title: { default: "UMaT Essikado SRC Sports", template: "%s · UMaT SRC Sports" },
  description: "Fixtures, results, news and teams from UMaT Essikado Campus SRC Sports.",
  openGraph: { type: "website", siteName: "UMaT Essikado SRC Sports" }, twitter: { card: "summary_large_image" },
};
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${anton.variable} ${inter.variable}`}><body>{children}</body></html>);
}
