import React from "react";
const Header = () => {
    return (
        <div>
            <div className="flex justify-center  ">
                                            <nav className="self-center w-full max-w-7xl  ">
                                                <div className="flex flex-col lg:flex-row justify-around items-center ">
                                                    <h1 className="uppercase pl-5 py-4 text-lg font-sans font-bold">MANU.AI</h1>
                                                    <ul className="hidden lg:flex items-center text-[18px] font-semibold pl-32">
                                                        <li className="hover:underline  underline-offset-4 decoration-2 decoration-white py-2 rounded-lg px-5">
                                                            <a href="#">Find Your Manual</a></li>
                                                        <li className="hover:underline underline-offset-4 decoration-2 decoration-white py-2 rounded-lg px-5"><a
                                                                href="#">Add Your Manual</a></li>
                                                        <li className="hover:underline underline-offset-4 decoration-2 decoration-white py-2 rounded-lg px-5"><a
                                                                href="#">Contact</a></li>
                                                    </ul>
                                                    <div className=" text-center text-base pr-5  inline-flex"> <a href="#"
                                                            className="w-8 h-8 inline-block rounded-full pt-[6px] hover:text-blue-500"><i
                                                                className="fa fa-twitter"></i></a> <a href="#"
                                                            className="w-8 h-8 inline-block rounded-full pt-[5px] hover:text-blue-500"><i
                                                                className="fa fa-instagram"></i></a> <a href="#"
                                                            className="w-8 h-8 inline-block rounded-full pt-[5px] hover:text-blue-500"><i
                                                                className="fa fa-facebook"></i></a> <a href="#"
                                                            className="w-8 h-8 inline-block rounded-full pt-[5px] hover:text-blue-500"><i
                                                                className="fa fa-google"></i></a> <a href="#"
                                                            className="w-8 h-8 inline-block rounded-full pt-[5px] hover:text-blue-500"><i
                                                                className="fa fa-linkedin"></i></a> </div>
                                                </div>
                                            </nav>
                                        </div>
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
                                                                <button
                                                                className="p-1 m-2 rounded-md text-white bg-indigo-500 border-2 border-indigo-500 px-4 font-semibold hover:border-indigo-900  hover:bg-indigo-900 hover:trandform ease-in-out duration-300">
                                                                Upload Yours </button> 
                                                                <button
                                                                className="p-1 m-2 rounded-md text-indigo-500 bg-transparent border-2 border-indigo-500 px-4 font-semibold hover:text-white hover:bg-indigo-500 hover:trandform ease-in-out duration-300">
                                                                Try a Demo </button> 
                                                            </div>
                                                    </div>
                                                    <div className="w-3/4 h-40 md:h-64 mt-10 rounded-lg overflow-hidden">
                                                        <img src="LandingPageImage.png" alt="Manu AI workflow" className="h-full w-full" / >
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <script src="https://cdn.tailwindcss.com"></script>
                                        <script src="https://use.fontawesome.com/03f8a0ebd4.js"></script>
                                    
                                    
        </div>
    );
};


export default Header;