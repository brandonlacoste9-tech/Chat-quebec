import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./Providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Quebec AI OS — The Sovereign Quebec Chatbot",
  description: "Quebec AI OS is the sovereign alternative to ChatGPT and Gemini in Quebec. English (en-CA) AI expert in Quebec taxes, immigration, and education. Bill 25 compliant.",
  keywords: ["Quebec AI", "Digital Sovereignty", "Quebec Chat GPT", "Bill 25", "Revenu Quebec IA", "Quebec Taxes", "Quebec Immigration", "PEQ", "CSQ"],
  authors: [{ name: "Quebec AI OS" }],
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
    "name": "Quebec AI OS",
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Web",
    "author": {
      "@type": "Organization",
      "name": "Quebec AI OS",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Montreal",
        "addressRegion": "QC",
        "addressCountry": "CA"
      }
    },
    "description": "First sovereign artificial intelligence infrastructure in Quebec.",
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": "Quebec"
    },
    "inLanguage": "en-CA",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CAD"
    }
  };

  return (
    <html lang="en-CA" suppressHydrationWarning>
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
