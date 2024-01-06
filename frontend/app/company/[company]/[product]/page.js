import Ask_Question from '@/components/AskQuestion'
import { notFound } from 'next/navigation'

export default async function QueryPage({ params }) {
    const manualEntry = await getManualEntry(params)
    if (manualEntry.status != 200) {
        notFound();
    }

    return (
        <div>
            <Ask_Question manual_id={manualEntry.manual_id} manual_device={manualEntry.product_device} file_url={manualEntry.url} manual_name={manualEntry.product_name} />
        </div>
    )
}

async function getManualEntry(params) {
    const res = await fetch(`${process.env['BACKEND_URL']}/retrieve_manual_from_db?companyName=${params.company}&productName=${params.product}`, {
        method: 'GET',
        cache: 'no-cache',
    }).then(data => data.json())

    return res
}