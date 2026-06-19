'use client'
import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function NavigationProgress() {
  const pathname = usePathname()
  const [width, setWidth] = useState(0)
  const [visible, setVisible] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    timerRef.current.forEach(clearTimeout)
    timerRef.current = []

    setVisible(true)
    setWidth(15)

    const t1 = setTimeout(() => setWidth(40), 80)
    const t2 = setTimeout(() => setWidth(65), 250)
    const t3 = setTimeout(() => setWidth(85), 500)
    const t4 = setTimeout(() => {
      setWidth(100)
      const t5 = setTimeout(() => {
        setVisible(false)
        setWidth(0)
      }, 300)
      timerRef.current.push(t5)
    }, 700)

    timerRef.current.push(t1, t2, t3, t4)
    return () => timerRef.current.forEach(clearTimeout)
  }, [pathname])

  if (!visible) return null

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-[3px] bg-blue-500 transition-all duration-300 ease-out rounded-r-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"
      style={{ width: `${width}%` }}
    />
  )
}
