import type { Metadata } from "next";
import { Jost, Ibarra_Real_Nova, Inter } from "next/font/google";
import "./globals.css";

// UI + numbers
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

// Editorial serif (brand storytelling, pull quotes, hero headline)
const ibarraRealNova = Ibarra_Real_Nova({
  variable: "--font-ibarra",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});

// Display: modern geometric/architectural sans
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "SUKLA RUGS | Handcrafted Luxury Rugs from Bhadohi, India",
    template: "%s | SUKLA RUGS",
  },
  description:
    "SUKLA RUGS crafts contemporary Indian luxury rugs in Bhadohi, India — hand-knotted, hand-tufted, hand-woven, and hand-woven jute pieces designed for living spaces around the world.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${ibarraRealNova.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
