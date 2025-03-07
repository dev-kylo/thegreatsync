import Image, { type ImageProps } from 'next/image'

import { Container } from '@/components/Container'
import { GridPattern } from '@/components/GridPattern'
import { StarRating } from '@/components/StarRating'

export function Testimonial({
  id,
  author,
  children,
  hidePattern = false,
}: {
  id: string
  author: { name: string; role: string; image?: ImageProps['src'] }
  children: React.ReactNode
  hidePattern?: boolean
}) {
  return (
    <aside
      id={id}
      aria-label={`Testimonial from ${author.name}`}
      className="relative py-16 sm:py-32"
    >
      {!hidePattern && (
        <div className="text-slate-900/10">
          <GridPattern x="50%" patternTransform="translate(0 80)" />
        </div>
      )}
      <Container size="xs" className="relative">
        <figure>
          <div className="flex text-blue-600 sm:justify-center">
            <StarRating />
          </div>
          <blockquote className="mt-10 font-display text-2xl font-medium tracking-tight text-slate-900 sm:text-center">
            {children}
          </blockquote>
          <figcaption className="mt-10 flex items-center sm:justify-center">
            <div className="overflow-hidden rounded-full bg-slate-200">
            {author.image && ( <Image
                  className="h-20 w-20 object-cover"
                  src={author.image}
                  alt=""
                  width={48}
                  height={48}
              /> 
              )}
            </div>
            <div className="ml-4">
              <div className="text-base text-center font-medium leading-6 tracking-tight text-slate-900">
                {author.name}
              </div>
              <div className="mt-1 text-sm text-slate-600">{author.role}</div>
            </div>
          </figcaption>
        </figure>
      </Container>
    </aside>
  )
}
