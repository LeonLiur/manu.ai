import Ask_Question from '@/components/AskQuestion'

// // Generate segments for both [company] and [product]
// export async function generateStaticParams() {
//     const dbRes = await supabase
//         .from('manuals')
//         .select("*")

//     return dbRes.data.map((manual) => ({
//         company: manual.company_name,
//         product: manual.product_name,
//     }))
// }


export default async function QueryPage({ params }) {
    const manualEntry = await getManualEntry(params)

    return <>
        {
            manualEntry.status == 200 ?
                <div>
                    <Ask_Question manual_id={manualEntry.manual_id} manual_device={manualEntry.product_device} file_url={manualEntry.url} manual_name={manualEntry.product_name} />
                </div> :
                <div>404</div>
        }
    </>
}

async function getManualEntry(params) {
    const res = await fetch(`http://0.0.0.0:8000/retrieve_manual_from_db?companyName=${params.company}&productName=${params.product}`, {
        method: 'GET',
        cache: 'no-cache',
    }).then(data => data.json())

    return res
}