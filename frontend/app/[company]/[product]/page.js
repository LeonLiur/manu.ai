import Ask_Question from '@/components/AskQuestion'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjdjndejomtwmwffjgxf.supabase.co'
const supabaseKey = process.env["SUPABASE_KEY"]
const supabase = createClient(supabaseUrl, supabaseKey)


// Generate segments for both [company] and [product]
export async function generateStaticParams() {
    const dbRes = await supabase
        .from('manuals')
        .select("*")

    return dbRes.data.map((manual) => ({
        company: manual.company_name,
        product: manual.product_name,
    }))
}


export default async function Page({ params }) {
    const manualEntry = await getManualEntry(params.company, params.product)

    return <>
        {manualEntry &&
            manualEntry.valid ?
            <div>
                <Ask_Question manual_id={manualEntry.manual_id} manual_device={manualEntry.product_device} file_url={manualEntry.url} manual_name = {manualEntry.product_name} />
            </div> :
            <div>404</div>
        }
    </>
}


async function getManualEntry(companyName, productName) {
    const dbRes = await supabase
        .from('manuals')
        .select('[manual_id, file_name, company_name, product_name, product_type]')
        .eq('company_name', companyName)
        .eq('product_name', productName)
        .limit(1)
        .single()

    if (dbRes.error != null) {
        return { valid: false }
    }

    const url = await fetch(`${process.env['NEXT_PUBLIC_BACKEND_URL']}/file?file_name=${dbRes.data.file_name}`, {
        method: 'GET',
        cache: 'no-cache'
    }).then(data => data.json())



    return { valid: true, manual_id: dbRes.data.manual_id, product_name: dbRes.data.product_name, product_device: dbRes.data.product_device, url: url }
}