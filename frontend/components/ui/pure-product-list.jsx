import React from 'react'
import ProductCard from './product-card';

const PureProductList = ({ companyProducts, emptyHeading }) => {
  let heading = emptyHeading;
  let count = companyProducts.length;
  if (count > 0) {
    const noun = count > 1 ? 'Products' : 'Product';
    heading = count + ' ' + noun;
  }

  return (
    <section className='flex flex-col gap-2'>
      <h2 className='justify-center text-center items-center'>{heading}</h2>
      <div className="flex flex-wrap gap-x-4 gap-y-6 items-center justify-center">
        {companyProducts.map((product, i) => {
            return(
                <ProductCard
                    key={product[0] + product[1] + i}
                    cardHeader={product[0] + " " + product[1]}
                    cardContent={product[0]}
                    link={`/company/${product[0]}/${product[1]}`}
                />
            )
        })}
      </div>
    </section >
  );
};


export default PureProductList