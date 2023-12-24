import Link from 'next/link';
import Image from 'next/image'
import LandingPageImage from '../public/LandingPageImage.png'

const Home = () => {
  return (
    <>
      {/* Hero section */}
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
            <div className="w-3/4 h-40 md:h-64 mt-10 rounded-lg overflow-hidden relative">
              <Image src={LandingPageImage} priority={true} alt="Manu AI workflow" fill={true} />
            </div>
          </div>

        </div>
      </div>
      {/* Main body */}
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
            <h1 className="sm:text-3xl text-2xl font-semibold title-font mb-2 text-gray-900">Quick. Easy. Seamless.</h1>
            <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">Instantly power up your manual</p>
          </div>
          <div className="flex flex-wrap -m-4">
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-200 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">Image Search</h2>
                <p className="leading-relaxed text-base">Troubleshoot with an image and get an answer that incorporates the manual and the image.</p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-200 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                    <circle cx="6" cy="6" r="3"></circle>
                    <circle cx="6" cy="18" r="3"></circle>
                    <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">GPT-4 Answers</h2>
                <p className="leading-relaxed text-base">Smart, accurate, and limited to the manual contents to prevent hallucinations.</p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-200 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">QR Code</h2>
                <p className="leading-relaxed text-base">QR Code and unique link generated for each product for easy distribution.</p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-200 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">Interactive PDF</h2>
                <p className="leading-relaxed text-base">Don&apos;t worry, your manuals still there, just digital and searchable now.</p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-200 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">All-language Support</h2>
                <p className="leading-relaxed text-base">Our AI easily translates your manual into any language, so anyone can get answers.</p>
              </div>
            </div>
            <div className="xl:w-1/3 md:w-1/2 p-4">
              <div className="border border-gray-200 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-indigo-100 text-indigo-500 mb-4">
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">One and Done</h2>
                <p className="leading-relaxed text-base">Upload your manual once, and it&apos;s superpowered forever.</p>
              </div>
            </div>
          </div>
          <Link href="/upload_pdf">
            <button
              className="flex mx-auto mt-16 py-2 px-6 rounded-md text-white bg-indigo-500 border-2 border-indigo-500 font-semibold hover:border-indigo-900  hover:bg-indigo-900 hover:trandform ease-in-out duration-300">
              Upload Yours </button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
