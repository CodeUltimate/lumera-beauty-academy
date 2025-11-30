import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: "Luméra Beauty Academy | Live Beauty Education From Top Global Educators",
  description: "Live. Learn. Elevate. Join real-time masterclasses with world-renowned beauty professionals. Live classes in skincare, aesthetics, PMU, laser treatments and more.",
  keywords: "beauty education, live classes, skincare training, aesthetics courses, PMU training, beauty academy, online beauty courses",
  openGraph: {
    title: "Luméra Beauty Academy",
    description: "Live Beauty Education From Top Global Educators",
    type: "website",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Luméra",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: "#FFFFFF",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="antialiased min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
