"use client"

import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { highlightPlugin, Trigger } from '@react-pdf-viewer/highlight';
import { HighlightArea, RenderHighlightsProps } from '@react-pdf-viewer/highlight';
import { searchPlugin } from '@react-pdf-viewer/search';
import { StatDownArrow } from "@chakra-ui/react";

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import { NextIcon, PreviousIcon, SearchIcon } from '@react-pdf-viewer/search';
import { ArrowDownRight, LucideArrowLeftRight } from 'lucide-react';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export default function AskQuestion({ manual_id, manual_device, file_url, manual_name}) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const [question, setQuestion] = useState("")
    const [image, setImage] = useState(null)
    const [fix, setFix] = useState(null)
    const [documentLoaded, setDocumentLoaded] = useState(false);
    const [highlightKeyword, setHighlightKeyword] = useState("");

    const handleOnClick = async () => {
        const formData = new FormData()
        let query_return = null

        if (file.files[0]) {
            formData.append("file", file.files[0])
            setImage(URL.createObjectURL(file.files[0]))

            query_return = await fetch(`${BACKEND_URL}/query?id=${manual_id}&qstring=${question}&device=${manual_device}`, {
                method: 'POST',
                body: file.files[0]
            }).then(data => data.json())
        } else {
            query_return = await fetch(`${BACKEND_URL}/query?id=${manual_id}&qstring=${question}&device=${manual_device}`, {
                method: 'POST',
            }).then(data => data.json())
        }



        console.log(query_return)

        setFix(query_return["result"])
        setHighlightKeyword(query_return["query_documents"][0][0].split('|')[0])

    }

    const areas = [
        {
            pageIndex: 3,
            height: 1.55401,
            width: 28.1674,
            left: 27.5399,
            top: 15.0772,
        },
        {
            pageIndex: 3,
            height: 1.32637,
            width: 37.477,
            left: 55.7062,
            top: 15.2715,
        },
        {
            pageIndex: 3,
            height: 1.55401,
            width: 28.7437,
            left: 16.3638,
            top: 16.6616,
        },
    ];



    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const renderHighlights = (props) => (
        <div>
            {areas
                .filter((area) => area.pageIndex === props.pageIndex)
                .map((area, idx) => (
                    <div
                        key={idx}
                        className="highlight-area"
                        style={Object.assign(
                            {},
                            {
                                background: 'yellow',
                                opacity: 0.4,
                            },
                            // Calculate the position
                            // to make the highlight area displayed at the desired position
                            // when users zoom or rotate the document
                            props.getCssProperties(area, props.rotation)
                        )}
                    />
                ))}
        </div>
    );
    const highlightPluginInstance = highlightPlugin({
        renderHighlights,
        trigger: Trigger.None,
    });
    const searchPluginInstance = searchPlugin({
        enableShortcuts: true,
    });

    const { highlight } = searchPluginInstance;

    const default_page = 0;


    useEffect(() => {
        if (documentLoaded) {
            highlight({
                keyword: highlightKeyword,
                matchCase: false,
            });
        }
    }, [highlightKeyword]);

    return (
        <div className="py-6 items-center justify-center" style={{ width: "100%", height: "100%" }}>
            <div className="flex flex-row mx-10">
                <a href="" className="text-3xl font-bold">Manu.ai</a>
            </div>
            <div className="flex flex-col h-full mt-10" style={{ padding: "20px", width: "100%" }}>
                <h1 className="text-5xl font-bold self-center mb-2">Ask Away</h1>
                <div className="flex w-full justify-center mb-5 justify-items-center gap-2">
                    <div className="flex flex-grow"></div>
                    <a className="text-sm flex w-fit bg-slate-700 border-slate-400 border-2 pr-3 pl-2 rounded-full items-center hover:bg-slate-500 hover:border-b-slate-400">
                        <ArrowDownRight className="h-4 w-4 mr-3" />
                        Manual: {manual_name}
                    </a>
                    <a className="text-sm flex w-fit bg-slate-700 border-slate-400 border-2 pr-3 pl-2 rounded-full items-center hover:bg-slate-500 hover:border-b-slate-400">
                        <MagnifyingGlassIcon className="h-4 w-4 mr-3" />
                        ID: {manual_id}
                    </a>
                    <div className="flex flex-grow"></div>
                </div>
                <div className="px-20">
                    <div className="flex flex-col gap-2">
                        <div className='flex flex-row '>
                            <input
                                className="min-w-0 flex-auto mr-2 rounded-md border-0 bg-white/5 px-3.5 py-2 text-white font-medium shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 "
                                name="question" id="question" placeholder="My dishwasher won't turn on" onChange={(e) => setQuestion(e.target.value)}>
                            </input>
                            <Button
                                className="hover:bg-slate-700 active:scale-105 transition-transform duration-100"
                                onClick={handleOnClick}>SUBMIT
                            </Button>
                            {/* {fix && <img src={image} />} */}
                        </div>
                        <div className="flex flex-row">
                            <input id="file" type="file" placeholder='Choose Image' className="w-fit hover:cursor-pointer" />
                            <div className="flex flex-grow"></div>
                        </div>
                    </div>
                    {/* <p className="rounded-sm bg-green-100 border-green-600 border-2 border-dotted text-green-900 text-medium my-4 px-2 py-2 ">
                    If your Whirlpool dishwasher is leaking, start by inspecting the door seal for any obstructions or damage. Ensure the dishwasher is level, as an uneven position can cause leaks. Check the door latch for proper operation and inspect all hoses and connections for signs of leakage. Overuse of detergent can lead to over-sudsing, which might cause leaks. Also, examine the float assembly and the water inlet valve to ensure they are functioning correctly. If these steps don't resolve the issue or if you notice significant damage, consider contacting a professional for repair.</p> */}
                    {fix && <p cclassName="rounded-sm bg-green-100 border-green-600 border-2 border-dotted text-green-900 text-medium my-4 px-2 py-2">{fix}</p>}
                </div>
                
               

                {file_url &&
                    <div className="mx-10 px-10 mt-6">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <div style={{ height: '750px' }}>
                                <Viewer
                                    onDocumentLoad={() => setDocumentLoaded(true)}
                                    fileUrl={file_url ? file_url : "../blank_pdf.pdf"}
                                    plugins={[
                                        defaultLayoutPluginInstance,
                                        // highlightPluginInstance,
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
