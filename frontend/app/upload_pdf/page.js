"use client"

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'
import QRCode from 'qrcode.react';

export default function Upload() {
    const [productName, setproductName] = useState();
    const [productType, setProductType] = useState();
    const [companyName, setCompanyName] = useState();
    const [uploaded, setUploaded] = useState(false);
    const [availableURL, setAvailableURL] = useState();

    useEffect(() => {
        setAvailableURL(`${window.location.protocol}//${window.location.host}/${companyName}/${productName}`)
    }, [uploaded, companyName, productName])

    async function handleFileUpload() {
        if (!file.files[0]) {
            console.log("No file selected")
        } else {
            document.getElementById("upload").classList.add("animate-pulse");
            document.getElementById("upload").classList.add("duration-100");
            document.getElementById("upload").setAttribute("disabled", "true");
            document.getElementById("upload").innerHTML = "Uploading...";
            console.log("Uploading file...");
            const formData = new FormData();
            formData.append("file", file.files[0]);

            const add_to_db = await fetch(`http://0.0.0.0:8000/add_manual_to_db?company_name=${companyName}&product_name=${productName}&product_device=${productType}&file_name=${file.files[0].name}`, {
                method: 'POST'
            }).then(data => data.json())

            const uploadRes = await fetch(`http://0.0.0.0:8000/upload?manual_id=${add_to_db.manual_id}&manual_name=${productName}`, {
                method: 'POST',
                body: formData
            }).then(data => data.json());


            setUploaded(uploadRes.status == 200)
            document.getElementById("upload").classList.remove("animate-pulse")
            document.getElementById("upload").innerHTML = "Uploaded"
            document.getElementById("file").value = "";
            document.getElementById("manualname").value = "";
            document.getElementById("companyname").value ="";
            document.getElementById("select").value ="";
        }
    }

    return (
        <div className="py-6 items-center justify-center" style={{ width: "100%", height: "100%" }}>
            <div className="flex flex-row mx-10">
                <a href="" className="text-3xl font-bold">Manu.ai</a>
            </div>
            <div className="flex mt-10 w-[700] min-w-[400] justify-center items-center">
                <div className="flex flex-col p-10 border-2  border-gray-400 dark:border-gray-600 rounded-md shadow-md shadow-gray-300 dark:shadow-slate-900 gap-4">
                    
                    <div className="flex flex-col justify-center">
                        <p className="self-center h-12 w-12 text-3xl">📋</p>
                        <h1 className="self-center text-3xl font-bold mb-10">Upload PDF</h1>
                    </div>
                    <input id="file" type="file" />
                    <div>
                        <p className="font-semibold mb-2">Manual Name</p>
                        <input id="manualname" className="w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-slate-900 font-sm shadow-sm ring-1 ring-inset dark:text-white  ring-white/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 hover:ring-gray-600"
                        placeholder='Ex: Samsung Spin Cycle 3000'
                        onChange={(e) => { setproductName(e.target.value) }} />
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Company Name</p>
                        <input id="companyname" className="w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-slate-900 dart:text-white font-sm shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 hover:ring-gray-600"
                        placeholder='Ex: Samsung'
                        onChange={(e) => { setCompanyName(e.target.value.toLowerCase()) }} />
                    </div>
                    <div>
                        <p className="font-semibold mb-2">Product Type</p>
                        <select id="select" className="w-full rounded-md border-0 bg-white/5 pl-2 pr-3 py-2 text-slate-900 dark:text-white font-sm shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 hover:ring-gray-600 "
                        onChange={(e) => { setProductType(e.target.value) }} defaultValue={""}>
                            <option className="text-gray-300" value="" disabled>Select your option</option>
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
                    <Button id="upload" className="hover:bg-slate-500" onClick={handleFileUpload}>Upload</Button>
                    {uploaded ?
                        <div className="flex items-center gap-4">
                            <div className="flex items-center rounded-sm py-2 px-2 border-2 border-green-500">
                                <div className="flex flex-col">
                                    <div className='flex items-center gap-2 mr-4'>
                                        <div id="circle-indicator" className="w-4 h-4 bg-green-500 rounded-full"></div>
                                        <div className="flex flex-col">
                                            <p className="text-slate-300">Your knowledgebase is ready at:</p>
                                            <a className="hover:underline" href={availableURL}>{availableURL}</a>
                                        </div>
                                    </div>
                                    
                                </div>
                                <QRCode value={availableURL}></QRCode>
                            </div>
                        </div>
                        :
                        <div className="flex items-center gap-4">
                            <div id="circle-indicator" className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <p className="text-slate-900 dark:text-white">NOT UPLOADED</p>
                            <div className= "flex flex-grow"></div>
                            
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
