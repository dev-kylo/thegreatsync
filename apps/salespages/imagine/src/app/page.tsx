import { Author } from '@/components/Author'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Introduction } from '@/components/Introduction'
import { NavBar } from '@/components/NavBar'
import { Pricing } from '@/components/Pricing'
import { Resources } from '@/components/Resources'
import { Screencasts } from '@/components/Screencasts'
import { Testimonial } from '@/components/Testimonial'
import { Testimonials } from '@/components/Testimonials'
import Why from '@/components/Why'
import avatarImage1 from '@/images/avatars/avatar-1.png'
import avatarImage2 from '@/images/CarlBebli.jpg'

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
          name: 'Ethan Meyers',
          role: 'Career Transitioned to Developer',
          image: avatarImage1,
        }}
      >
        <p>
          “The Great Sync has given me a huge confidence boost in my ability to read, write and reflect on code. I now have a much clearer, bigger picture understanding. Just don‘t rush through the content, it‘s worth it!”
        </p>
      </Testimonial>
      <Screencasts />
      <Testimonial
        id="testimonial-from-gerardo-stark"
        author={{
          name: 'Carl Bebli',
          role: 'Software Developer',
          image: avatarImage2,
        }}
      >
        <p>
          “I would often have to go back to theory repeatedly, and it felt like I was making little progress. Then, I came across The Great Sync. It turned out to be everything I needed”
        </p>
      </Testimonial>
      <Why />
      <Pricing />
      <Testimonials />
      <Footer />
    </>
  )
}
