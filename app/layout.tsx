import type { Metadata } from 'next'
import { Instrument_Serif, Source_Sans_3 } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const instrumentSerif = Instrument_Serif({ 
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif"
});

const sourceSans = Source_Sans_3({ 
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: 'Manya Saxena — Designer',
  description: 'UX and HCI designer passionate about creating digital spaces that feel more human and intentional.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${instrumentSerif.variable} ${sourceSans.variable}`}>
      <body className="font-sans antialiased relative">
        <div className="pointer-events-none fixed inset-0 z-[-1] h-full w-full bg-[radial-gradient(rgba(200,200,210,0.45)_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.28]" aria-hidden />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
