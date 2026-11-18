import type { Metadata, Viewport } from "next";
import { Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/locale";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const script = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-great-vibes",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "DIM VOYAGES — Le pouvoir du voyage",
    template: "%s · DIM VOYAGES",
  },
  description:
    "DIM VOYAGES, agence de voyage et de tourisme à Abidjan. Le pouvoir du voyage, le chemin vers soi. Expériences, destinations et accompagnement sur mesure.",
  icons: { icon: "/logo-dim-voyages.png" },
  openGraph: {
    title: "DIM VOYAGES — Le pouvoir du voyage",
    description: "Le chemin vers soi. Agence de voyage et de tourisme à Abidjan : expériences, destinations et accompagnement sur mesure.",
    siteName: "DIM VOYAGES",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "DIM VOYAGES" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DIM VOYAGES — Le pouvoir du voyage",
    description: "Le chemin vers soi. Agence de voyage et de tourisme à Abidjan.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#012549",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${sans.variable} ${script.variable} h-full`}>
      <body className="min-h-full bg-sand font-sans text-ink antialiased">
        <style>{`
          .bg-navy { background-color: #012549 !important; }
          .bg-navy-800 { background-color: #012244 !important; }
          .bg-navy-900 { background-color: #011e3c !important; }
          .text-navy { color: #012549 !important; }
          .from-navy { --tw-gradient-from: #012549 !important; }
          .via-navy { --tw-gradient-via: #012549 !important; }
          .to-navy { --tw-gradient-to: #012549 !important; }
        `}</style>
        {children}
      </body>
    </html>
  );
}
