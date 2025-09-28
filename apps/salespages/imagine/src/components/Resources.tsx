/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'

import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import executuonImage from '@/images/Execution.jpg'
import see from '@/images/see.png'
import build from '@/images/build.png'
import peg from '@/images/peg.png'
import { HighlightedText } from './HighlightedText'
import review from '@/images/review.png'

const resources = [
  {
    title: 'SEE the model',
    description:
      'Change your perspective with mnemonic representations',
    image: function FigmaImage() {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(#2C313D_35%,#000)]">
          <Image src={see} alt="" unoptimized />
        </div>
      )
    },
  },
  {
    title: 'BUILD sandcastles',
    description:
      'Investigate & play with the concepts in an interactive code editor.',
      image: function DiscordImage() {
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-[#00676a]">
            <Image src={build} alt="" unoptimized />
          </div>
        )
      },
  },
  {
    title: 'PEG the knowledge',
    description:
      "Connect your new knowledge to what you already know.",
    image: function DiscordImage() {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-[#6366F1]">
          <Image src={peg} alt="" unoptimized />
        </div>
      )
    },
  },
]

export function Resources() {
  return (
    <section
      id="journey"
      aria-labelledby="resources-title"
      className="scroll-mt-14 pt-16 sm:scroll-mt-32 sm:py-16 lg:pt-16"
    >
      <Container>
        <SectionHeading number="1" id="resources-title">
          Understand code on a deeper level
        </SectionHeading>
        <p className="mt-8 font-display text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 text-center">
          A visual learning experience that actually works.
        </p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">
          In the beginning, my non-tech background meant I really did not yet think like a programmer. <HighlightedText color="yellow">I needed a bridge </HighlightedText>, to help me step into the tech world.
        </p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">
        But most of the learning resources out there were not helping me.
        </p>
        <ul role="list" className="mt-4 space-y-3">
          {[
            'Explanations were loads of dry text',
            'Videos were screen recorded code editors',
            'Pictures were screenshots of code editors',
          ].map((feature) => (
            <li key={feature} className="flex text-base sm:text-lg tracking-tight text-slate-700">
              <span className="text-base">☠️</span>
              <span className="ml-3 sm:ml-4">{feature}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">
        And when I searched for "visual" resources, all I could find were things like this:
        </p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">
          <code>ar.push(🍎)</code> becomes  <code>[🍏,🍏,🍎]</code>
        </p> 
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">Honestly, I could only take so many fruit and cute dog emojis!</p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700 font-bold">But there was a bigger problem... </p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">It wasn't just that the visuals were boring. It was that they focused on what the code DID, rather than <HighlightedText color="blue">how it works. </HighlightedText></p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">In an age of AI generated code, understanding the underlying patterns are more important that EVER.</p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">This is why the course focuses on <HighlightedText>deconstructing and visualizing JavaScript</HighlightedText> - to really understand each piece of the puzzle.</p>
       
      
        <p className="mt-6 font-display text-center text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
         We use our imagination to to understand how JavaScript concepts are connected. 
        </p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700"> We picture each concept creatively, in a way that makes it memorable while also explaining its behaviour  .</p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">It's a journey through JavaScript - <HighlightedText color="blue">exploring, visualizing and connecting </HighlightedText> as we go.</p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">And the best part? You will never look at code the same way again... </p>
        <div className="my-4 flex justify-center">
          <Image src={review} alt="Code" width={400} height={400} />
        </div>
      
      </Container>
      
      
      {/* Desktop version - Keep original */}
      <Container size="lg" className="mt-16 hidden lg:block">
        <ol
          role="list"
          className="-mx-3 grid grid-cols-1 gap-y-10 lg:grid-cols-3 lg:text-center xl:-mx-12 xl:divide-x xl:divide-slate-400/20"
        >
          {resources.map((resource) => (
            <li
              key={resource.title}
              className="grid auto-rows-min grid-cols-1 items-center gap-8 px-3 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-1 xl:px-12"
            >
              <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg sm:h-60 lg:h-40">
                <resource.image />
              </div>
              <div>
                <h3 className="text-base font-medium tracking-tight text-slate-900">
                  {resource.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {resource.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
      <Container>
      <SectionHeading number="2" id="model" className='mt-16 md:mt-28'>
          The Great Sync Model
      </SectionHeading>
      <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">This Great Sync Mental Model is based on the <span className="text-blue-600 font-bold"> See, Build & Peg Learning System</span>.</p>
           {/* Mobile version - Compact horizontal cards */}
           <Container className="mt-8 lg:hidden">
        <div className="space-y-3">
          {resources.map((resource, index) => (
            <div
              key={resource.title}
              className="flex items-center gap-4 bg-slate-50 rounded-xl p-4"
            >
              {/* Small icon-sized image */}
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg shadow-sm">
                <resource.image />
              </div>
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-900">
                  {index + 1}. {resource.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {resource.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
     
      <p className="mt-8 text-base sm:text-lg tracking-tight text-slate-700">Code is not two dimensional. It occupies space and time. It is a physical, moving force..</p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700">Using the power of our imagination, we can paint a vivid picture of what each line of code does. We can construct a beautiful, <HighlightedText color="yellow">memorable representation of JavaScript</HighlightedText>, and refer to it whenever we write or read code.</p>
        <p className="mt-4 text-base sm:text-lg tracking-tight text-slate-700"> Take this scene from <span className="text-blue-600 font-bold">The Great Sync Mental Model:</span></p>
          <Image 
            src={executuonImage}
            alt=""
            width={3000}
            height={2000}
            className="my-8"
            />
          <p className="mt-4 mb-8 text-md md:text-2xl tracking-tight text-center max-w-2xl mx-auto text-slate-700"> A model like this conveys <HighlightedText color="blue">EXACTLY how JavaScript behaves </HighlightedText>, everything from functions, to scope, to closures.</p>
      </Container>
    </section>
  )
}
