/* eslint-disable react/no-unescaped-entities */

import { CheckIcon } from '@/components/CheckIcon'
import { Container } from '@/components/Container'
import { HighlightedText } from './HighlightedText'

export function Introduction() {
  return (
    <section
      id="introduction"
      aria-label="Introduction"
      className="pb-8 pt-12 sm:pb-12"
    >
      <Container className="text-base sm:text-lg tracking-tight text-slate-700">
      <p className="mb-4 text-base sm:text-base text-blue-500 font-bold">
         Does this sound like you?
        </p>
        <p className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 leading-tight">
          "JavaScript is no longer exciting. It's just scary... I might get something to work, but I have no idea why..."
        </p>
        <p className="mt-4 text-base sm:text-base">
         I hear words like these all the time.
        </p>
        <ul role="list" className="mt-8 space-y-3">
          {[
            '"HTML & CSS came naturally but JavaScript is impossible"',
            '"I have so many knowledge gaps and uncertainties"',
            '"I do not understand the code I write"',
          ].map((feature) => (
            <li key={feature} className="flex text-sm sm:text-base">
              <span className="text-base">😔</span>
              <span className="ml-3 sm:ml-4 italic">{feature}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 sm:mt-8 font-bold text-base sm:text-base">I've once felt like this... </p>
        <p className="mt-3 sm:mt-4 text-base sm:text-base leading-relaxed">
           The overwhelming self-doubt went deeper than imposter syndrome. It wasn't only the fear of being exposed as a fraud. It was worse... it was the <HighlightedText color="yellow">fear that I was incapable.</HighlightedText>
        </p>
        <p className="mt-3 sm:mt-4 text-base sm:text-base leading-relaxed"> As a senior JavaScript developer who has coached and mentored beginners and juniors for YEARS, I can tell you with certainty you <span className="font-bold">are</span> capable. </p>
        <p className="mt-3 sm:mt-4 text-base sm:text-base"> I did it. I've helped over a hundred students do it. <span className="font-bold text-xl sm:text-2xl">You can do it too!</span></p>
        <ul role="list" className="mt-4 space-y-3">
          {[
            'you are career transitioning and have limited time',
            'this is your 100th time reviewing fundamentals',
            'you struggle with technical explanations',
            'ChatGPT writes all your code',
          ].map((feature) => (
            <li key={feature} className="flex text-sm flex-col md:flex-row items-start md:items-start">
              <CheckIcon className="h-6 w-6 hidden md:block sm:h-8 sm:w-8 flex-none fill-blue-500" />
              <span className="sm:ml-4 font-bold w-16">Even if</span>
              <span className="ml-1 sm:ml-2 text-left  text-base"> {feature}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
