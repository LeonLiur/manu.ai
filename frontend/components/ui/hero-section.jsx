import React from "react";
import Image from 'next/image'

const HeroSection = () => {
  return (
    <>
      <div className="flex justify-center ">
        <div className="flex flex-col justify-center">

          <div className="flex flex-col max-w-7xl justify-center items-center p-2 mt-10">
            <div className="flex flex-col w-[90%] md:w-3/4 text-center items-center justify-center space-y-3">
              <div className="text-5xl font-bold ">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-pink-700 my-5 drop-shadow-lg shadow-indigo-800 ">Superpowering </span>
                <br></br>
                <span className="">User Manuals</span>
              </div>
              <div className="text-xl font-semibold text-gray-400 ">
                Turn your user manual into a digital interactive knowledgebase
              </div>
              <div className="md:text-lg">
                <Link href='/upload_pdf'>
                  <button
                    href="upload_pdf" className="p-1 m-2 rounded-md text-white bg-indigo-500 border-2 border-indigo-500 px-4 font-semibold hover:border-indigo-900  hover:bg-indigo-900 hover:trandform ease-in-out duration-300">
                    Upload Yours </button>
                </Link>
                <button
                  className="p-1 m-2 rounded-md text-indigo-500 bg-transparent border-2 border-indigo-500 px-4 font-semibold hover:text-white hover:bg-indigo-500 hover:trandform ease-in-out duration-300">
                  Try a Demo </button>
              </div>
            </div>
            <div className="w-3/4 h-40 md:h-64 mt-10 rounded-lg overflow-hidden">
              <Image src={LandingPageImage} priority={true} alt="Manu AI workflow" className="h-full w-full" />
            </div>
          </div>

        </div>
      </div>

      <Tailwindcss />
      <Fontawesome />
    </>
  )
}

export default HeroSection