import React from 'react'
import CompanyCard from './company-card';

const CompanyList = ({companies, emptyHeading}) => {
  let heading = emptyHeading;
  let count = companies.length;
  if (count > 0) {
    const noun = count > 1 ? 'Manufactueres ' : 'Manufactuerer';
    heading = count + ' ' + noun;
  }

  console.log(companies);

  return  <section className='flex flex-col gap-2'>
      <h2 className='justify-center text-center items-center'>{heading}</h2>
      <div className="flex flex-wrap gap-x-4 gap-y-6 items-center justify-center">
        {companies.map((company) => (
          <CompanyCard 
            key={company}
            cardHeader={company}
            cardContent={`List of products from ${company}`}
            link={`/company/${company}`}
            / >
        ))}
      </div>
    </section>
}


export default CompanyList