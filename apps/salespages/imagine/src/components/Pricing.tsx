/* eslint-disable react/no-unescaped-entities */
'use client'
import { useState, useEffect } from 'react'
import clsx from 'clsx'

import { Button } from '@/components/Button'
import { CheckIcon } from '@/components/CheckIcon'
import { Container } from '@/components/Container'
import { GridPattern } from '@/components/GridPattern'
import { SectionHeading } from '@/components/SectionHeading'
import { HighlightedText } from './HighlightedText'
import { shouldShowDiscount, getProductIds, getPrices, getDiscountPercentage } from '@/utils/pricing'

// Declare Paddle type to avoid TypeScript errors
declare global {
  interface Window {
    Paddle: any
  }
}

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
  const [includeBooster, setIncludeBooster] = useState(false)
  const [paddleReady, setPaddleReady] = useState(false)
  const [showDiscount, setShowDiscount] = useState(false)
  const [prices, setPrices] = useState(getPrices(false))
  const [productIds, setProductIds] = useState(getProductIds(false))
  
  // Calculate dynamic pricing
  const basePrice = prices.base
  const boosterPrice = prices.booster
  const totalPrice = includeBooster ? prices.bundle : prices.base
  
  const baseOriginalPrice = prices.originalBase
  const boosterOriginalPrice = prices.originalBooster
  const totalOriginalPrice = includeBooster ? prices.originalBundle : prices.originalBase
  
  // Calculate discount percentage
  const discountPercentage = showDiscount ? 
    getDiscountPercentage(totalOriginalPrice, totalPrice) : 0
  
  useEffect(() => {
    // Check discount eligibility
    const eligible = shouldShowDiscount()
    setShowDiscount(eligible)
    setPrices(getPrices(eligible))
    setProductIds(getProductIds(eligible))
    
    // Initialize Paddle when component mounts
    const initPaddle = () => {
      if (typeof window !== 'undefined' && window.Paddle) {
        const vendorId = process.env.NEXT_PUBLIC_VENDORID || '173591'
        window.Paddle.Setup({ vendor: +vendorId })
        setPaddleReady(true)
      }
    }
    
    // Check if Paddle is already loaded
    if (window.Paddle) {
      initPaddle()
    } else {
      // Wait for Paddle to load
      const checkPaddle = setInterval(() => {
        if (window.Paddle) {
          initPaddle()
          clearInterval(checkPaddle)
        }
      }, 100)
      
      // Cleanup interval on unmount
      return () => clearInterval(checkPaddle)
    }
  }, [])
  
  const handleCheckout = () => {
    if (!paddleReady || !window.Paddle) {
      console.error('Paddle not ready')
      return
    }
    
    // Determine which product to use based on checkbox selection and discount eligibility
    const productId = includeBooster ? productIds.bundle : productIds.base
    
    // Open Paddle checkout overlay
    window.Paddle.Checkout.open({
      method: 'overlay',
      product: productId,
      allowQuantity: false,
      disableLogout: true,
      passthrough: JSON.stringify({
        includesBooster: includeBooster,
        source: 'landing_page',
        hasDiscount: showDiscount
      }),
      successCallback: (data: any) => {
        // Handle successful purchase
        console.log('Purchase successful:', data)
        // Redirect to success page
        window.location.href = '/success'
      },
      closeCallback: () => {
        // Handle when user closes the checkout (optional)
        console.log('Checkout closed by user')
      }
    })
  }
  
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
        {showDiscount && (
          <span className="text-slate-600 text-sm"> 
            Limited time offer: <span className="text-blue-600 font-bold">{discountPercentage}% discount</span>
          </span>
        )}
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
            {showDiscount && (
              <span
                className={clsx(
                  'ml-1 line-through text-3xl tracking-tight opacity-50',
                  featured ? 'text-white' : 'text-slate-900',
                )}
              >
                {totalOriginalPrice.toFixed(2)}
              </span>
            )}
            <span
              className={clsx(
                showDiscount ? 'ml-1 -mt-1' : 'ml-1',
                'text-7xl tracking-tight',
                featured ? 'text-white' : 'text-slate-900',
              )}
            >
              {totalPrice}.00
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
        
        {/* Booster Upsell Checkbox */}
        <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-200">
          <label className="flex items-start cursor-pointer">
            <input
              type="checkbox"
              checked={includeBooster}
              onChange={(e) => setIncludeBooster(e.target.checked)}
              className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900">
                  ⚡ Master JavaScript's Quirks
                </span>
                <div className="text-right">
                  {showDiscount && (
                    <span className="text-xs text-slate-500 line-through">${boosterOriginalPrice}</span>
                  )}
                  <span className="ml-2 font-bold text-purple-600">+${boosterPrice}</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-slate-600">
                Add 3 advanced "Booster" lessons that demystify the tricky parts:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-600">
                <li className="flex items-center">
                  <span className="mr-1 text-purple-500">→</span>
                  <span className="font-medium">The "this" keyword</span> - Never be confused by this again
                </li>
                <li className="flex items-center">
                  <span className="mr-1 text-purple-500">→</span>
                  <span className="font-medium">Prototypal Inheritance</span> - The beating heart of JavaScript
                </li>
                <li className="flex items-center">
                  <span className="mr-1 text-purple-500">→</span>
                  <span className="font-medium">The DOM</span> - Visualize and learn exactly what this is
                </li>
              </ul>
              {showDiscount && (
                <p className="mt-2 text-xs font-semibold text-green-600">
                  Save ${boosterOriginalPrice - boosterPrice} today ({getDiscountPercentage(boosterOriginalPrice, boosterPrice)}% off)
                </p>
              )}
            </div>
          </label>
        </div>
        
        <Button
          onClick={handleCheckout}
          color='blue'
          className="mt-8"
          disabled={!paddleReady}
          aria-label={`Get started with the ${name} plan for $${totalPrice}`}
        >
          {paddleReady ? 'GET INSTANT ACCESS' : 'LOADING...'}
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
        <p className="mt-4 text-md md:text-lg tracking-tight text-slate-600">
        Have you decided that a career spent blindly copy-pasting is not for you? <span className="font-bold">This is your chance...</span>
        </p>

      </Container>
      <div className="mx-auto mt-8 md:mt-16 max-w-5xl lg:px-6">
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
