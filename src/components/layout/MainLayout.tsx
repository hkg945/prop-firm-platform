import { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

interface MainLayoutProps {
  children: ReactNode
  translations: Record<string, string>
}

export function MainLayout({ children, translations }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header translations={translations} />
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer translations={translations} />
    </div>
  )
}
