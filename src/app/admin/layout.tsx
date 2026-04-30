import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Start One Imports',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {children}
    </div>
  )
}
