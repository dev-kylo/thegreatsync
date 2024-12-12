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
import ethan from '@/images/ethan.jpg'
import erica from '@/images/erica.jpg'
import karthik from '@/images/karthik.jpg'
import { TestimonialGrid } from '@/components/TestimonialGrid'
import Faqs from '@/components/faqs'

export default function Home() {
  return (
    <>
      <Hero /> 
      <Introduction />
      <TestimonialGrid
        testimonials={[
          {
            id: "testimonial-1",
            author: {
              name: "Ethan Meyers",
              role: "Career Transitioning",
              image: ethan,
            },
            children: "This course has given me a huge confidence boost in my ability to read, write and reflect on code. I now have a much clearer, bigger picture understanding."
          },
          {
            id: "testimonial-2",
            author: {
              name: "Karthik Raju",
              role: "Frontend Developer",
              image: karthik,
            },
            children: "Kylo taught me some of the most critical concepts in JavaScript and my confidence just skyrocketed. I wasn‘t scared of errors anymore. Debugging became fun!"
          }
        ]}
      />
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
      <Faqs />
      <Footer />
    </>
  )
}
