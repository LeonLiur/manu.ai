"use client"

import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { highlightPlugin, Trigger } from '@react-pdf-viewer/highlight';
import { HighlightArea, RenderHighlightsProps } from '@react-pdf-viewer/highlight';
import { searchPlugin } from '@react-pdf-viewer/search';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import '@react-pdf-viewer/search/lib/styles/index.css';
import { NextIcon, PreviousIcon, SearchIcon } from '@react-pdf-viewer/search';

export default function () {
    const BACKEND_URL = process.env.BACKEND_URL;

    const [question, setQuestion] = useState("")
    const [image, setImage] = useState(null)
    const [fix, setFix] = useState(null)

    const handleOnClick = async () => {
        if (!file.files[0]) {
            console.log("no file uploaded")
        } else {
            const formData = new FormData()
            formData.append("file", file.files[0])
            setImage(URL.createObjectURL(file.files[0]))

            const query_return = await fetch(`http://127.0.0.1:8000/query?id=401&qstring=${question}`, {
                method: 'POST',
                body: formData,
            }).then(data => data.json())

            setFix(query_return["result"])
            console.log(query_return)
        }

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

    
    
    // highlight([
    //     'document',
    //     {
    //         keyword: 'PDF',
    //         matchCase: true,
    //     },
    // ]);

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
    
    const default_page = areas[0].pageIndex;
    
    const [isDocumentLoaded, setDocumentLoaded] = React.useState(false);
    const handleDocumentLoad = () => setDocumentLoaded(true);

    React.useEffect(() => {
        if (isDocumentLoaded) {
            highlight({
                keyword: `Will the following line of code compile`,
                matchCase: true,
            });
        }
    }, [isDocumentLoaded]);

    return (
        <div className="py-6 items-center justify-center" style={{width: "100%", height: "100%"}}>
            <div className="flex flex-row mx-10">
                <a href="" className="text-3xl font-bold">Manu.ai</a>
            </div>
            <div className="flex flex-col h-full mt-10" style={{padding: "20px", width: "100%"}}>
                
                <div className="px-10">
                    <div className="flex flex-col gap-2">
                        <div className='flex flex-row'>
                        <input 
                            className="min-w-0 flex-auto mr-2 rounded-md border-0 bg-white/5 px-3.5 py-2 text-white font-medium shadow-sm ring-1 ring-inset ring-white/10 focus:ring-1 focus:ring-inset sm:text-sm sm:leading-6 "
                            name="question" id="question" placeholder="My dishwasher won't turn on" onChange={(e) => setQuestion(e.target.value)}>
                        </input>
                        <Button 
                            className="hover:bg-slate-700 active:scale-105 transition-transform duration-100"
                            onClick={handleOnClick}>SUBMIT
                        </Button>
                        {fix && <p style={{backgroundColor:'green'}}>{fix}</p>}
                        {fix && <img src={image}/>}
                        </div>
                        <div className="flex flex-row">
                            <input id="file" type="file" placeholder='Choose Image' className="w-fit hover:cursor-pointer" />
                            <div className="flex flex-grow"></div>
                        </div>
                    </div>
                </div>
                
                <div className="mx-10 px-10 mt-10">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                    <div style={{ height: '750px' }}>
                        <Viewer
                            onDocumentLoad={handleDocumentLoad}
                            fileUrl="EECS_280.pdf"
                            plugins={[
                                defaultLayoutPluginInstance,
                                highlightPluginInstance,
                                searchPluginInstance
                            ]}
                            initialPage={default_page}
                        />
                    </div>
                    </Worker>
                </div>
            </div>
            
        </div>
    )
}
