import Image from 'next/image'

import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import duotoneImage from '@/images/screencasts/duotone.svg'

import one from '@/images/1.png'
// import two from '@/images/two.jpg'

const videos = [
  {
    title: 'Imagine the engine & environment',
    description:
      'Get familiar with the Figma UI, the different tools it offers, and the most important features.',
    image: one,
    runtime: { minutes: 16, seconds: 54 },
  },
  {
    title: 'Imagine flow & operations',
    image: one,
  },
  {
    title: 'Imagine loops',
    image: one,
  },
  {
    title: 'Imagine flow & operations',
    image: one,
  },
  {
    title: 'Imagine loops',
    image: one,
  },
  {
    title: 'Imagine flow & operations',
    image: one,
  },
  {
    title: 'Imagine loops',
    image: one,
  },
  {
    title: 'Imagine flow & operations',
    image: one,
  },
  {
    title: 'Imagine loops',
    image: one,
  },
  {
    title: 'Imagine flow & operations',
    image: one,
  },
  {
    title: 'Imagine loops',
    image: one,
  },


]


export function Screencasts() {
  return (
    <section
      id="fundamentals"
      aria-labelledby="screencasts-title"
      className="scroll-mt-14 py-16 sm:scroll-mt-32 sm:py-20 lg:py-32"
    >
      <Container>
        <SectionHeading number="3" id="screencasts-title">
          The Fundamentals
        </SectionHeading>
        <p className="mt-8 font-display text-4xl font-bold tracking-tight text-slate-900">
          The following are the course sections:
        </p>
      </Container>
      <Container size="lg" className="mt-16">
        <ol
          role="list"
          className="grid grid-cols-1 gap-x-8 gap-y-10 [counter-reset:video] sm:grid-cols-2 lg:grid-cols-4"
        >
          {videos.map((video) => (
            <li key={video.title} className="[counter-increment:video]">
              <div
                className="relative flex h-32 items-center justify-center rounded-2xl px-6 shadow-lg"
                style={{
                  backgroundImage:
                    'linear-gradient(38.92deg, rgb(3, 20, 63) 10.77%, rgb(0, 133, 121) 115.98%)',
                }}
              >
                <div className="flex overflow-hidden rounded shadow-sm">
                  <Image src={video.image} alt="" unoptimized />
                </div>
                
              </div>
              <h3 className="mt-4 text-base font-medium tracking-tight text-slate-900 before:mb-0 before:inline before:mr-2 before:font-mono before:text-sm before:text-slate-500 before:content-[counter(video,decimal-leading-zero)]">
                <span className="mt-0">{video.title}</span>
              </h3>
 
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
