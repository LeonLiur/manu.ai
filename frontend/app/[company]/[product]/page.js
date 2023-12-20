import Ask_Question from '@/components/AskQuestion'

export default async function QueryPage({ params }) {
    const manualEntry = await getManualEntry(params)

    return <>
        {
            manualEntry.status == 200 ?
                <div>
                    <Ask_Question manual_id={manualEntry.manual_id} manual_device={manualEntry.product_device} file_url={manualEntry.url} manual_name={manualEntry.product_name} />
                </div> :
                <div>Manual Not Found</div>
        }
    </>
}

async function getManualEntry(params) {
    const res = await fetch(`${process.env['NEXT_PUBLIC_BACKEND_URL']}/retrieve_manual_from_db?companyName=${params.company}&productName=${params.product}`, {
        method: 'GET',
        cache: 'no-cache',
    }).then(data => data.json())

    return res
}