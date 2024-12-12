/* eslint-disable react/no-unescaped-entities */

import { CheckIcon } from '@/components/CheckIcon'
import { Container } from '@/components/Container'
import { HighlightedText } from './HighlightedText'

export function Introduction() {
  return (
    <section
      id="introduction"
      aria-label="Introduction"
      className="pb-16 pt-20 sm:pb-12"
    >
      <Container className="text-lg tracking-tight text-slate-700">
        <p className="font-display text-4xl font-bold tracking-tight text-slate-900">
          "JavaScript is no longer exciting. It's just scary... I might get something to work, but I have no idea why..."
        </p>
        <p className="mt-4">
         Do these words sound familiar?
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
        <p className="mt-8 font-bold">I've been in your shoes before. I remember when thoughts like these haunted me.</p>
        <p className="mt-4">
           The overwhelming self-doubt went deeper than imposter syndrome. It wasn't only the fear of being exposed as a fraud. It was worse... it was the <HighlightedText color="yellow">fear that I was incapable.</HighlightedText>
        </p>
        <p className="mt-4"> As a senior JavaScript developer who has coached and mentored beginners and juniors for YEARS, I can tell you with certainty you <span className="font-bold">are</span> capable. </p>
        <p className="mt-4"> I did it. I've helped over a hundred students do it. <span className="font-bold text-2xl">You can do it too!</span></p>
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
