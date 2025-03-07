/* eslint-disable react/no-unescaped-entities */
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { CheckIcon } from '@/components/CheckIcon'
import { Container } from '@/components/Container'
import { GridPattern } from '@/components/GridPattern'
import { SectionHeading } from '@/components/SectionHeading'
import { HighlightedText } from './HighlightedText'

function Plan({
  name,
  description,
  price,
  features,
  featured = false,
}: {
  name: string
  description: string
  price: string
  features: Array<string>
  href: string
  featured?: boolean
}) {
  return (
    <div
      className={clsx(
        'relative px-4 py-16 sm:rounded-5xl sm:px-10 md:py-4 lg:px-12',
        featured && 'bg-blue-600 sm:shadow-lg',
      )}
    >
      {featured && (
        <div className="absolute inset-0 text-white/10 [mask-image:linear-gradient(white,transparent)]">
          <GridPattern x="50%" y="50%" />
        </div>
      )}
      <div className="relative flex flex-col">
        <h3
          className={clsx(
            'mt-7 text-lg font-semibold tracking-tight',
            featured ? 'text-white' : 'text-slate-900',
          )}
        >
          {name}
        </h3>
        <span className="text-slate-600 text-sm"> Since you're a new subscriber, you get a <span className="text-blue-600 font-bold">40% discount</span></span>
        <p
          className={clsx(
            'mt-2 text-lg tracking-tight',
            featured ? 'text-white' : 'text-slate-600',
          )}
        >
          {description}
        </p>
        <p className="order-first flex font-display font-bold">
          <span
            className={clsx(
              'text-[1.75rem] leading-tight',
              featured ? 'text-blue-200' : 'text-slate-500',
            )}
          >
            $
          </span>
          <div className="flex flex-col">
            <span
              className={clsx(
                'ml-1 line-through text-3xl tracking-tight opacity-50',
                featured ? 'text-white' : 'text-slate-900',
              )}
            >
              97.00
            </span>
            <span
              className={clsx(
                'ml-1 -mt-1 text-7xl tracking-tight',
                featured ? 'text-white' : 'text-slate-900',
              )}
            >
              57.00
            </span>
          </div>
        </p>
        <div className="order-last mt-8">
          <ul
            role="list"
            className={clsx(
              '-my-2 divide-y text-base tracking-tight',
              featured
                ? 'divide-white/10 text-white'
                : 'divide-slate-200 text-slate-900',
            )}
          >
            {features.map((feature) => (
              <li key={feature} className="flex py-2">
                <CheckIcon
                  className={clsx(
                    'h-8 w-8 flex-none',
                    featured ? 'fill-white' : 'fill-slate-600',
                  )}
                />
                <span className="ml-4">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <Button
          href='/purchase'
          color='blue'
          className="mt-8"
          aria-label={`Get started with the ${name} plan for $${price}`}
        >
          GET INSTANT ACCESS
        </Button>
      </div>
    </div>
  )
}

export function Pricing() {
  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="scroll-mt-14 pb-8 pt-16 sm:scroll-mt-32 sm:pb-10 sm:pt-12 lg:pb-16"
    >
      <Container>
        <SectionHeading number="4" id="pricing-title">
          I'm Ready
        </SectionHeading>
        <p className="mt-8 font-display text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
        Time to level up!
        </p>
        <p className="mt-4 text-lg tracking-tight text-slate-600">
        Have you decided that a <HighlightedText>career spent blindly copy-pasting </HighlightedText> and never being able to build anything with confidence is not for you?
        </p>
        <p className="mt-4 text-lg tracking-tight text-slate-600">This is your opportunity to transform your understanding of JavaScript.</p>
      </Container>
      <div className="mx-auto mt-16 max-w-5xl lg:px-6">
        <div className="grid bg-slate-50 sm:px-6 sm:pb-16 md:grid-cols-1 md:rounded-6xl md:px-8 md:pt-12  max-w-xl m-auto">
          <Plan
            name="Imagine JavaScript"
            description="Get instant access and start building your mental model"
            price="97.00"
            href="#"
            features={[
              '30+ videos',
              '80+ pages',
              '50+ illustrations',
              'interactive code editor and exercises',
              'Access to The Syncer Student community'
            ]}
          />
        
        </div>
      </div>
    </section>
  )
}
