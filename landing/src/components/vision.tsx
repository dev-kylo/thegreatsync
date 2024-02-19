import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

export default function Vision() {
  return (
    <div className="relative isolate overflow-hidden bg-white py-12 sm:py-24 sm:py-32 pb-18">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

                
        <div className="mx-auto mt-0 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-0 lg:mx-0 lg:mt-0 lg:max-w-none lg:grid-cols-12">
         
          <div className="relative lg:order-last lg:col-span-5 hidden lg:block">
          <figure className="border-l border-indigo-600 pl-8 mt-32">
              <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                <p>
                  “Kylo taught me some of the most critical concepts in JavaScript and my confidence just skyrocketed. I wasn&lsquo;t scared of the errors anymore; I could understand the errors better and debugging became fun!”
                </p>
              </blockquote>
              <figcaption className="mt-8 flex gap-x-4">
                <img
                  src="https://pbs.twimg.com/profile_images/1414929796174204930/u2mLN-Wd_400x400.jpg"
                  alt=""
                  className="mt-1 h-28 w-28 flex-none rounded-full bg-gray-50"
                />
                <div className="text-sm leading-6">
                  <div className="font-semibold text-gray-900">Karthik Raju</div>
                  <div className="text-gray-600">Frontend developer</div>
                </div>
              </figcaption>
            </figure>
            <figure className="border-l border-indigo-600 pl-8 mt-32">
              <blockquote className="text-xl font-semibold leading-8 tracking-tight text-gray-900">
                <p>
                  The Great Sync has given me a huge confidence boost in my ability to read, write and reflect on code. I now have a much clearer, bigger picture understanding. I highly recommend taking Kylo&lsquo;s course. Just don&lsquo;t rush through the content, it&lsquo;s worth it!
                </p>
              </blockquote>
              <figcaption className="mt-8 flex gap-x-4">
                <div className="text-sm leading-6">
                  <div className="font-semibold text-gray-900">Ethan Myers</div>
                </div>
              </figcaption>
            </figure>
          </div>
          <div className="max-w-xl text-base leading-7 text-gray-700 lg:col-span-7">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What if it wasn&lsquo;t like this?</h2>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          Let&lsquo;s imagine what being a professional JavaScript developer CAN and SHOULD look like.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          You arrive at the office at 9am. You look forward to seeing your colleagues - all experts in their fields, from designers to dev ops. 
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          You&lsquo;re a specialist too, and play an important role in the team.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          You sit at your desk, and begin planning the day&lsquo;s work. You&lsquo;re quite new in the job, but already they need you to urgently fix a bug in the application.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          This is the first time you&lsquo;re seeing the code. There&lsquo;s a lot of it!  You smile and remember a time this would cause panic and stress.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          Now, it&lsquo;s just a challenge - a satisfying exercise to fix something with the knowledge you have. It&lsquo;s only plain JavaScript. The patterns are all the same 
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          It&lsquo;s the same patterns you used to learn the latest framework quickly.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          And the same patterns you used the night before in your side project - a vanilla JS app you can&lsquo;t wait to get back to.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          Only a deep appreciation and understanding of the fundamentals give you the power to recognize these patterns. 
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
           It&lsquo;s what sets you apart.
          </p>
          </div>
        </div>
      </div>
    </div>
  )
}
