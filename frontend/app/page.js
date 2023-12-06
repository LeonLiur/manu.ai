"use client"

// pages/index.js
import InputBox from "../components/ui/InputBox";
import ButtonIcon from "@/components/ui/ButtonIcon";
import SearchableDropdown from "@/components/ui/SeachableDropdown";
import { Button } from "@/components/ui/button";
//import ChatBot from "@/components/ui/chatBot";
import { StatDownArrow } from "@chakra-ui/react";
import { ArrowDownNarrowWideIcon, ArrowDownRightSquare } from "lucide-react";
import { useState } from "react";

const Home = () => {
  return (
    <>
      <div className="mx-auto py-6 items-center justify-center" style={{width: "100%", height: "100%"}}>
        <div className="flex flex-row mx-10">
          <a href="" className="text-3xl font-bold">Manu.ai</a>
        </div>
        <div className="absolute flex w-full justify-center justify-items-center my-10">
          <div className="flex flex-grow"></div>
          <a href="" className="text-sm flex w-fit bg-slate-700 border-slate-400 border-2 pr-3 pl-2 rounded-full items-center hover:bg-slate-500 hover:border-b-slate-400">
            <StatDownArrow className="h-4 w-4 mr-3" />
            Whirlpool Dishwasher
          </a>
          <div className="flex flex-grow"></div>
        </div>
        <div className="flex flex-col h-full mt-20" style={{padding: "20px", width: "100%"}}>
            {/* <ChatBot  /> */}
            {/* <div className="p-4" style={{padding: "25px"}}>
              <h1 className="text-5xl bg-gradient-to-bl text-center font-bold leading-5">
                Ask 
                <span className="text-blue-300"> Away </span>
              </h1>
            </div>
            <div className="w-2/3 p-4 flex">
              <ChatBot />
              {/* <InputBox
                  placeholder="Type something..."
              /> */}
            {/* </div> */} 
        </div>
      </div>
    </>
  );
};

export default Home;
