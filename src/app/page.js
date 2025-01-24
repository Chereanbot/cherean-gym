'use client'

import dynamic from 'next/dynamic'

const CommonLayout = dynamic(() => import('@/components/client-view/common-layout'), {
  ssr: false
})
const ClientHomeView = dynamic(() => import('@/components/client-view/home'), {
  ssr: false
})

export default function Home() {
  return (
    <main>
      <CommonLayout>
        <ClientHomeView />
      </CommonLayout>
    </main>
  )
} 