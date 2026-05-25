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
    default:  "SnapLinks — Smart URL Shortener with Analytics",
    template: "%s | SnapLinks",
  },
  description:
    "Shorten URLs, track clicks, and analyze your audience. Free URL shortener with real-time analytics powered by Cloudflare Edge.",
  keywords: [
    "url shortener", "link shortener", "short links",
    "click analytics", "qr code generator", "free url shortener",
    "bitly alternative", "link management", "cloudflare workers",
  ],
  authors:      [{ name: "SnapLinks" }],
  creator:      "SnapLinks",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
  icons: {
    icon:  "/favicon.ico",
    apple: "/apple-icon",
  },
  openGraph: {
    title:       "SnapLinks — Smart URL Shortener",
    description: "Shorten URLs and track every click with real-time analytics.",
    url:         process.env.NEXT_PUBLIC_APP_URL ?? "https://snaplinks.vercel.app",
    siteName:    "SnapLinks",
    locale:      "en_US",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "SnapLinks — Smart URL Shortener",
    description: "Shorten URLs and track every click.",
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
