import SearchableCompanyList from '@/components/SearchableCompanyList copy';
import React from 'react'

export default async function Companies() {
  const companies = await getCompanies();

  return <>
    {companies && <SearchableCompanyList companies={companies} />}
  </>
}

async function getCompanies() {
  try {
    const res = await fetch(`${process.env['BACKEND_URL']}/get_companies`, {
      method: 'GET',
      cache: 'no-cache',
    }).then(data => data.json())

    console.log(res)

    return res.companies;
  } catch (error) {
    return null;
  }

}