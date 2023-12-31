"use client"
import Image from 'next/image'
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { highlightPlugin, Trigger } from '@react-pdf-viewer/highlight';
import { searchPlugin } from '@react-pdf-viewer/search';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import { ArrowDownRight, CameraIcon } from 'lucide-react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';



export default function AskQuestion({ manual_id, manual_device, file_url, manual_name }) {
    const [question, setQuestion] = useState("")
    const [image, setImage] = useState(null)
    const [fix, setFix] = useState(null)
    const [documentLoaded, setDocumentLoaded] = useState(false)
    const [highlightKeyword, setHighlightKeyword] = useState("");

    const handleOnClick = async () => {
        const formData = new FormData()
        let query_return = null

        //set button loading
        document.getElementById("");

        if (file.files[0]) {
            formData.append("file", file.files[0])
            setImage(URL.createObjectURL(file.files[0]))

            query_return = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/query?id=${manual_id}&qstring=${question}&device=${manual_device}`, {
                method: 'POST',
                body: file.files[0]
            }).then(data => data.json())
        } else {
            query_return = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/query?id=${manual_id}&qstring=${question}&device=${manual_device}`, {
                method: 'POST',
            }).then(data => data.json())
        }

       
        setFix(query_return["result"])
        
        const kwd = query_return["query_documents"][0].split(/[|\n]/).reduce((longest, current) => {
            return current.length > longest.length ? current : longest;
        }, '')

        setHighlightKeyword(kwd.slice(0, -1))

        highlight({
            keyword: kwd.slice(0, -1),
            matchCase: false,
        })

        console.log(`highlight keyword: ${kwd.slice(0, -1)}`)
    }




    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    const searchPluginInstance = searchPlugin({
        enableShortcuts: true,
    });

    const { highlight } = searchPluginInstance;

    const default_page = 0;

    return (
        <div className="py-6 items-center justify-center" style={{ width: "100%", height: "100%" }}>
            <div className="flex flex-col h-full mt-10" style={{ padding: "20px", width: "100%" }}>
                <h1 className="text-5xl font-bold self-center mb-2">Ask Away</h1>
                <div className="flex w-full justify-center mb-5 justify-items-center gap-2">
                    <div className="flex flex-grow"></div>
                    <a className="text-sm flex w-fit hover:bg-gray-200/50 hover:border-gray-200 dark:bg-slate-700 dark:border-slate-400 border-2 pr-3 pl-2 rounded-full items-center dark:hover:bg-slate-500 dark:hover:border-b-slate-400">
                        <ArrowDownRight className="h-4 w-4 mr-3" />
                        Manual: {manual_name}
                    </a>
                    <a className="text-sm flex w-fit hover:bg-gray-200/50 hover:border-gray-200 dark:bg-slate-700 dark:border-slate-400 border-2 pr-3 pl-2 rounded-full items-center dark:hover:bg-slate-500 dark:hover:border-b-slate-400">
                        <MagnifyingGlassIcon className="h-4 w-4 mr-3" />
                        ID: {manual_id}
                    </a>
                    <div className="flex flex-grow"></div>
                </div>
                <div className="px-20">
                    <div className="flex flex-col gap-2">
                        <div className='flex'>
                            <div className="relative w-full mr-2">
                                <input
                                    className="min-w-0 w-full mr-2 rounded-md border-[1px] bg-white/5 px-3.5 py-2 text-black font-medium shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 "
                                    name="question" id="question" placeholder="My dishwasher won't turn on" onChange={(e) => setQuestion(e.target.value)}>
                                </input>
                                <button className='absolute right-0 top-0 px-3 py-2'>
                                    <CameraIcon></CameraIcon>
                                </button>
                            </div>
                            <Button
                                className="hover:bg-slate-700 active:scale-105 transition-transform duration-100"
                                onClick={handleOnClick}>ASK
                            </Button>

                        </div>
                        <div className="flex flex-row">
                            <input id="file" type="file" placeholder='Choose Image' className="w-fit hover:cursor-pointer" />
                            <div className="flex flex-grow"></div>
                        </div>
                    </div>

                    {fix &&
                        <div className='container items-center flex gap-2 rounded-sm bg-green-100 border-green-600 border-2 border-dotted text-green-900 text-medium my-4 px-2 py-2'>

                            {fix &&
                                <div className="max-w-1/2">
                                    {image && <Image className="rounded-md" src={image} alt="user-uploaded img" />}
                                </div>
                            }
                            <p className="min-w-1/2">{fix}</p>
                        </div>
                    }
                </div>



                {file_url &&
                    <div className="sm:mx-auto sm:px-5 mx-10 px-10 mt-6 sm:w-full">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <div style={{ height: '750px' }}>
                                <Viewer 
                                    onDocumentLoad={() => setDocumentLoaded(true)}
                                    fileUrl={file_url ? file_url : "../blank_pdf.pdf"}
                                    plugins={[
                                        defaultLayoutPluginInstance,
                                        searchPluginInstance
                                    ]}
                                    initialPage={default_page}
                                />
                            </div>
                        </Worker>
                    </div>
                }
            </div>

        </div>
    )
}
