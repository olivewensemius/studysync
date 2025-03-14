import type { Metadata } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import MainLayout from '@/components/layout/MainLayout'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
})

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display'
})

export const metadata: Metadata = {
  title: 'StudySync',
  description: 'Collaborative Learning Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  )
}