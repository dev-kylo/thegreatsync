/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'

import { Button } from '@/components/Button'
import { GridPattern } from '@/components/GridPattern'
import { StarRating } from '@/components/StarRating'
import coverImage from '@/images/model2.png'

function Testimonial() {
  return (
    <figure className="relative mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
      <div className="flex justify-center text-blue-600 lg:justify-start">
        <StarRating />
        {/* <em>Karthik </em> */}
      </div>
      <div>
      <blockquote className="mt-2">
        <p className="font-display text-xl font-medium text-slate-900">

        “I wasn‘t scared of errors anymore. Debugging became fun!”
        </p>
      </blockquote>
      <figcaption className="mt-2 text-sm text-slate-500">
        <strong className="font-semibold text-blue-600 before:content-['—_']">
          Karthik Raju
        </strong>
        , Frontend Developer
      </figcaption>
      </div>
    </figure>
  )
}

export function Hero() {
  return (
    <header className="overflow-hidden bg-slate-100 lg:bg-transparent lg:px-5">
      <div className="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-12 lg:px-3 lg:pb-36 lg:pt-10 xl:py-22">
        <div className="relative flex items-end lg:col-span-5 lg:row-span-2">
          <div className="absolute -bottom-12 -top-20 left-0 right-1/2 z-10 rounded-br-6xl bg-blue-600 text-white/10 md:bottom-8 lg:-inset-y-32 lg:left-[-100vw] lg:right-full lg:-mr-40">
            <GridPattern
              x="100%"
              y="100%"
              patternTransform="translate(112 64)"
            />
          </div>
          <div className="relative z-10 mx-auto flex w-64 rounded-xl  shadow-xl md:w-80 lg:w-auto">
            <Image className="w-full" src={coverImage} alt="" priority />
          </div>
        </div>
        <div className="hidden md:block relative px-4 sm:px-6 lg:col-span-7 lg:pb-14 lg:pl-16 lg:pr-0 xl:pl-20">
          <div className="hidden lg:absolute lg:-top-32 lg:bottom-0 lg:left-[-100vw] lg:right-[-100vw] lg:block lg:bg-slate-100" />
          <div className="hidden 2xl:block"><Testimonial /></div>
        </div>
        <div className="bg-white pt-16 lg:col-span-7 lg:bg-transparent lg:pl-16 lg:pt-0 xl:pl-20">
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
            <h1 className="font-display text-6xl font-extrabold text-slate-900 sm:text-8xl">
              <span className="text-blue-600"> Imagine</span> JavaScript
            </h1>
            <p className="mt-2 text-3xl text-slate-600"> ~ Master the Fundamentals</p>
             <p className="mt-6 text-slate-600">Perhaps you're ...</p>
              <ul className="mt-4 list-disc list-inside text-slate-600">
                <li>blindly <span className="font-bold">copy-pasting</span> from Chat GPT</li>
                <li><span className="font-bold">re-learning</span> concepts over and over again</li>
                <li>getting <span className="font-bold">overwhelmed</span> when reading code or documentation</li>
              </ul>
            <p className="mt-2  text-slate-600">
              Instead, create an <span className="relative">
                <span className="relative z-10 text-xl">unforgettable</span>
                <span className="absolute bottom-0 left-0 right-0 h-6 bg-yellow-200/50 -rotate-2" aria-hidden="true"></span>
              </span>, long-lasting <span className="text-blue-600 font-bold text-xl relative">
                <span className="relative z-10">visual mental model </span>
                <span className="absolute bottom-0 left-0 right-0 h-6 bg-blue-200/50 rotate-5" aria-hidden="true"></span>
              </span>
              <span className="block">of how JavaScript works.</span>
            </p>
            <p className="mt-2  text-slate-600"> And gain <span className="font-bold text-blue-600">complete confidence</span> in your fundamentals.</p>
            <div className="mt-8 flex justify-start gap-4">

              <Button href="#pricing-title" color="blue">
                I'm ready NOW
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
