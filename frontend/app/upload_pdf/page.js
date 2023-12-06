"use client"

import { Button } from '@/components/ui/button';
import React, { useEffect, useState, useId } from 'react'
import QRCode from 'qrcode.react';
import SearchableDropdown from '@/components/ui/SeachableDropdown';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

const Container = styled.div`
flex: 1;
display: flex;
flex-direction: column;
align-items: center;
padding: 20px;
border-width: 2px;
border-radius: 2px;
border-color: ${props => getColor(props)};
border-style: dashed;
background-color: #fafafa;
color: #bdbdbd;
outline: none;
transition: border .24s ease-in-out;
`;

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
    const getColor = (props) => {
        if (props.isDragAccept) {
            return '#00e676';
        }
        if (props.isDragReject) {
            return '#ff1744';
        }
        if (props.isFocused) {
            return '#2196f3';
        }
        return '#eeeeee';
    }

    function Dropzone(props) {
        const { acceptedFiles, fileRejections, getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
            useDropzone({
                maxFiles: 1,
            });

        const acceptedFileItems = acceptedFiles.map(file => (
            <li key={file.path}>
                {file.path} - {file.size} bytes
            </li>
        ));

        const fileRejectionItems = fileRejections.map(({ file, errors }) => (
            <li key={file.path}>
                {file.path} - {file.size} bytes
                <ul>
                    {errors.map(e => (
                        <li key={e.code}>{e.message}</li>
                    ))}
                </ul>
            </li>
        ));

        return (
            <div className="container w-full">
                <Container className="w-full" {...getRootProps({ isFocused, isDragAccept, isDragReject })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </Container>
                <p>Uploaded files: {acceptedFileItems}</p>
            </div>
        );


    }


    return (
        <div className="py-6 items-center justify-center" style={{ width: "100%", height: "100%" }}>
            <div className="flex flex-row mx-10">
                <a href="" className="text-3xl font-bold">Manu.ai</a>
            </div>
            <div className="flex mt-10 w-[700] min-w-[400] justify-center items-center">
                <div className="flex flex-col p-10 border-2 rounded-md shadow-md">
                    <h1 className="text-3xl font-bold mb-10">Upload PDF</h1>
                    {/* <form className="flex flex-col gap-4" onSubmit={handleFileUpload}> */}
                    <div className="flex flex-col gap-4">
                        <input id="file" type="file" />
                        {/* <Dropzone id="file" type="file"/> */}
                        <div>
                            <p>Manual Name</p>
                            <input className="w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white font-medium shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 "
                                onChange={(e) => { setproductName(e.target.value) }} />
                        </div>
                        <div>
                            <p>Company Name</p>
                            <input className="w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-white font-medium shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 "
                                onChange={(e) => { setCompanyName(e.target.value) }} />
                        </div>
                        <div>
                            <p>Product Type</p>
                            <SearchableDropdown className="w-full bg-slate-500 text-gray-50" onChange={(e) => { setProductType(e.target.value) }} />
                        </div>
                        <Button className="mb-4" onClick={handleFileUpload}>Upload</Button>
                    </div>
                    {/* </form> */}

                    {uploaded ?
                        <div>
                            <div style={{ backgroundColor: 'green' }}>YOUR KNOWLEDGEBASE IS READY AT <a href={availableURL}>{availableURL}</a>
                            </div>
                            <QRCode value={availableURL}></QRCode>
                        </div>
                        :
                        <div style={{ backgroundColor: 'red' }}>NOT UPLOADED</div>
                    }
                </div>
            </div>
        </div>
    )
}
