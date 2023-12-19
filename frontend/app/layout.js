import { Inter as FontSans} from 'next/font/google'
import './styles/globals.css'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: 'manual.ai',
  description: 'Migrate to a smarter manual',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fontSans.className}`}>
      {children}
      </body>
    </html>
  )
}
