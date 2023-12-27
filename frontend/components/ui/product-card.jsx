import React from 'react'
import { Card, CardContent, CardHeader } from './card'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const ProductCard = ({className, cardHeader, cardContent, link, ...props}) => {
  return (
    <Link href={link}>
      <Card className={cn("w-[340px] hover:bg-gray-200/20 hover:shadow-lg hover:shadow-black/5 hover:translate", className)} {...props}>
        <CardHeader className="font-semibold">{cardHeader}</CardHeader>
        <div className='mb-2 w-1/4 h-1 bg-gradient-to-r mx-6 from-blue-400 to-purple-400 rounded-full'></div>
        <CardContent className="font-light">{cardContent}</CardContent>
      </Card>
    </Link>
  )
}

export default ProductCard