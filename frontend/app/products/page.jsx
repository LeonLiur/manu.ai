import SearchableProductList from "@/components/SearchableProductList";
import SearchablePureProductList from "@/components/SearchablePureProductsList";
import Link from "next/link"

export default async function Page() {
  const company_products = await getProducts()

  return <>
    {company_products && <SearchablePureProductList companyProducts={company_products} />}
  </>
}

async function getProducts() {
  try {
    const res = await fetch(`${process.env['BACKEND_URL']}/get_products`, {
      method: 'GET',
      cache: 'no-cache',
    }).then(data => data.json())

    const companyProducts = res.company_products

    return companyProducts
  }
  catch (error) {
    return null;
  }
}

