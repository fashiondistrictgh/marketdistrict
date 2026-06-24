import type { Metadata } from "next";

import "./globals.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Market District — Admin",
  description: "Admin dashboard for the Market District grocery delivery platform.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
