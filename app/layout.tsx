import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Keramik Galleri',
  description: 'Handgjord keramik - tallrikar, skålar, fat och lampfötter',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body>{children}</body>
    </html>
  )
}
