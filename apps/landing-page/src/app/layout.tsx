import type { Metadata } from "next";
import { Inter, Montserrat, Playfair_Display, JetBrains_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["italic"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "YODY ITDX — Digital Infrastructure for Fashion Scale",
  description: "PHOENIX · UNICORN · GLAUX — three platforms powering 274 YODY stores toward IPO 2030.",
  openGraph: {
    title: "YODY ITDX — Digital Infrastructure for Fashion Scale",
    description: "PHOENIX · UNICORN · GLAUX — three platforms powering 274 YODY stores toward IPO 2030.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} ${montserrat.variable} ${playfair.variable} ${jetbrainsMono.variable} ${dancingScript.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
