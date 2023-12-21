"use client"
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Custom404() {
    return<main className = "flex overflow-hidden h-screen w-screen">
      <div className = 'flex justify-center items-center w-[700px]'>
        <h1 className='text-5xl font-bold dark:text-white'>404 - Page Not Found</h1>
        <p className='text-md font-medium dark:text-white'>Even our semantic search couldn't find this page. Are you sure the website URL is correct? Get back in touch with the site owner</p>
        <Button onClick={() => redirect('/')}>Go Back Home</Button>
      </div>
    </main>
  }