import { Inter as FontSans} from 'next/font/google'
import './globals.css'

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
    <html lang="en" style={{ margin: 0, padding: 0, boxSizing: "border-box", minHeight: "fit-content", height: "100vh"}}>
      <body className={`${fontSans.className} bg-slate-800 text-slate-100`} style={{ boxSizing: "border-box", margin: "0", padding: "0", width: "100%", height: "100%"}}>
      {children}</body>
    </html>
  )
}
