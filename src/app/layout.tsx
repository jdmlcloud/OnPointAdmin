import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/lib/auth/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OnPoint Admin - Plataforma de Ventas B2B',
  description: 'Plataforma integral que automatiza el proceso completo de ventas B2B desde WhatsApp hasta PDF final, con IA integrada.',
  keywords: ['ventas', 'B2B', 'WhatsApp', 'IA', 'cotizaciones', 'propuestas'],
  authors: [{ name: 'OnPoint Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  console.log('🚀 RootLayout renderizando...')
  
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
