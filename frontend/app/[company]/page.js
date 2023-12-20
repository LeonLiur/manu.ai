import Link from "next/link"

export default function Page({ params }) {
  const products = getCompanyProducts(params.company)
  return <>
    <h1 className="w-120 text-lg">Manuals for {params.company}</h1>
    {products}
  </>
}

async function getCompanyProducts(companyName) {
  const res = await fetch(`${process.env['NEXT_PUBLIC_BACKEND_URL']}/get_company_products?companyName=${companyName}`, {
    method: 'GET',
    cache: 'no-cache',
  }).then(data => data.json())

  const products = res.products?.map((product) => <div className="underline" key={product}>
    <Link href={`/${companyName}/${product}`}>
      {product}
    </Link>
  </div>
  )

  return products
}