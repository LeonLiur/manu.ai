"use client"
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Page({ params }) {
    return<main className = "flex overflow-hidden h-screen w-screen justify-center">
        <div className = 'flex flex-col justify-center items-center w-[500px]'>
            <h1 className='text-5xl font-bold dark:text-white'>404</h1>
            <p className='text-md text-center my-10 dark:text-white'>This product does not exist (yet). Are you sure the website URL is correct? Get back in touch with the site owner</p>
            <Button variant='outline' href='/'>Go Back Home</Button>
        </div>
  </main>
}



