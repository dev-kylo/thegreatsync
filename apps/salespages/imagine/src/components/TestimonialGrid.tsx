import { Testimonial } from '@/components/Testimonial'
import { Container } from '@/components/Container'
import { type ImageProps } from 'next/image'
import { GridPattern } from '@/components/GridPattern'

interface TestimonialProps {
  id: string
  author: { name: string; role: string; image?: ImageProps['src'] }
  children: React.ReactNode
}

export function TestimonialGrid({
  testimonials,
}: {
  testimonials: TestimonialProps[]
}) {
  return (
    <div className="relative  py-4">
      <div className="absolute inset-0 h-full w-full text-slate-900/10">
        <GridPattern 
          x="50%" 
          patternTransform="translate(0 80)"
          className="absolute h-full w-full"
        />
      </div>
      <Container size="lg">
        <div className="relative grid grid-cols-1 gap-8 sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Testimonial
              key={testimonial.id}
              id={testimonial.id}
              author={testimonial.author}
              hidePattern
            >
              {testimonial.children}
            </Testimonial>
          ))}
        </div>
      </Container>
    </div>
  )
} 