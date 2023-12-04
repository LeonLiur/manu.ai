"use client"

import React, { useState } from 'react'

export default async function () {
    const [size, setSize] = useState(0);
    const BACKEND_URL = process.env.BACKEND_URL;

    async function handleFileUpload() {
        if (!file.files[0]) {
            console.log("No file selected")
        } else {
            console.log("Uploading file...");
            const formData = new FormData();
            formData.append("file", file.files[0]);
            console.log(formData)
            const res = await fetch(`${BACKEND_URL}/pdf`, {
                method: 'POST',
                body: formData
            }).then(data => data.json());
            setSize(res["size"])
        }
    }

    return (
        <div>
            <input id="file" type="file"/>
            <button onClick={handleFileUpload}>Upload</button>
        </div>
    )
}
