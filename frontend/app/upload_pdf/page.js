"use client"

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode.react';


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

            const add_to_db = await fetch(`/api/add_manual_to_db?company_name=${companyName}&product_name=${productName}&product_device=${productType}&file_name=${file.files[0].name}`, {
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
        <div className="py-6 items-center justify-center" style={{ width: "100%", height: "100%" }}>
            <div className="flex flex-row mx-10">
                <a href="" className="text-3xl font-bold">Manu.ai</a>
            </div>
            <div className="flex mt-10 w-[700] min-w-[400] justify-center items-center">
                <div className="flex flex-col p-10 border-2 rounded-md shadow-md gap-4">
                    <h1 className="text-3xl font-bold mb-10">Upload PDF</h1>
                    <input id="file" type="file" />
                    <div>
                        <p className="font-semibold mb-2">Manual Name</p>
                        <input className="w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-gray-100 font-sm shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 hover:ring-gray-600"
                        placeholder='Ex: Samsung Spin Cycle 3000'
                        onChange={(e) => { setproductName(e.target.value) }} />
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Company Name</p>
                        <input className="w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-gray-100 font-sm shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 hover:ring-gray-600"
                        placeholder='Ex: Samsung'
                        onChange={(e) => { setCompanyName(e.target.value) }} />
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Product Type</p>
                        <select className="w-full rounded-md border-0 bg-white/5 pl-2 pr-3 py-2 text-gray-100 font-sm shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 hover:ring-gray-600 "
                        onChange={(e) => { setProductType(e.target.value) }}>
                            <option className="text-gray-300" value="" disabled selected>Select your option</option>
                            <option value="dishwasher">Dishwasher</option>
                            <option value="washing machine">Washing Machine</option>
                            <option value="fridge">Refridgerator</option>
                            <option value="microwave">Microwave</option>
                            <option value="oven">Oven</option>
                            <option value="furniture">Furniture</option>
                            <option value="television">Television</option>
                            <option value="monitor">Monitor</option>
                            <option value="computer">Computer</option>
                            <option value="blender">Blender</option>
                            <option value="rice cooker">Rice Cooker</option>
                            <option value="juicer">Juicer</option>
                            <option value="air fryer">Air Fryer</option>
                            <option value="water heater">Water Heater</option>
                            <option value="electric kettle">Electric Kettle</option>
                        </select>
                    </div>
                    <Button className="hover:bg-slate-500" onClick={handleFileUpload}>Upload</Button>
                    {uploaded ?
                        <div className="flex items-center gap-4">
                            <div id="circle-indicator" className="w-4 h-4 bg-green-500 rounded-full"></div>
                            <p className="text-slate-300">YOUR KNOWLEDGEBASE IS READY AT</p>
                            <a href={availableURL}>{availableURL}</a>
                            <QRCode value={availableURL}></QRCode>
                        </div>
                        :
                        <div className="flex items-center gap-4">
                            <div id="circle-indicator" className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <p className="text-slate-300">NOT UPLOADED</p>
                            <div className= "flex flex-grow"></div>
                            
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
