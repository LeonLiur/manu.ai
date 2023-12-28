import SearchableCompanyList from '@/components/SearchableCompanyList copy';
import { Search } from 'lucide-react';
import React from 'react'

export default function Companies() {

  const displayCompanies = getCompanies();

  return (
    displayCompanies
  )
}

async function getCompanies () {
  const res = await fetch(`${process.env['BACKEND_URL']}/get_companies`, {
    method: 'GET',
    cache: 'no-cache',
  }).then(data => data.json())

  console.log(res)
  
  const companies = res.companies;

  return <SearchableCompanyList companies={companies} />
}
