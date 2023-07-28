import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

export default function TheProblem() {
  return (
    <div className="relative isolate overflow-hidden bg-white py-12 sm:py-24 sm:py-32">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">It can be months, even YEARS of struggle</h2>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          I battled with JavaScript for a very, very long time.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          It was one of the most frustrating periods in my journey to becoming a senior developer. In the beginning, I was on a high after learning CSS. Finally I could see code transform a blank page into a beautiful design. 
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          The next step: learn the language that powers the web. With JavaScript skills I knew the possibilities were endless. I could build anything I wanted, and go on to find work in any tech company.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          There was just one problem…JavaScript was a pain in the ass. 
          </p>
          
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:mt-0 lg:max-w-none lg:grid-cols-12">
          <div className="relative lg:order-last lg:col-span-5">

            <figure className="border-l border-indigo-600 pl-8">
              <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                <p>
                  “Kylo does an amazing job breaking down complex JavaScript syntax so it is simple and easy to understand. The stories and illustrations really helped me.”
                </p>
              </blockquote>
              <figcaption className="mt-8 flex gap-x-4">
                <Image 
                    src="https://res.cloudinary.com/the-great-sync/image/upload/v1690482439/WfPilMx8_400x400_hezwoo.jpg"
                    alt=""
                    className="mt-1 h-28 w-28 flex-none rounded-full bg-gray-50"
                    width={400}
                    height={400}
                />

                <div className="text-sm leading-6">
                  <div className="font-semibold text-gray-900">Erica Lynn</div>
                  <div className="text-gray-600">Mom learning JavaScript </div>
                </div>
              </figcaption>
            </figure>
          </div>
          <div className="max-w-xl text-base leading-7 text-gray-700 lg:col-span-7">
            
            <p className="mt-6 text-xl leading-8 text-gray-700">
            I couldn’t do it. Tutorial after tutorial, code exercise after code exercise. I felt I knew the fundamental concepts. I just couldn’t apply them.
            </p>
            <p className="mt-6 text-xl leading-8 text-gray-700">
            Then it became even worse.
            </p>
            <p className="mt-6 text-xl leading-8 text-gray-700">
            I began to “pretend” I understood. As time went on, with the help of step-by-step tutorials, I cobbled together projects I could put in a portfolio. I even managed to start building in React! 
            </p>
            <p className="mt-6 text-xl leading-8 text-gray-700">
            Sadly, the brutal truth was I had NO idea what I was doing. 
            </p>
            <p className="mt-6 text-xl leading-8 text-gray-700">
            All the excitement of learning web development was soon replaced by day-to-day frustration and overwhelming imposter syndrome. In fact, I couldn’t even call it imposter “syndrome”. I was an imposter!
            </p>
            <p className="mt-6 text-xl leading-8 text-gray-700">
             As someone who did not study computer science, I wondered if I wasn’t cut out for this. What is a Journalism major doing writing code anyway? 
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
