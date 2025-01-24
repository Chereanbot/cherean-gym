'use client'

import { Suspense } from 'react'
import ClientAboutView from "@/components/client-view/about"
import CommonLayout from "@/components/client-view/common-layout"

// Loading component
function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-main"></div>
    </div>
  )
}

export default function About() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense fallback={<Loading />}>
        <CommonLayout>
          <ClientAboutView />
        </CommonLayout>
      </Suspense>
    </main>
  )
} 