import { NextResponse } from "next/server"
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rjdjndejomtwmwffjgxf.supabase.co'
const supabaseKey = process.env["NEXT_PUBLIC_SUPABASE_KEY"]
const supabase = createClient(supabaseUrl, supabaseKey)


export async function POST(req) {
    const query = req.nextUrl.searchParams

    const dbRes = await supabase
        .from('manuals')
        .insert([
            { company_name: query.get("company_name"), product_name: query.get('product_name'), product_device: query.get('product_device') },
        ]).select()

    if(dbRes.error != null){
        return NextResponse.json({ error: dbRes.error }, { status: 500 })
    }

    return NextResponse.json({ manual_id: dbRes.data[0]["manual_id"] }, { status: 200 })
}