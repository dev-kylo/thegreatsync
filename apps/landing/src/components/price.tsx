"use client"

import { CheckIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

const tiers = [
  {
    name: 'The Syncer Program: Level Up With Visual & Memorable JavaScript',
    id: 'tier-enterprise',
    href: '#',
    priceMonthly: '$157',
    description: 'Step into The Great Sync visual model and learn JavaScript visually & memorably.',
    features: [
      '40+ videos',
      '80+ pages',
      '35+ illustrations',
      'Exercises and section projects',
      'Access to The Syncer student Discord community'
    ],
    featured: true,
  },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Price({ hideDescription }: {hideDescription?: boolean}) {

  return (
    <div className={`relative isolate ${!hideDescription ? 'py-24 sm:py-12' : ''} bg-white px-6  lg:px-8`} id="checkout">

    {!hideDescription && (<><div className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          It&lsquo;s time to level up!
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
        Have you decided that a career spent blindly copy-pasting and never being able to build anything with confidence is not for you? 
      </p>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
      This is your opportunity to transform your understanding of JavaScript and create the foundation you need for building a successful career in web development.
      </p></>)}
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-2xl lg:grid-cols-1">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-gray-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
              'rounded-3xl p-8 ring-1 ring-gray-900/10 sm:p-10'
            )}
          >
            <h3
              id={tier.id}
              className={classNames(
                tier.featured ? 'text-indigo-400' : 'text-indigo-600',
                'text-base font-semibold leading-7'
              )}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline flex-col sm:flex-row gap-x-2">
              {/* <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-4xl font-bold tracking-tight line-through'
                )}
              >
                97.00
              </span> */}
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-bold tracking-tight'
                )}
              >
                $157.00
              </span>
            </p>
            <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base leading-7')}>
              {tier.description}
            </p>
            {/* <p className={classNames(tier.featured ? 'text-gray-300' : 'text-gray-600', 'mt-6 text-base leading-7')}> Includes <strong>personal code feedback</strong> on the Discord community channel.</p> */}
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-gray-300' : 'text-gray-600',
                'mt-8 space-y-3 text-sm leading-6 sm:mt-10'
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    className={classNames(tier.featured ? 'text-indigo-400' : 'text-indigo-600', 'h-6 w-5 flex-none')}
                    aria-hidden="true"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <Link href="/purchase" className={classNames(
                tier.featured
                  ? 'bg-indigo-500 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline-indigo-500'
                  : 'text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 focus-visible:outline-indigo-600',
                'mt-8 block rounded-md py-2.5 px-3.5 text-center text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10'
              )}>

              GET INSTANT ACCESS
         
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
