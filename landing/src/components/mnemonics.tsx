import Image from 'next/image'

export default function Mnemonics() {
  return (
    <div className="relative isolate  bg-white py-8 sm:py-8 pt-12 pb-18">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

                
        <div className="mx-auto mt-0 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-0 lg:mx-0 lg:mt-0 lg:max-w-none lg:grid-cols-12">
         

          <div className="max-w-xl text-base leading-7 text-gray-700 lg:col-span-7">
          <h2 className="mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">The Syncer Program</h2>
          <span className='block mt-4  font-bold'>Level Up With Visual & Memorable JavaScript</span>
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">The course includes:</h2>
          <h3 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">40+ videos</h3>
          <p className="mt-6 text-xl leading-8 text-gray-700">
           There are videos in every section, each between 5 and 10 minutes long.
          </p>
          <h3 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">80+ written pages</h3>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          Along with video comes a lot of written content. Reading technical text is an important skill. Except this time, yo&lsquo;re simultaneously using your imagination.
          </p>
          <h3 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">35+ illustrations</h3>
          <p className="mt-6 text-xl leading-8 text-gray-700">
            These illustrations are the backbone of the course, and are used throughout to explain and link concepts. They are the layers of JavaScript we will piece together.
          </p>
          <h3 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">The Syncer Discord Community</h3>
          <p className="mt-6 text-xl leading-8 text-gray-700">
            You will gain access to a private community on Discord where you can interact with fellow learners, post your exercise solutions and grow your craft together!
          </p>
   
          </div>
          <div className="relative lg:order-last lg:col-span-5 ">
          <div className="relative w-full h-auto pt-8">
              <Image
                className=" h-full w-full"
                src="https://res.cloudinary.com/the-great-sync/image/upload/v1686600125/2000x2000/The_Invoker_wlel6j.png"
                alt=""
                width="2000"
                height="2000"
      
              />
            </div>
   
          </div>
        </div>
      </div>
    </div>
  )
}
