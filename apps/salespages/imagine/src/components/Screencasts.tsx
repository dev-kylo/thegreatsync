/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import { Container } from '@/components/Container'
import { SectionHeading } from '@/components/SectionHeading'
import two from '@/images/screenshots/2.png'
import three from '@/images/screenshots/3.png'
import four from '@/images/screenshots/4.png'
import five from '@/images/screenshots/5.png'
import six from '@/images/screenshots/6.png'
import eight from '@/images/screenshots/8.png'
import prot from '@/images/screenshots/prot.png'
import prom from '@/images/screenshots/prom.png'
import eleven from '@/images/screenshots/11.png'
import twelve from '@/images/screenshots/12.png'
import learning from '@/images/screenshots/learning.png'
import evt from '@/images/screenshots/evt.png'
import thisImg from '@/images/screenshots/this.png'
import universal from '@/images/screenshots/universal.png'

const videos = [
  {
    title: 'The learning system',
    image: learning,
  },
  {
    title: 'Imagine the engine & environment',
    image: two,
  },
  {
    title: 'Imagine flow & operations',
    image: three,
  },
  {
    title: 'Imagine loops',
    image: four,
  },
  {
    title: 'Imagine objects',
    image: five,
  },
  {
    title: 'Imagine functions',
    image: six,
  },
  {
    title: 'Imagine scope',
    image: eight,
  },
  {
    title: 'Imagine closures',
    image: eleven,
  },
  {
    title: 'Imagine this',
    image: thisImg,
  },
  {
    title: 'Imagine prototypal inheritance',
    image: prot,
  },
  {
    title: 'Imagine the DOM',
    image: twelve,
  },
  {
    title: 'Imagine the event loop',
    image: evt,
  },
  {
    title: 'Imagine Promises',
    image: prom,
  },
  {
    title: 'Start building applications',
    image: universal,
  },
]


export function Screencasts() {
  return (
    <section
      id="fundamentals"
      aria-labelledby="screencasts-title"
      className="scroll-mt-14 py-8 sm:scroll-mt-32 sm:py-12 "
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
          className="grid grid-cols-1 gap-x-8 gap-y-10 [counter-reset:video] sm:grid-cols-2 lg:grid-cols-3"
        >
          {videos.map((video) => (
            <li key={video.title} className="[counter-increment:video]">
              <div
                className="relative flex h-32 items-center justify-center rounded-2xl px-6 "
                // style={{
                //   backgroundImage:
                //     'linear-gradient(38.92deg, rgb(3, 20, 63) 10.77%, rgb(0, 133, 121) 115.98%)',
                // }}
              >
                <div className="flex overflow-hidden rounded shadow-sm">
                  <Image src={video.image} alt="" unoptimized />
                </div>
                
              </div>
              <h3 className="mt-4 text-base font-medium tracking-tight text-slate-900 before:mb-0 before:inline before:mr-2 before:font-mono before:text-sm before:text-slate-500 before:content-[counter(video,decimal-leading-zero)]">
                <span className="mt-4 md:mt-0">{video.title}</span>
              </h3>
 
            </li>
          ))}
        </ol>
        <div className="mt-20 mb-0 pb-0 max-w-2xl mx-auto flex justify-center">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src="https://www.youtube.com/embed/mVWiy6zSiDE?si=DEw0nRtudsabiloF"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </Container>
    </section>
  )
}
