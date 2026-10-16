import type { Metadata } from "next";
import { Jost, Ibarra_Real_Nova, Inter } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { getSelectedCountry } from "@/lib/localization.server";
import { getCurrencyForCountry } from "@/lib/currency";
import { getStoreCurrencyRate } from "@/lib/exchange-rates.server";

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

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The shopper's country decides the display currency for every price on the site.
  const country = await getSelectedCountry();
  const displayCurrency = getCurrencyForCountry(country);
  const rate = await getStoreCurrencyRate(displayCurrency);

  return (
    <html
      lang="en"
      className={`${jost.variable} ${ibarraRealNova.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CurrencyProvider displayCurrency={displayCurrency} rate={rate}>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}
