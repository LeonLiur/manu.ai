import SearchableProductList from "@/components/SearchableProductList";
import Link from "next/link"

export default function Page({ params }) {
  const productList = getCompanyProducts(params.company)
  return <>
    {productList}
  </>
}

async function getCompanyProducts(companyName) {
  const res = await fetch(`${process.env['BACKEND_URL']}/get_company_products?companyName=${companyName}`, {
    method: 'GET',
    cache: 'no-cache',
  }).then(data => data.json())

  const products = res.products;

  return <SearchableProductList company={companyName} products={products} />
}

