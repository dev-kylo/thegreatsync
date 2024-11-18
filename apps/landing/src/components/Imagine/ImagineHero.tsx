import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

export default function ImagineHero() {
  return (
    <div className="relative bg-white">
      <div className="mx-auto max-w-4xl lg:flex lg:justify-between lg:px-8 xl:justify-end xl:m-auto">
        <div className="flex lg:w-1/2 lg:shrink lg:grow-0 xl:absolute xl:inset-y-0 xl:right-1/2 w-full">
          <div className=" lg:-ml-8 lg:h-auto xl:ml-0 w-full">
            <div className="relative w-full h-auto ">
              <Image
                className="object-cover xl:min-h-screen h-full w-auto"
                src="https://res.cloudinary.com/the-great-sync/image/upload/v1689915037/Illustration_transparentbackground_HD_h3ednp.png"
                alt=""
                
                width="1920"
                height="1080"
      
              />
            </div>
          </div>
        </div>
        <div className="px-6 lg:contents">
          <div className="mx-auto  pb-24  sm:pb-32  ">
          <article className="prose lg:prose-2xl mt-8 text-center">
   
            <p className="text-2xl font-semibold leading-8 tracking-tight text-primary_blue">Introducing...</p>
            <div className='flex flex-col items-center justify-center mb-10'>
                <span className='text-7xl font-bold tracking-tight '>Imagine JavaScript</span>
                <span className='mt-4 font-bold'>Master the fundamentals</span>
            </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  )
}
