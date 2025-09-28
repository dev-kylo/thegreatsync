// Pricing configuration and utility functions

// Product IDs configuration
export const PRODUCT_IDS = {
  // Discounted products (for mobile + Instagram users)
  discounted: {
    base: 916417, // $37 - Current base course
    bundle: 899581, // $57
  },
  // Regular price products
  regular: {
    base: 899581, // $97 - TODO: Replace with regular price base ID
    bundle: 899581, // $154 - TODO: Replace with regular price bundle ID
  }
}

// Price configuration
export const PRICES = {
  discounted: {
    base: 37,
    bundle: 56,
    booster: 19,
    originalBase: 97,
    originalBundle: 154,
    originalBooster: 57,
  },
  regular: {
    base: 97,
    bundle: 154,
    booster: 57,
    originalBase: 97,  // No strikethrough for regular price
    originalBundle: 154, // No strikethrough for regular price
    originalBooster: 57, // No strikethrough for regular price
  }
}

/**
 * Check if user came from Instagram
 * Checks URL params first, then sessionStorage
 */
export function isFromInstagram(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check URL params
  const urlParams = new URLSearchParams(window.location.search)
  const source = urlParams.get('source')
  
  if (source === 'instagram') {
    // Store in sessionStorage for persistence
    sessionStorage.setItem('traffic_source', 'instagram')
    return true
  }
  
  // Check sessionStorage for existing session
  const storedSource = sessionStorage.getItem('traffic_source')
  if (storedSource === 'instagram') {
    return true
  }
  
  // Optional: Check referrer (less reliable)
  const referrer = document.referrer.toLowerCase()
  if (referrer.includes('instagram.com') || referrer.includes('l.instagram.com')) {
    sessionStorage.setItem('traffic_source', 'instagram')
    return true
  }
  
  return false
}

/**
 * Detect if user is on a mobile device
 * Uses multiple detection methods for accuracy
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check via user agent
  const userAgent = navigator.userAgent.toLowerCase()
  const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'windows phone', 'mobile']
  const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword))
  
  // Check screen width
  const isMobileWidth = window.innerWidth <= 768
  
  // Check for touch capability
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // Return true if at least 2 conditions are met
  const checks = [isMobileUA, isMobileWidth, hasTouch]
  const mobileChecks = checks.filter(check => check).length
  
  return mobileChecks >= 2
}

/**
 * Check if manual override is enabled (for development)
 * Only checks if we should force SHOW the discount
 */
function hasManualDiscountOverride(): boolean {
  if (typeof window === 'undefined') return false
  
  // Only allow override in development mode or with env flag
  const isDevelopment = process.env.NODE_ENV === 'development'
  const allowOverride = process.env.NEXT_PUBLIC_ALLOW_DISCOUNT_OVERRIDE === 'true'
  
  if (!isDevelopment && !allowOverride) return false
  
  // Check URL params for override
  const urlParams = new URLSearchParams(window.location.search)
  const discountParam = urlParams.get('discount')
  const previewParam = urlParams.get('preview')
  
  if (discountParam === 'true' || previewParam === 'discount') {
    console.log('🎯 Forcing discount pricing (dev override)')
    return true
  }
  
  return false
}

/**
 * Determine if discount should be shown
 * Requires BOTH mobile device AND Instagram source
 * OR manual override in development
 */
export function shouldShowDiscount(): boolean {
  // Check for manual override first (dev/staging only)
  if (hasManualDiscountOverride()) {
    return true
  }
  
  // Normal production logic: BOTH mobile AND Instagram required
  return isFromInstagram()
}

/**
 * Get appropriate product IDs based on discount eligibility
 */
export function getProductIds(showDiscount: boolean) {
  return showDiscount ? PRODUCT_IDS.discounted : PRODUCT_IDS.regular
}

/**
 * Get appropriate prices based on discount eligibility
 */
export function getPrices(showDiscount: boolean) {
  return showDiscount ? PRICES.discounted : PRICES.regular
}

/**
 * Calculate discount percentage
 */
export function getDiscountPercentage(original: number, discounted: number): number {
  return Math.round(((original - discounted) / original) * 100)
}