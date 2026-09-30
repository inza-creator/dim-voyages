import type { Metadata } from "next";
import { Great_Vibes, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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
    description: "Le chemin vers soi. Agence de voyage à Abidjan.",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${sans.variable} ${script.variable} h-full`}>
      <body className="min-h-full bg-sand font-sans text-ink antialiased">
        <style>{`
          .bg-navy { background-color: #0e6294 !important; }
          .bg-navy-800 { background-color: #0c5684 !important; }
          .bg-navy-900 { background-color: #0b4f78 !important; }
          .text-navy { color: #0e6294 !important; }
          .from-navy { --tw-gradient-from: #0e6294 !important; }
          .via-navy { --tw-gradient-via: #0e6294 !important; }
          .to-navy { --tw-gradient-to: #0e6294 !important; }
        `}</style>
        {children}
      </body>
    </html>
  );
}
