'use client'
import { ReactNode } from 'react'
import { LoadingProvider } from './LoadingContext'
import LoadingOverlay from './LoadingOverlay'
import NavigationProgress from './NavigationProgress'

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LoadingProvider>
      <NavigationProgress />
      <LoadingOverlay />
      <div style={{ display: 'contents' }}>
        {children}
      </div>
    </LoadingProvider>
  )
}
