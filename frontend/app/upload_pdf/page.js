"use client"

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'


export default function () {
    const [productName, setproductName] = useState();
    const [productType, setProductType] = useState();
    const [companyName, setCompanyName] = useState();
    const [uploaded, setUploaded] = useState(false);
    const [availableURL, setAvailableURL] = useState();

    useEffect(() => {
        setAvailableURL(`${window.location.protocol}//${window.location.host}/${companyName}/${productName}`)
    }, [uploaded])

    async function handleFileUpload() {
        if (!file.files[0]) {
            console.log("No file selected")
        } else {
            console.log("Uploading file...");
            const formData = new FormData();
            formData.append("file", file.files[0]);
            console.log(formData)

            const add_to_db = await fetch(`/api/add_manual_to_db?company_name=${companyName}&product_name=${productName}&product_device=${productType}`, {
                method: 'POST'
            }).then(data => data.json())

            const uploadRes = await fetch(`http://127.0.0.1:8000/upload?manual_id=${add_to_db.manual_id}&manual_name=${productName}`, {
                method: 'POST',
                body: formData
            }).then(data => data.json());


            setUploaded(uploadRes.status == 200)
        }
    }

    return (
        <div>
            <input id="file" type="file" />
            <div>
                <p>Manual Name</p>
                <input onChange={(e) => { setproductName(e.target.value) }} style={{ color: 'black' }} />
            </div>
            <div>
                <p>Company Name</p>
                <input onChange={(e) => { setCompanyName(e.target.value) }} style={{ color: 'black' }} />
            </div>
            <div>
                <p>Product Type</p>
                <input onChange={(e) => { setProductType(e.target.value) }} style={{ color: 'black' }} />
            </div>
            <Button onClick={handleFileUpload}>Upload</Button>
            {uploaded ?
                <div style={{ backgroundColor: 'green' }}>YOUR KNOWLEDGEBASE IS READY AT <a href={availableURL}>{availableURL}</a>
                </div>
                :
                <div style={{ backgroundColor: 'red' }}>NOT UPLOADED</div>
            }
        </div>
    )
}
