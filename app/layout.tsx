import type { Metadata } from "next";
import "./globals.css";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  (process.env.VERCEL_ENV === "production" && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://yody-itdx-intern-product-builder.vercel.app");
const withScheme = rawBaseUrl.startsWith("http")
  ? rawBaseUrl
  : `https://${rawBaseUrl}`;
const baseUrl = withScheme.replace(/\/+$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Intern Product Builder Portal",
    template: "%s | Intern Product Builder Portal",
  },
  description: "YODY Intern Product Builder Program — khung năng lực, dự án thực chiến, scorecard, lộ trình, huy hiệu.",
  keywords: ["YODY", "YODY Intern", "Product Builder", "khung năng lực", "scorecard", "lộ trình thực tập", "huy hiệu YODY"],
  authors: [{ name: "YODY Technology" }],
  creator: "YODY Tech",
  publisher: "YODY",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    title: "Intern Product Builder Portal",
    description: "YODY Intern Product Builder Program — khung năng lực, dự án thực chiến, scorecard, lộ trình, huy hiệu.",
    siteName: "YODY Intern Product Builder Portal",
    images: [
      {
        url: "/thumbnails/og-product-builder.jpg",
        width: 1200,
        height: 630,
        alt: "YODY Intern Product Builder Program Banner",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Intern Product Builder Portal",
    description: "YODY Intern Product Builder Program — khung năng lực, dự án thực chiến, scorecard, lộ trình, huy hiệu.",
    images: ["/thumbnails/og-product-builder.jpg"],
  },
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/webp" }],
    shortcut: ["/favicon.ico"],
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('yds-ui-theme');if(t!=='dark'&&t!=='light')t='light';document.documentElement.dataset.theme=t;document.documentElement.dataset.surface='portal';}catch(e){document.documentElement.dataset.theme='light';document.documentElement.dataset.surface='portal';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link
          rel="preload"
          href="/fonts/be-vietnam-pro-400-normal.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/montserrat-900-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/playfair-display-900-italic.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/jetbrains-mono-700-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body data-surface="portal" suppressHydrationWarning>{children}</body>
    </html>
  );
}