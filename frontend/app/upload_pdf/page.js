"use client"

import { Button } from '@/components/ui/button';
import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import QRCode from 'qrcode.react';
import clsx from 'clsx';
import { DevTool } from '@hookform/devtools';
import StyledDropzone from '@/components/ui/styled-dropzone';

export default function Upload() {
    const [productName, setProductName] = useState();
    const [productType, setProductType] = useState();
    const [companyName, setCompanyName] = useState();
    const [uploaded, setUploaded] = useState(false);
    const [availableURL, setAvailableURL] = useState();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState();

    useEffect(() => {
        setAvailableURL(`${window.location.protocol}//${window.location.host}/company/${companyName}/${productName}`)
    }, [uploaded, companyName, productName])

    const form = useForm({
        mode: 'onChange',
        defaultValues: {
            file: "",
            companyName: "",
            productName: "",
            productType: "",
        },
    })

    const isLoading = form.formState.isSubmitting;

    const buttonStyle = useMemo(() => {
        clsx("hover:bg-slate-500", {
            "animate-pulse": isLoading,
            "duration-100": isLoading,
            "disabled": isLoading,
        })
    }, [isLoading])

    const onError = (errors, e) => {
        console.log(errors, e);
    }

    const onSubmit = async (data) => {
        console.log(data);
        setUploaded(false);
        if (!data.file[0]) console.log("No file selected");
        else {
            const companyName = data.companyName.toLowerCase();
            const productName = data.productName.toLowerCase();
            const productType = data.productType;

            setCompanyName(companyName)
            setProductName(productName)
            setProductType(productType)

            console.log(`Uploading file: ${data.file[0].name}`);
            const formData = new FormData();
            formData.append("file", data.file[0]);
            const add_to_db = await fetch(`${process.env["NEXT_PUBLIC_BACKEND_URL"]}/add_manual_to_db?company_name=${companyName}&product_name=${productName}&product_device=${productType}&file_name=${data.file[0].name}`, {
                method: 'POST'
            }).then(data => data.json())

            const uploadRes = await fetch(`${process.env["NEXT_PUBLIC_BACKEND_URL"]}/upload?manual_id=${add_to_db.manual_id}&manual_name=${productName}`, {
                method: 'POST',
                body: formData
            }).then(data => data.json());

            setUploaded(uploadRes.status == 200)
            form.reset();
        }
    }

    const { register, control, handleSubmit, formState } = form;
    const { errors } = formState;

    return (
        <div className="py-6 items-center justify-center" style={{ width: "100%", height: "100%" }}>
            <div className="flex mt-10 w-[700] min-w-[400] justify-center items-center">
                <div className="flex flex-col p-10 border-2  border-gray-400 dark:border-gray-600 rounded-md shadow-md shadow-gray-300 dark:shadow-slate-900 gap-4">
                    <div className="flex flex-col justify-center">
                        <p className="self-center h-12 w-12 text-3xl">📋</p>
                        <h1 className="self-center text-3xl font-bold mb-10">Upload PDF</h1>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit, onError)} className='w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col' noValidate>
                        <article>
                            <StyledDropzone control={control} name="files" disabled={isLoading} id="file" {...register("file", {
                                required: {
                                    value: true,
                                    message: "A file is required"
                                }
                            })} />
                            <p className="error">{errors.file?.message}</p>
                        </article>
                        <article>
                            <label htmlFor='manualname' className="font-medium mb-2">Product Name</label>
                            <input disabled={isLoading} id="manualname" className="w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-slate-900 font-sm shadow-sm ring-1 ring-inset dark:text-white  ring-gray/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 hover:ring-gray-600"
                                placeholder='Ex: Samsung Spin Cycle 3000'
                                {...register("productName", {
                                    required: {
                                        value: true,
                                        message: "A product name is required"
                                    }
                                })}
                            />
                            <p className="error">{errors.productName?.message}</p>
                            {/* onChange={(e) => { setproductName(e.target.value.toLowerCase()) }} /> */}
                        </article>
                        <article>
                            <label htmlFor='companyname' className="font-medium mb-2">Company Name</label>
                            <input disabled={isLoading} id="companyname" className="w-full rounded-md border-0 bg-white/5 px-3.5 py-2 text-slate-900 dart:text-white font-sm shadow-sm ring-1 ring-inset ring-gray/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 hover:ring-gray-600"
                                placeholder='Ex: Samsung'
                                {...register("companyName", {
                                    required: {
                                        value: true,
                                        message: "A company name is required",
                                    }
                                })}
                            />
                            <p className="error">{errors.companyName?.message}</p>
                        </article>
                        <article>
                            <label htmlFor='select' className="font-medium mb-2">Product Type</label>
                            <select disabled={isLoading} id="select" className={clsx(
                                "w-full rounded-md border-0 bg-white/5 pl-2 pr-3 py-2 text-slate-900 dark:text-white font-sm shadow-sm ring-1 ring-inset ring-gray/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 hover:ring-gray-600 ",
                                {
                                    "text-gray-300": productType === "",
                                }
                            )}
                                onChange={(e) => { setProductType(e.target.value) }}

                                {...register("productType", {
                                    validate: (fieldValue) => {
                                        return fieldValue !== "" || "Please select an option"
                                    }

                                })}>

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
                            <p className="error">{errors.productType?.message}</p>
                        </article>
                        <Button disabled={isLoading} id="upload" className={buttonStyle}>{isLoading ? "Uploading..." : "Upload"}</Button>
                    </form>
                    {/* <DevTool control={control}/> */}
                    {uploaded ?
                        <div className="flex items-center gap-4">
                            <div className="flex items-center rounded-sm py-2 px-2 border-2 border-green-500">
                                <div className="flex flex-col">
                                    <div className='flex items-center gap-2 mr-4'>
                                        <div id="circle-indicator" className="w-4 h-4 bg-green-500 rounded-full"></div>
                                        <div className="flex flex-col">
                                            <p className="text-slate-800 dark:text-slate-300">Your knowledgebase is ready at:</p>
                                            <a className="hover:underline" href={availableURL}>{availableURL}</a>
                                        </div>
                                    </div>

                                </div>
                                <QRCode value={availableURL}></QRCode>
                            </div>
                        </div>
                        :
                        <div className="flex items-center gap-4">
                            {/* <div id="circle-indicator" className="w-4 h-4 bg-red-500 rounded-full"></div>
                            <p className="text-slate-900 dark:text-white">NOT UPLOADED</p>
                            <div className= "flex flex-grow"></div> */}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

