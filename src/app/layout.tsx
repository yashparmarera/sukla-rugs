import type { Metadata } from "next";
import { Jost, Ibarra_Real_Nova, Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/components/providers/CurrencyProvider";
import { WishlistProvider } from "@/components/providers/WishlistProvider";
import { getSelectedCountry } from "@/lib/localization.server";
import { getCurrencyForCountry } from "@/lib/currency";
import { getStoreCurrencyRate } from "@/lib/exchange-rates.server";
import { WhatsAppFloat } from "@/components/common/WhatsAppFloat";
import { CookieConsent } from "@/components/consent/CookieConsent";

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

// Home hero headline only
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  // Plain string on purpose: no `title.template`. Every page that exports its
  // own title writes the brand itself (for example "Our Story | SUKLA RUGS"),
  // and a template would append it a second time. Pages without a title use
  // this default.
  title: "SUKLA RUGS | Handcrafted Luxury Rugs from Bhadohi, India",
  description:
    "SUKLA RUGS crafts contemporary Indian luxury rugs in Bhadohi, India — hand-knotted, hand-tufted, hand-woven, and hand-woven jute pieces designed for living spaces around the world.",
  icons: {
    // `src/app/favicon.ico` (multi-res 16/32/48) is picked up automatically
    // by Next.js. These PNG entries give modern browsers crisp sizes and
    // supply the Apple touch icon the .ico convention can't provide.
    icon: [
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48x48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The shopper's country decides the display currency for every price on the site.
  const country = await getSelectedCountry();
  const displayCurrency = getCurrencyForCountry(country);
  const rate = await getStoreCurrencyRate(displayCurrency);

  return (
    <html
      lang="en"
      className={`${jost.variable} ${ibarraRealNova.variable} ${inter.variable} ${montserrat.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <CookieConsent />
        <CurrencyProvider displayCurrency={displayCurrency} rate={rate}>
          <WishlistProvider>{children}</WishlistProvider>
        </CurrencyProvider>
        <WhatsAppFloat />
      </body>
    </html>
  );
}
