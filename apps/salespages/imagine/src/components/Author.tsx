/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'

import { GridPattern } from '@/components/GridPattern'
import { SectionHeading } from '@/components/SectionHeading'
import authorImage from '@/images/kylo.jpg'

function XIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8132L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
    </svg>
  )
}

export function Author() {
  return (
    <section
      id="author"
      aria-labelledby="author-title"
      className="relative scroll-mt-14 pb-3 pt-8 sm:scroll-mt-32 sm:pb-16 sm:pt-0 "
    >
      <div className="absolute inset-x-0 bottom-0 top-1/2 text-slate-900/10 [mask-image:linear-gradient(transparent,white)]">
        <GridPattern x="50%" y="100%" />
      </div>
      <div className="relative mx-auto max-w-5xl pt-16 sm:px-6">
        <div className="bg-slate-50 pt-px sm:rounded-6xl">
          <div className="relative mx-auto -mt-16 h-44 w-44 overflow-hidden rounded-full bg-slate-200 md:float-right md:h-64 md:w-64 md:[shape-outside:circle(40%)] lg:mr-20 lg:h-72 lg:w-72">
            <Image
              className="absolute inset-0 h-full w-full object-cover"
              src={authorImage}
              alt=""
              sizes="(min-width: 1024px) 18rem, (min-width: 768px) 16rem, 11rem"
            />
          </div>
          <div className="px-4 py-10 sm:px-10 sm:py-16 md:py-20 lg:px-20">
            <SectionHeading id="author-title">
              Senior JavaScript Developer
            </SectionHeading>
            <p className="mt-8 font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              <span className="block mb-4 sm:mb-6 text-blue-600 text-3xl sm:text-5xl lg:text-6xl">Hi, I'm Kylo</span>
              <span className="text-xl sm:text-3xl lg:text-4xl">I don't have a background in computer science. I studied media... But it turns out a different way of thinking is my greatest asset.</span>
            </p>
            <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700 leading-relaxed">
           My journey began by learning on the
             side of a day-job and giving every spare hour to coding. 
             I went on to build a career I love. It has allowed me to work in 3 different countries, and develop many applications I'm proud of.
            </p>
            <p className="mt-3 text-base sm:text-lg tracking-tight text-slate-700 leading-relaxed">
             I also have the privilege of helping others, and over the years I have mentored and coached dozens of students into professional developers.
            </p>
            <p className="mt-6 sm:mt-8 mx-auto max-w-2xl text-center text-lg sm:text-xl font-bold tracking-tight text-slate-700">
              I created a <span className='text-blue-600'>visual learning system</span> which transforms your experience with JavaScript.
            </p>
            <p className="mt-3 sm:mt-4 mx-auto max-w-2xl text-center text-lg sm:text-xl font-bold tracking-tight text-slate-700">
              It's a universe called <span className='text-blue-600'>The Great Sync.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
