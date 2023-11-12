"use client"

// pages/index.js
import InputBox from "../components/ui/InputBox";
import ButtonIcon from "@/components/ui/ButtonIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Home = () => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleEnterPress = () => {
    console.log("Enter pressed! Do something special.");
  };

  return (
      <div className="mx-auto pt-20 py-6 items-center justify-center" style={{width: "100%", height: "100%"}}>
        <div className="flex flex-col justify-center items-center h-full" style={{padding: "20px", width: "100%"}}>
            <div className="w-1/3 p-4" style={{padding: "25px"}}>
              <h1 className="text-5xl bg-gradient-to-bl text-center font-bold leading-5">
                Ask 
                <span className="text-blue-300"> Away </span>
              </h1>
            </div>
            <div className="w-2/3 p-4 flex">
              <InputBox
                  placeholder="Type something..."
                  onChange={handleInputChange}
                  onSubmit={handleEnterPress}
                  value={inputValue}
                />
                <ButtonIcon />
            </div>
        </div>
      </div>
  );
};

export default Home;
