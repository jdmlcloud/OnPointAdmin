"use client"

// Sin autenticación - acceso directo
import { Sidebar } from "./sidebar"
import { Header } from "./header"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  // Sin autenticación - acceso directo al dashboard
  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
