import './globals.css'
import { ReactNode } from 'react'
import { Header } from '@/components/Header'
import { QueryProvider } from '@/lib/react-query-provider'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'

export const metadata = {
  title: 'HelpDesk',
  description: 'Sistema de gerenciamento de tickets',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br" className="scroll-smooth">
      <body className="bg-background text-foreground font-sans min-h-screen transition-colors duration-300">
        <QueryProvider>
          <ThemeProvider>
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
            <Toaster richColors position="top-center" />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
