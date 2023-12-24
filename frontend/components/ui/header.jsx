import React from "react";
import Link from 'next/link'

const Header = () => {
    return (
        <div>
            <div className="flex justify-center">
                <nav className="self-center w-full max-w-10xl">
                    <div className="flex flex-col lg:flex-row justify-around items-center ">
                        <Link href="/">
                            <h1 className="uppercase pl-5 py-4 text-lg font-sans font-bold">MANU.AI</h1>
                        </Link>
                        <ul className="hidden lg:flex items-center text-[18px] font-semibold pl-32">
                        <li className="px-10">
                                <Link href="/" className="hover:underline underline-offset-4 decoration-2 decoration-black py-2 rounded-lg">Find Your Manual</Link>
                            </li>
                            <li className="px-10">
                                <Link href="/upload_pdf" className="hover:underline underline-offset-4 decoration-2 decoration-black py-2 rounded-lg">Add Your Manual</Link>
                            </li>
                            <li className="px-10">
                                <Link href="/contact" className="hover:underline underline-offset-4 decoration-2 decoration-black py-2 rounded-lg">Contact</Link>
                            </li>
                        </ul>
                        <div className="text-center text-base pr-5 inline-flex">
                            <a href="#" className="w-8 h-8 inline-block rounded-full pt-[6px] hover:text-blue-500">
                                <i className="fa fa-twitter"></i>
                            </a>
                            <a href="#" className="w-8 h-8 inline-block rounded-full pt-[5px] hover:text-blue-500">
                                <i className="fa fa-instagram"></i>
                            </a>
                            <a href="#" className="w-8 h-8 inline-block rounded-full pt-[5px] hover:text-blue-500">
                                <i className="fa fa-facebook"></i>
                            </a>
                            <a href="#" className="w-8 h-8 inline-block rounded-full pt-[5px] hover:text-blue-500">
                                <i className="fa fa-google"></i>
                            </a>
                            <a href="#" className="w-8 h-8 inline-block rounded-full pt-[5px] hover:text-blue-500">
                                <i className="fa fa-linkedin"></i>
                            </a>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Header;