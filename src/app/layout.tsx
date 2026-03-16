import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Québec AI OS — Le Chat GPT Souverain du Québec",
  description: "Québec AI OS est l'alternative souveraine à ChatGPT et Gemini au Québec. IA en français (fr-CA) experte en fiscalité, immigration et éducation québécoise. Conforme Loi 25.",
  keywords: ["IA Québec", "Souveraineté numérique", "Chat GPT Québec", "Loi 25", "Revenu Québec IA", "Fiscalité Québec", "Immigration Québec", "PEQ", "CSQ"],
  authors: [{ name: "Québec AI OS" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Québec AI OS",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "author": {
      "@type": "Organization",
      "name": "Québec AI OS",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Montréal",
        "addressRegion": "QC",
        "addressCountry": "CA"
      }
    },
    "description": "Première infrastructure d'intelligence artificielle souveraine au Québec.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Québec"
    },
    "inLanguage": "fr-CA",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CAD"
    }
  };

  return (
    <html lang="fr-CA" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Barlow+Condensed:wght@300;400;500;600;700&family=Barlow:wght@300;400;500&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
