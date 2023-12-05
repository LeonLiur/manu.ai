"use client"

import { Button } from '@/components/ui/button';
import React, { useState } from 'react'

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


    return (
        <div>
            <input name="question" id="question" placeholder="My dishwasher won't turn on" style ={{color: 'black'}} onChange={(e) => setQuestion(e.target.value)}>
            </input>

            <input id="file" type="file" />
            <Button onClick={handleOnClick}>SUBMIT</Button>
            {fix && <p style={{backgroundColor:'green'}}>{fix}</p>}
            {fix && <img src={image}/>}
        </div>
    )
}
