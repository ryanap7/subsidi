import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SISTEM HILIRISASI GAS LPG - Portal Subsidi',
  description: 'Sistem portal untuk stakeholder subsidi LPG Indonesia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}