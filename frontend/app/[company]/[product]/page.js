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
            <div>
                <p>Manual ID: {manualEntry.manual_id}</p>
                <p>Manual Name: {manualEntry.product_name}</p>
                <Ask_Question manual_id={manualEntry.manual_id} manual_device={manualEntry.product_device} file_name={manualEntry.file_name}/>
            </div>
        }
    </>
}


async function getManualEntry(companyName, productName) {
    const dbRes = await supabase
        .from('manuals')
        .select("*")
        .eq('company_name', companyName)
        .eq('product_name', productName)
        .limit(1)
        .single()

    if (dbRes.error != null) {
        return null
    }

    return dbRes.data
}