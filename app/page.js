'use client';

import React, { useState } from 'react';

export default function Home(){
  const [inputValue, setInputValue] = useState("");

  return(
    <>
      <header className = "flex justify-between items-center mb-4">
        <h1 className="text-2xl">Manu.AI</h1>
        <button className="border border-slate-300 text-slate-300 px-2 py-1 rounded
        hover:bg-slate-700 focus-within:bg-slate-700 outline-none"
        >
          Test
        </button>
      </header>
      <div className = "p-4">
        {inputBox(inputValue, setInputValue)}
      </div>
    </>
  );
};

function inputBox({inputValue, setInputValue}){
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  return(
    <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="border rounded p-2 placeholder-blue-500::placeholder text-slate-900"
          placeholder= "Enter text..."
    />
  )
};