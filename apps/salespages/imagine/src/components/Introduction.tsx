/* eslint-disable react/no-unescaped-entities */

import { CheckIcon } from '@/components/CheckIcon'
import { Container } from '@/components/Container'

export function Introduction() {
  return (
    <section
      id="introduction"
      aria-label="Introduction"
      className="pb-16 pt-20 sm:pb-20 md:pt-36 lg:pt-32"
    >
      <Container className="text-lg tracking-tight text-slate-700">
        <p className="font-display text-4xl font-bold tracking-tight text-slate-900">
          “I've reached a point when JavaScript is no longer exciting. It's just scary... I might get something to work, but I have no idea why it works and it terrifies me."
        </p>
        <p className="mt-4">
          Sound familiar? Maybe there's a voice in your head telling you things like:
        </p>
        <ul role="list" className="mt-8 space-y-3">
          {[
            'HTML & CSS came naturally but JavaScript is impossible',
            'I have so many knowledge gaps and uncertainties',
            'I do not understand the code I write',
            'JavaScript fills me with anxiety',
            'Maybe this is not for me...',
          ].map((feature) => (
            <li key={feature} className="flex">
              <CheckIcon className="h-8 w-8 flex-none fill-blue-500" />
              <span className="ml-4">{feature}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8 font-bold">That last one is HAUNTING. I felt the same once..</p>
        <p className="mt-4">
           I remember the overwhelming self-doubt. It went deeper than imposter syndrome. It wasn't only the fear of being exposed as a fraud. It was worse... it was the fear that I was incapable.
        </p>
        <p className="mt-4"> As a senior JavaScript developer who has coached and mentored beginners and juniors for YEARS, I can tell you with certainty you <span className="font-bold">are</span> capable. </p>
        <p className="mt-4"> I did it. I've helped many students do it. <span className="font-bold text-2xl">You can do it too!</span></p>
        <ul role="list" className="mt-8 space-y-3">
          {[
            'you are career transitioning and have limited time to code',
            'this is your 100th time reviewing fundamentals',
            'you struggle with technical explanations',
            'ChatGPT writes all your code',
          ].map((feature) => (
            <li key={feature} className="flex">
              <CheckIcon className="h-8 w-8 flex-none fill-blue-500" />
              <span className="ml-4 font-bold">Even if</span>
              <span className="ml-2"> {feature}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
