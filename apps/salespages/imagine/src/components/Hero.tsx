/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

import { Button } from '@/components/Button'
import { GridPattern } from '@/components/GridPattern'
import { StarRating } from '@/components/StarRating'
import coverImage from '@/images/model/full.png'
import { shouldShowDiscount, getPrices } from '@/utils/pricing'

function Testimonial() {
  return (
    <figure className="relative mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
      <div className="flex justify-center text-blue-600 lg:justify-start">
        <StarRating />
        {/* <em>Karthik </em> */}
      </div>
      <div>
      <blockquote className="mt-2">
        <p className="font-display text-xl font-medium text-slate-900">

        “I wasn‘t scared of errors anymore. Debugging became fun!”
        </p>
      </blockquote>
      <figcaption className="mt-2 text-sm text-slate-500">
        <strong className="font-semibold text-blue-600 before:content-['—_']">
          Karthik Raju
        </strong>
        , Frontend Developer
      </figcaption>
      </div>
    </figure>
  )
}

export function Hero() {
  const [showDiscount, setShowDiscount] = useState(false)
  const [prices, setPrices] = useState(getPrices(false))
  
  useEffect(() => {
    // Check discount eligibility on mount
    const eligible = shouldShowDiscount()
    setShowDiscount(eligible)
    setPrices(getPrices(eligible))
  }, [])
  
  return (
    <header className="overflow-hidden bg-slate-100 lg:bg-transparent lg:px-5">
      {/* Mobile-First Hero Design */}
      <div className="lg:hidden">
        <div className="relative min-h-[100vh] bg-white">
          {/* Clean white header with visual learning focus */}
          <div className="px-6 pt-8 pb-6">
            {/* Main Question - Conversational */}
            <h1 className="font-display text-4xl font-extrabold text-slate-900 leading-tight ">
              Are you a <span className="text-blue-600">visual learner</span> struggling with JavaScript?
            </h1>
            
            {/* Empathetic sub-message */}
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              You're not alone. Abstract concepts like closures and prototypes feel impossible when explained with just text and code.
            </p>
            
            {/* Core Value Proposition - Educational Focus */}
            <div className="mt-6 bg-gradient-to-br from-blue-100 to-white rounded-2xl p-5 border border-blue-100">
              <p className="text-lg font-semibold text-slate-900 leading-snug">
                What if you could build an <span className="text-blue-600">unforgettable visual mental model</span> of how JavaScript actually works?
              </p>
              <p className="mt-3 text-sm text-slate-600">
                Not just memorizing syntax, but truly understanding the environment, flow and patterns in the code.
              </p>
            </div>
          </div>
          
          {/* Visual Model Preview */}
          <div className="px-6 pb-6">
            <div className="relative">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">
                 Every concept can be imagined →
              </p>
              <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-white p-4">
                <Image 
                  className="w-full h-auto object-contain" 
                  src={coverImage} 
                  alt="Visual JavaScript Learning Model" 
                  priority 
                />
              </div>
            </div>
          </div>
          
          {/* Learning Approach */}
          <div className="px-6 pb-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Learn through imagination, not memorization
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-0.5">✓</span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Visual mental models that stick</p>
                      <p className="text-xs text-slate-500 mt-0.5">Picture JavaScript concepts as interactive worlds</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-0.5">✓</span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Understand, don't just copy</p>
                      <p className="text-xs text-slate-500 mt-0.5">Know why your code works, not just that it works</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-0.5">✓</span>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Build lasting confidence</p>
                      <p className="text-xs text-slate-500 mt-0.5">Debug fearlessly with deep understanding</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Course Introduction */}
          <div className="px-6 pb-6">
            <div className="border-t border-slate-200 pt-6">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                The Course
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                Imagine JavaScript
              </h3>
              <p className="text-sm text-slate-600 mt-2">
                A complete visual journey through JavaScript fundamentals. From basic concepts to advanced patterns, all explained through memorable visual models.
              </p>
            </div>
          </div>
          
          {/* Testimonial */}
          <div className="px-6 pb-6">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex text-yellow-500 text-sm">
                {'★'.repeat(5)}
              </div>
              <p className="text-sm text-slate-700 mt-2 italic">
                "I wasn't scared of errors anymore. Debugging became fun because I could visualize what was happening."
              </p>
              <p className="text-xs text-slate-500 mt-2">
                — Karthik R., Frontend Developer
              </p>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="px-6 pb-8">
            <div className="space-y-4">
              <Button href="#pricing-title" className="w-full text-base py-4 bg-slate-900 text-white hover:bg-slate-800 transition-all font-medium rounded-xl">
                Start Your Visual Learning Journey
              </Button>
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-3">
                  {showDiscount ? (
                    <>
                      <span className="text-sm text-slate-500 line-through">${prices.originalBase}</span>
                      <span className="text-2xl text-slate-900 font-bold">${prices.base}</span>
                      <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded">Limited time offer</span>
                    </>
                  ) : (
                    <span className="text-2xl text-slate-900 font-bold">${prices.base}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Educational Focus */}
      <div className="hidden lg:block">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Content */}
            <div className="order-2 lg:order-1">
              {/* Main Question */}
              <h1 className="font-display text-5xl font-extrabold text-slate-900 leading-tight">
                Are you a <span className="text-blue-600">visual learner</span> struggling with JavaScript?
              </h1>
              
              {/* Empathetic message */}
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                You're not alone. Abstract concepts like closures, prototypes, and the event loop feel impossible when explained with just text and code.
              </p>
              
              {/* Core Value Proposition */}
              <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <p className="text-xl font-semibold text-slate-900 leading-snug">
                  What if you could build an <span className="text-blue-600">unforgettable visual mental model</span> of how JavaScript actually works?
                </p>
                <p className="mt-3 text-base text-slate-600">
                Not just memorizing syntax, but truly understanding the environment, flow and patterns in the code through imaginative visual models.
                </p>
              </div>
              
              {/* Learning Benefits */}
              <div className="mt-8 space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">
                  Learn through imagination, not memorization
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1">✓</span>
                    <div>
                      <p className="font-medium text-slate-700">Visual mental models that stick forever</p>
                      <p className="text-sm text-slate-500 mt-1">Picture JavaScript concepts as interactive worlds you can explore</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1">✓</span>
                    <div>
                      <p className="font-medium text-slate-700">Understand deeply, don't just copy</p>
                      <p className="text-sm text-slate-500 mt-1">Know why your code works, not just that it works</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="text-blue-500 mr-3 mt-1">✓</span>
                    <div>
                      <p className="font-medium text-slate-700">Build lasting confidence</p>
                      <p className="text-sm text-slate-500 mt-1">Debug fearlessly when you can visualize what's happening</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Course Introduction */}
              <div className="mt-10 border-t border-slate-200 pt-8">
                <p className="text-sm uppercase tracking-wider text-slate-500 font-semibold">
                  Introducing
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2">
                  Imagine JavaScript
                </h3>
                <p className="text-base text-slate-600 mt-3">
                  A complete visual journey through JavaScript fundamentals. From basic concepts to advanced patterns, all explained through memorable visual metaphors that make complex ideas simple.
                </p>
              </div>
              
              {/* CTA Section */}
              <div className="mt-8 flex items-center gap-6">
                <Button href="#pricing-title" className="px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 transition-all font-medium rounded-xl">
                  Start Your Visual Learning Journey
                </Button>
                <div>
                  {showDiscount ? (
                    <>
                      <p className="text-sm text-slate-500">
                        <span className="line-through">${prices.originalBase}</span>
                        <span className="ml-2 text-xl text-slate-900 font-bold">${prices.base}</span>
                      </p>
                      <p className="text-xs text-green-600 font-medium">Limited time offer</p>
                    </>
                  ) : (
                    <p className="text-xl text-slate-900 font-bold">${prices.base}</p>
                  )}
                </div>
              </div>
              
              {/* Testimonial */}
              <div className="mt-10 bg-slate-50 rounded-xl p-5 border border-slate-200">
                <div className="flex text-yellow-500">
                  {'★'.repeat(5)}
                </div>
                <p className="text-base text-slate-700 mt-3 italic">
                  "I wasn't scared of errors anymore. Debugging became fun because I could visualize what was happening in my code."
                </p>
                <p className="text-sm text-slate-500 mt-2">
                  — Karthik Raju, Frontend Developer
                </p>
              </div>
            </div>
            
            {/* Right Column - Visual Model */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-8">
              <div className="relative">
                <p className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4">
                  A glimpse into the visual world →
                </p>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-white p-6">
                  <Image 
                    className="w-full h-auto object-contain" 
                    src={coverImage} 
                    alt="Visual JavaScript Learning Model - Interactive 3D representation of JavaScript concepts" 
                    priority 
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-slate-600 italic">
                    Every JavaScript concept can be imagined
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
