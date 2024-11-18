/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'

import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import abstractBackgroundImage from '@/images/resources/abstract-background.png'
import discordImage from '@/images/resources/discord.svg'
import figmaImage from '@/images/resources/figma.svg'
import executuonImage from '@/images/Execution.jpg'
import videoPlayerImage from '@/images/resources/video-player.svg'
import { CheckIcon } from './CheckIcon'

const resources = [
  {
    title: 'SEE the model',
    description:
      'Using visual and mnemonic representations of JS concepts, we change our perspective.',
    image: function FigmaImage() {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(#2C313D_35%,#000)]">
          <Image src={figmaImage} alt="" unoptimized />
        </div>
      )
    },
  },
  {
    title: 'BUILD sandcastles',
    description:
      'Quizes and exercises inside an interactive code editor help us investigate & play with the concepts.',
    image: function VideoPlayerImage() {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src={abstractBackgroundImage}
            alt=""
            sizes="(min-width: 1280px) 21rem, (min-width: 1024px) 33vw, (min-width: 768px) 19rem, (min-width: 640px) 50vw, 100vw"
          />
          <Image
            className="relative"
            src={videoPlayerImage}
            alt=""
            unoptimized
          />
        </div>
      )
    },
  },
  {
    title: 'PEG the knowledge',
    description:
      "We reflect on what we learn, and connect our new knowledge to what we already know.",
    image: function DiscordImage() {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-[#6366F1]">
          <Image src={discordImage} alt="" unoptimized />
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
      className="scroll-mt-14 pt-16 sm:scroll-mt-32 sm:py-20 lg:pt-16"
    >
      <Container>
        <SectionHeading number="1" id="resources-title">
          The Journey
        </SectionHeading>
        <p className="mt-8 font-display text-4xl font-bold tracking-tight text-slate-900 text-center">
          Imagine JavaScript is more than just a course. It's a system for learning. It takes you on a journey.
        </p>
        <p className="mt-4 text-lg tracking-tight text-slate-700">
        I often get asked by students to explain one of JavaScript’s more tricky concepts, like closures or prototypal inheritance. I reply by asking them to first explain something basic, like how objects can store other objects.
        </p>
        <p className="mt-4 text-lg tracking-tight text-slate-700">The reaction is almost always the same. “I know these basics, I want to learn more advanced stuff”.</p>
        <p className="mt-4 text-lg tracking-tight text-slate-700 font-bold">But do you know the basics? Do you really?</p>
        <p className="mt-4 text-lg tracking-tight text-slate-700">The turning point is the moment you begin to deconstruct JavaScript - to really understand each piece of the puzzle.</p>
        <p className="mt-4 text-lg tracking-tight text-slate-700"> This is what Imagine JavaScript is all about. We get to the "advanced stuff" by putting the pieces together.</p>
      
        <p className="mt-8 font-display text-center text-4xl font-bold tracking-tight text-slate-900">
         We use our imagination to to understand how JavaScript conecpts are connected. 
        </p>
        <p className="mt-4 text-lg tracking-tight text-slate-700"> We visualize each concept creatively, in a way that makes it memorable while also explaining its behaviour... We grow our mental model layer by layer.</p>
        <p className="mt-4 text-lg tracking-tight text-slate-700">It's a journey through JavaScript - exploring, visualizing and connecting as we go.</p>
        <p className="mt-4 text-lg tracking-tight text-slate-700">This journey is structured on the See, Build & Peg Learning System:</p>
      
      </Container>
      <Container size="lg" className="mt-16">
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
      <SectionHeading number="2" id="model" className='mt-28'>
          The Model
      </SectionHeading>
      <p className="mt-8 text-lg tracking-tight text-slate-700">Code is not two dimensional. It occupies space and time. It is a physical, moving force..</p>
        <p className="mt-4 text-lg tracking-tight text-slate-700">Using the power of our imagination, we can paint a vivid picture of what each line of code does. We can construct a beautiful, memorable representation of JavaScript, and refer to it whenever we write or read code.</p>
        <p className="mt-4 text-lg tracking-tight text-slate-700"> Take this model:</p>
          <Image 
            src={executuonImage}
            alt=""
            width={3000}
            height={2000}
            className="my-8"
            />
          <p className="mt-4 text-2xl font-bold tracking-tight text-center max-w-2xl mx-auto text-slate-700"> A model like this conveys EXACTLY how JavaScript behaves, everything from functions, to scope, to closures.</p>
      </Container>
    </section>
  )
}
