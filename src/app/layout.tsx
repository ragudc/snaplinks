import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ThemeProvider } from "@/components/layout/ThemeProvider"
import { LanguageProvider } from "@/lib/i18n"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets:  ["latin"],
  display:  "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets:  ["latin"],
  display:  "swap",
})

export const metadata: Metadata = {
  title: {
    default:  "SnapLinks — Free URL Shortener with Analytics",
    template: "%s | SnapLinks",
  },
  description:
    "Shorten URLs instantly. Get click analytics, QR codes, and custom slugs — free forever. No signup required to start.",
  keywords: [
    "url shortener", "link shortener", "short links",
    "click analytics", "qr code generator", "free url shortener",
    "custom slug", "link management",
  ],
  authors:      [{ name: "SnapLinks" }],
  creator:      "SnapLinks",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  openGraph: {
    title:       "SnapLinks — Free URL Shortener with Analytics",
    description: "Shorten URLs instantly with click analytics and QR codes.",
    type:        "website",
    locale:      "en_US",
    siteName:    "SnapLinks",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "SnapLinks — Free URL Shortener with Analytics",
    description: "Shorten URLs instantly with click analytics and QR codes.",
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width:        "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
