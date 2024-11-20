import { Author } from '@/components/Author'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Introduction } from '@/components/Introduction'
import { Pricing } from '@/components/Pricing'
import { Resources } from '@/components/Resources'
import { Screencasts } from '@/components/Screencasts'
import { Testimonial } from '@/components/Testimonial'
import { Testimonials } from '@/components/Testimonials'
import Why from '@/components/Why'
import miltiadis from '@/images/miltiadis.jpg'
import erica from '@/images/erica.jpg'

export default function Home() {
  return (
    <>
      <Hero />
      <Introduction />
      <Author />
      <Resources />
      <Testimonial
        id="testimonial-from-tommy-stroman"
        author={{
          name: 'Miltiadis Bouchalakis',
          role: 'Senior Frontend Developer',
          image: miltiadis,
        }}
      >
        <p>
        ”With this course and The Great Sync mental model, you will not just learn the basics. You&#39;ll quickly develop a deep, nuanced understanding of the language.”
        </p>
      </Testimonial>
      <Screencasts />
      <Testimonial
        id="testimonial-from-gerardo-stark"
        author={{
          name: 'Erica Lynn',
          role: 'Mom learning JavaScript',
          image: erica,
        }}
      >
        <p>
        “Kylo does an amazing job breaking down complex JavaScript theory so it is simple and easy to understand. The stories and illustrations really helped me.”
          {/* “I would often have to go back to theory repeatedly, and it felt like I was making little progress. Then, I came across The Great Sync. It turned out to be everything I needed” */}
        </p>
      </Testimonial>
      <Why />
      <Pricing />
      <Testimonials />
      <Footer />
    </>
  )
}
