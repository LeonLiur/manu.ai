"use client"

import React, {useState} from 'react'
import ProductList from './ui/product-list'
import PureProductList from './ui/pure-product-list'

const SearchablePureProductList = ({companyProducts}) => {
    
    const [searchText, setSearchText] = useState('')

    const filteredProducts = filterProducts(companyProducts, searchText)

    return <>
        <h1 className="mt-10 mb-5 text-center text-4xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 font-bold w-120">All Products</h1>
        <section className="flex flex-col items-center justify-center">
            <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-1/2 h-10 px-3 mb-10 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" placeholder="Search for a product" />
            <PureProductList companyProducts={filteredProducts} emptyHeading="No products found" />
        </section>
    </>
}

function filterProducts(products, searchText) {
    return products.filter((product) => {
        return (product[0] + " " + product[1]).toLowerCase().includes(searchText.toLowerCase());
    })
}


export default SearchablePureProductList