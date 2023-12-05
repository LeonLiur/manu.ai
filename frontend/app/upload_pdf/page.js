"use client"

import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import 'dotenv/config'

export default function () {
    const [manualName, setManualName] = useState();
    const [manualID, setManualID] = useState(401);
    const [uploaded, setUploaded] = useState(false);

    async function handleFileUpload() {
        console.log(process.env)
        if (!file.files[0]) {
            console.log("No file selected")
        } else {
            console.log("Uploading file...");
            const formData = new FormData();
            formData.append("file", file.files[0]);
            console.log(formData)
            const res = await fetch(`http://127.0.0.1:8000/upload?manual_id=${manualID}&manual_name=${manualName}`, {
                method: 'POST',
                body: formData
            }).then(data => data.json());
            setUploaded(res.status == 200)
        }
    }

    return (
        <div>
            <input id="file" type="file"/>
            <div>
                <p>Manual Name</p>
                <input onChange={(e) => {setManualName(e.target.value)}} style={{color : 'black'}}/>
            </div>
            <Button onClick={handleFileUpload}>Upload</Button>
            {uploaded ? 
                <div style={{backgroundColor : 'green'}}>UPLOADED</div>
                :
                <div style={{backgroundColor : 'red'}}>NOT UPLOADED</div>
            }
        </div>
    )
}
