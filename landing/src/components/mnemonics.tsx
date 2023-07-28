import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'
import Image from 'next/image'

export default function Mnemonics() {
  return (
    <div className="relative isolate  bg-white py-8 sm:py-8 pt-12 pb-18">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">

                
        <div className="mx-auto mt-0 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-0 lg:mx-0 lg:mt-0 lg:max-w-none lg:grid-cols-12">
         

          <div className="max-w-xl text-base leading-7 text-gray-700 lg:col-span-7">
          <h2 className="mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">The Syncer Program</h2>
          <span className='pt-8 font-bold'>Level Up With Visual & Memorable JavaScript</span>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          I often get asked by students to explain one of JavaScript’s more tricky concepts, like closures or prototypal inheritance. I reply by asking them to first explain something basic, like how objects can store other objects.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          The reaction is almost always the same. “I know these basics, I want to learn more advanced stuff”.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          But do you know the basics, Gerald? Do you?
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          The turning point in your learning journey is the moment you begin to deconstruct JavaScript - to really understand each piece of the puzzle. 
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          That’s how you can piece it all back together again.  That’s how you start to see patterns.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          The problem is, how do you remember each piece? 
          </p>
          <h3 className="mt-8 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">The Great Sync Learning Method</h3>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          The key is to look at each concept with a different perspective. Code is not two dimensional. It occupies space and time. It is a physical, moving force. 
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          Using the power of our imagination, we can paint a vivid picture of what each line of code does. We can construct a beautiful, memorable representation of JavaScript, and refer to it whenever we write or read code.
          </p>
          <p className="mt-6 text-xl leading-8 text-gray-700">
          They’re not simply analogies. They are mental models. Each conveys the relationship between concepts, linking them together and explaining how everything fits.
          </p>
          {/* <p className="mt-6 text-xl leading-8 text-gray-700">
           Memory is the foundation of knowledge and skill, and we draw on mnemonic memory techniques principles to make what we’re learning easier to remember.
          </p> */}
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
