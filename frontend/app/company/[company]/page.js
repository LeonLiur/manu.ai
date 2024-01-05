import SearchableProductList from "@/components/SearchableProductList";
import Link from "next/link"

export default async function Page({ params }) {
  const { company, products } = await getCompanyProducts(params.company)
  return <>
    <SearchableProductList company={company} products={products} />
  </>
}

async function getCompanyProducts(companyName) {
  const res = await fetch(`${process.env['BACKEND_URL']}/get_company_products?companyName=${companyName}`, {
    method: 'GET',
    cache: 'no-cache',
  }).then(data => data.json())

  const products = res.products;

  return { company: companyName, products: products }
}

