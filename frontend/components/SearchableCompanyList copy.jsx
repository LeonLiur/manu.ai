"use client"

import React, {useState} from 'react'
import CompanyList from './ui/company-list'

const SearchableCompanyList = ({companies}) => {
    
    const [searchText, setSearchText] = useState('')

    const filteredCompanies = filterCompanies(companies, searchText)

    return <>
        <h1 className="mt-10 mb-5 text-center text-4xl bg-clip-text text-transparent bg-gradient-to-r from-green-700 to-green-500 font-bold w-120">Companies</h1>
        <section className="flex flex-col items-center justify-center">
            <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} className="w-1/2 h-10 px-3 mb-10 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline" placeholder="Search for a Company" />
            <CompanyList companies={filteredCompanies} emptyHeading="No companies found" />
        </section>
    </>
}

function filterCompanies(companies, searchText) {
    return companies.filter((company) => {
        return company.toLowerCase().includes(searchText.toLowerCase())
    })
}


export default SearchableCompanyList