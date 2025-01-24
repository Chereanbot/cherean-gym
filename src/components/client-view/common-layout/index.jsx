'use client'

import { usePathname } from "next/navigation"
import dynamic from 'next/dynamic'
import React from 'react'

const Navbar = dynamic(() => import("../navbar"), {
  ssr: false
})

export default function CommonLayout({children}) {
    const pathName = usePathname()
    
    return (
        <div className="min-h-screen bg-white w-full pb-28 md:pb-0">
            {pathName !== "/admin" ? <Navbar /> : null}
            {children}
        </div>
    )
}