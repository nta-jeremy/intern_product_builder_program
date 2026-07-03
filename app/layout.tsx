import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Intern Product Builder Portal",
  description: "YODY Intern Product Builder Program — khung năng lực, dự án thực chiến, scorecard, lộ trình, huy hiệu.",
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
      <body data-surface="portal">{children}</body>
    </html>
  );
}