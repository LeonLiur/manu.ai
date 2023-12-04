"use client"

import { Button } from '@/components/ui/button';
import React, { useState } from 'react'

export default function () {
    const [question, setQuestion] = useState("")

    const [image, setImage] = useState(null)
    const [fix, setFix] = useState()

    const handleOnClick = async () => {
        if (!file.files[0]) {
            console.log("no file uploaded")
        } else {
            console.log(question)
            const formData = new FormData()
            formData.append("image", file.files[0])

            const query_return = await fetch(`${BACKEND_URL}/query?id=123&qstring=${question}`, {
                method: 'GET',
                body: formData,
            }).then(data => data.json())

            setFix(query_return["result"])
        }

    }


    return (
        <div>
            <input name="question" id="question" placeholder="My dishwasher won't turn on" color="black" onChange={(e) => setQuestion(e.target.value)}>
            </input>

            <input id="file" type="file" />
            <Button onClick={handleOnClick}>SUBMIT</Button>
            {fix && <p style="background-color: green">fix</p>}
        </div>
    )
}
