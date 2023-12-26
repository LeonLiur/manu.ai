import React from 'react'
import ProductCard from './product-card';

const ProductList = ({products, emptyHeading, companyName}) => {
  let heading = emptyHeading;
  let count = products.length;
  if (count > 0) {
    const noun = count > 1 ? 'Products' : 'Product';
    heading = count + ' ' + noun;
  }

  console.log(products);

  return (
    <section className='flex flex-col gap-2'>
      <h2 className='justify-center text-center items-center'>{heading}</h2>
      <div className="flex flex-wrap gap-x-4 gap-y-6 items-center justify-center">
        {products.map((product) => (
          <ProductCard
            key={product}
            cardHeader={product}
            cardContent={`Manual for ${product}`}
            link={`/${companyName}/${product}`}
          />
        ))}
      </div>
    </section>
  );
};


export default ProductList