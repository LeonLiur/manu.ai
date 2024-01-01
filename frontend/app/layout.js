import { Inter as FontSans} from 'next/font/google'
import './globals.css'
import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: 'manu.AI',
  description: 'The future of user manuals',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${fontSans.className}`}>
      <Header />
      {children}
      <Footer />
      </body>
    </html>
  )
}
