'use client'
import { useState, useEffect } from 'react'
import { isMobileDevice } from '@/utils/pricing'

/**
 * Custom hook to detect if user is on a mobile device
 * Updates on resize events
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    // Initial check
    const checkMobile = () => {
      setIsMobile(isMobileDevice())
    }
    
    checkMobile()
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile)
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])
  
  return isMobile
}