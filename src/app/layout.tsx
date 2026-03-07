import type { Metadata } from "next";
import "./globals.css";
import Providers from "./Providers";

export const metadata: Metadata = {
  title: "Québec AI OS",
  description: "Système d'exploitation IA souverain du Québec. Parité Google AI / ChatGPT, 100% adapté au Québec.",
  keywords: ["IA", "Québec", "Souveraineté numérique", "ChatGPT", "Gemini", "fr-CA"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
