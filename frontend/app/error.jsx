// Error.getInitialProps = ({ res, err }) => {
//   const statusCode = res ? res.statusCode : err ? err.statusCode : 404
//   return { statusCode }
// }

"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link"

export default function Error({ error, reset }) {
  const statusCode = error.statusCode || 500;
  let message;
  switch (statusCode) {
    case 404:
      message = "This product does not exist (yet). Are you sure the website URL is correct? Get back in touch with the site owner.";
      break;
    case 500:
      message = "A server-side error occurred. Please try again later.";
      break;
    default:
      message = "Something went wrong!";
      break;
  }
  return (
    <main className="flex overflow-hidden h-screen w-screen justify-center">
      <div className='flex flex-col justify-center items-center w-[500px]'>
        <h1 className='text-5xl font-bold dark:text-white'>{statusCode}</h1>
        <p className='text-md text-center my-10 dark:text-white'>{message}</p>
        <Button variant='outline'>
          <Link href='/'>Go Back Home</Link>
        </Button>
      </div>
    </main>
  )
}

