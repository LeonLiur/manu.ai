import Footer from '@/components/ui/footer'
import Header from '@/components/ui/header'
import React from 'react'

const HomePageLayout = ({ children }) => {
  return <>
    <Header />
    {children}
    <Footer />
  </>
}

export default HomePageLayout