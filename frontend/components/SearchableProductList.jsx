"use client"

import React, {useState} from 'react'
import ProductList from './ui/product-list'

const SearchableProductList = ({company, products}) => {
    
    const [searchText, setSearchText] = useState('')

    const filteredProducts = filterProducts(products, searchText)

    return <>
        <h1 className="mt-10 mb-5 text-center text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-bold w-120">Manuals for {company}</h1>
        <section className="flex flex-col items-center justify-center">
            <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-1/2 h-10 px-3 mb-10 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" placeholder="Search for a product" />
            <ProductList companyName={company} products={filteredProducts} emptyHeading="No products found" />
        </section>
    </>
}

function filterProducts(products, searchText) {
    return products.filter((product) => {
        return product.toLowerCase().includes(searchText.toLowerCase())
    })
}


export default SearchableProductList