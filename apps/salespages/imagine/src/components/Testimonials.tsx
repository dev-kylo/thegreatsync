/* eslint-disable react/no-unescaped-entities */
import Image, { type ImageProps } from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import {
  Expandable,
} from '@/components/Expandable'
import avatarNik from '@/images/Nik.jpg'
import avatarEmma from '@/images/Emma.jpg'
import avatarAnnie from '@/images/Annie.jpg'
import erica from '@/images/erica.jpg'
import karthik from '@/images/karthik.jpg'
import carl from '@/images/CarlBebli.jpg'

const testimonials = [
  [
    {
      content:
        'Kylos teaching style with the amazing illustrations really helped me understand the confusing JS concepts. These illustrations and the story behind them are so creative and memorable. I will never forget the Genie who is going to sit on the island for every variable that I create!',
      author: {
        name: 'Emma Wain',
        role: 'Junior developer',
        image: avatarEmma,
      },
    },
    {
      content:
        'Kylo taught me some of the most critical concepts in JavaScript and my confidence just skyrocketed. I wasn‘t scared of the errors anymore; I could understand the errors better and debugging became fun!',
      author: {
        name: 'Karthik Raju',
        role: 'Frontend developer',
        image: karthik,
      },
    },
    {
      content:
        'As a visual learner, I was captivated by how the course weaves together JavaScript concepts and memory techniques, forming a systematic yet vivid mental models for learning JavaScript. It‘s a transformative experience.',
      author: {
        name: 'Shanis',
        role: 'Student web developer',
     
      },
    },
  ],
  [
    {
      content:
        "I would often have to go back to theory repeatedly, and it felt like I was making little progress. Then, I came across The Great Sync. It turned out to be everything I needed",
      author: {
        name: 'Carl Bebli',
        role: 'Software Developer',
        image: carl
      },
    },
    {
      content:
        "As a person who prefers visuals to learn, I wish this course existed earlier. I've struggled for a while trying to understand javascript and Kylo has made it 10x easier.",
      author: {
        name: 'Chelsea Roberts',
        role: 'Junior Developer',
        // image: avatarNik,
      },
    },
    {
      content:
        'I constantly questioned my grasp of the language. The Great Sync emerged as a beacon of clarity. Though deliberately challenging at times, the course helped me fix this confusion.',
      author: {
        name: 'Matthew Higgins',
        role: 'Career Transitioner',
       
      },
    },
  ],
  [
    {
      content:
        'Kylo is a great teacher and a lot of care and thought has gone into the JavaScript mental model in a fun and interesting way! If you struggle to understand some of the more complex JavaScript concepts, definitely give The Great Sync a go! - Annie🦄⚡️',
      author: {
        name: 'Annie Bombanie',
        role: 'Front-End Engineering Lead',
        image: avatarAnnie,
      },
    },
    {
      content:
        'Kylo addressed every problem and had lots of tips and advice at the ready. Thanks again and again for the extra portion of motivation.',
      author: {
        name: 'Niklas Riebesell',
        role: 'Career transitioning',
        image: avatarNik,
      },
    },
    {
      content:
        'The Great Sync has given me a huge confidence boost in my ability to read, write and reflect on code. I now have a much clearer, bigger picture understanding. Just don‘t rush through the content, it‘s worth it!',
      author: {
        name: 'Ethan Meyers',
        role: 'Career Transitioned to Developer',
      },
    },
  ],
]

function Testimonial({
  author,
  children,
}: {
  author: { name: string; role: string; image?: ImageProps['src'] }
  children: React.ReactNode
}) {
  return (
    <figure className="rounded-4xl p-8 shadow-md ring-1 ring-slate-900/5">
      <blockquote>
        <p className="text-lg tracking-tight text-slate-900 before:content-['“'] after:content-['”']">
          {children}
        </p>
      </blockquote>
      <figcaption className="mt-6 flex items-center">
        <div className="overflow-hidden rounded-full bg-slate-50">
{ author.image &&( <Image
            className="h-12 w-12 object-cover"
            src={author.image}
            alt=""
            width={48}
            height={48}
          />) }
        </div>
        <div className="ml-4">
          <div className="text-base font-medium leading-6 tracking-tight text-slate-900">
            {author.name}
          </div>
          <div className="mt-1 text-sm text-slate-600">{author.role}</div>
        </div>
      </figcaption>
    </figure>
  )
}

export function Testimonials() {
  return (
    <section className="py-8 sm:py-10 lg:py-16">
      <Container className="text-center">
        <h2 className="font-display text-4xl font-bold tracking-tight text-slate-900">
          What Syncer Students have to say...
        </h2>
        {/* <p className="mt-4 text-lg tracking-tight text-slate-600">
          I worked with a small group of early access customers to make sure all
          of the content in the book was exactly what they needed. Hears what
          they had to say about the finished product.
        </p> */}
      </Container>
      <Expandable className="group mt-16">
        <ul
          role="list"
          className="mx-auto grid max-w-2xl grid-cols-1 gap-8 px-4 lg:max-w-7xl lg:grid-cols-3 lg:px-8"
        >
          {testimonials
            .map((column) => column[0])
            .map((testimonial, testimonialIndex) => (
              <li key={testimonialIndex} className="lg:hidden">
                <Testimonial author={testimonial.author}>
                  {testimonial.content}
                </Testimonial>
              </li>
            ))}
          {testimonials.map((column, columnIndex) => (
            <li
              key={columnIndex}
              className="hidden group-data-[expanded]:list-item lg:list-item"
            >
              <ul role="list">
                
                  {column.map((testimonial, testimonialIndex) => (
                    <li
                      key={testimonialIndex}
                      className={clsx(
                        testimonialIndex === 0 && 'hidden lg:list-item',
                        testimonialIndex === 1 && 'lg:mt-8',
                        testimonialIndex > 1 && 'mt-8',
                      )}
                    >
                      <Testimonial author={testimonial.author}>
                        {testimonial.content}
                      </Testimonial>
                    </li>
                  ))}
             
              </ul>
            </li>
          ))}
        </ul>
 
      </Expandable>
    </section>
  )
}
