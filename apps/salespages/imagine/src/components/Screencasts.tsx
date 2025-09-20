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
    booster: true,
  },
  {
    title: 'Imagine the "this" keyword',
    image: thisImg,
    booster: true,
  },
  {
    title: 'Imagine prototypal inheritance',
    image: prot,
    booster: true,
  },
  {
    title: 'Imagine the DOM',
    image: twelve,
    booster: true,
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
        <SectionHeading number="3" id="screencasts-title" className='mt-8 md:mt-16'>
          The Fundamentals
        </SectionHeading>
        <p className="mt-6 sm:mt-8 font-display text-xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
          The following are the course sections:
        </p>
        
      </Container>
      <Container size="lg" className="mt-8 sm:mt-16">
        {/* Mobile Design - Engaging Cards */}
        <div className="sm:hidden">
          <div className="space-y-4 [counter-reset:video]">
            {videos.map((video, index) => (
              <div 
                key={video.title} 
                className="group [counter-increment:video] relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Card Content */}
                <div className="flex items-center p-4">
                  {/* Number Badge */}
                  <div className="flex-shrink-0 mr-4">
                    <div className="relative">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Screenshot Preview */}
                  <div className="flex-1 mr-4">
                    <div className="relative overflow-hidden rounded-lg shadow-md bg-white">
                      <div className="aspect-video relative">
                        <Image 
                          src={video.image} 
                          alt={video.title}
                          fill
                          className="object-cover"
                          unoptimized 
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Title and Progress */}
                <div className="px-4 pb-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight">
                      {video.title}
                    </h3>
                    {video.booster && (
                      <span className="ml-2 bg-purple-600 text-xs px-2 py-0.5 rounded-full text-white font-semibold flex-shrink-0">
                        BOOSTER
                      </span>
                    )}
                  </div>
                  {/* Optional duration or lesson count */}
                  <div className="mt-2 flex items-center text-xs text-slate-500">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Interactive lesson</span>
                  </div>
                </div>
                
                {/* Decorative gradient border */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
              </div>
            ))}
          </div>
          
        </div>

        {/* Desktop/Tablet Design - Card Style */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 gap-6 [counter-reset:video]">
          {videos.map((video, index) => (
            <div 
              key={video.title} 
              className="group [counter-increment:video] relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {/* Card Content */}
              <div className="flex items-center p-6">
                {/* Number Badge */}
                <div className="flex-shrink-0 mr-6">
                  <div className="relative">
                    <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 text-xs px-2 py-0.5 rounded-full text-slate-900 font-semibold animate-pulse">
                        START
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Screenshot Preview */}
                <div className="flex-1">
                  <div className="relative overflow-hidden rounded-lg shadow-md bg-white">
                    <div className="aspect-video relative">
                      <Image 
                        src={video.image} 
                        alt={video.title}
                        fill
                        className="object-cover"
                        unoptimized 
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Title and Progress */}
              <div className="px-6 pb-6">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-slate-900 text-lg leading-tight">
                    {video.title}
                  </h3>
                  {video.booster && (
                    <span className="ml-2 bg-purple-600 text-xs px-2 py-1 rounded-full text-white font-semibold flex-shrink-0">
                      BOOSTER
                    </span>
                  )}
                </div>
                {/* Optional duration or lesson count */}
                <div className="mt-2 flex items-center text-sm text-slate-500">
                  <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Interactive lesson</span>
                </div>
              </div>
              
              {/* Decorative gradient border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600"></div>
            </div>
          ))}
        </div>
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
