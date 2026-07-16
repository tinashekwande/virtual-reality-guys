"use client"

import { useEffect, useState } from "react"

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show button after a delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <a
      href="https://wa.me/27717800323?text=Hi%20Virtual%20Reality%20Guys!%20I%27d%20like%20to%20book%20a%20VR%20experience."
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 ${
        isVisible ? "opacity-100 scale-100 animate-bounce" : "opacity-0 scale-50 pointer-events-none"
      }`}
      style={{ animationIterationCount: 2 }}
      aria-label="Chat on WhatsApp"
    >
      <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.403.002 9.803-4.392 9.806-9.799.002-2.618-1.016-5.083-2.87-6.94C16.255 2.01 13.795.992 11.176.992c-5.403 0-9.802 4.392-9.806 9.8-.001 1.73.473 3.42 1.37 4.908l-.997 3.639 3.738-.979l.064-.008z" />
      </svg>
    </a>
  )
}
