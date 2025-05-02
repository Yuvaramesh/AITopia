"use client"
import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { useUser } from '@stackframe/stack'
import { usePathname } from 'next/navigation'

function AppHeader() {
    const user = useUser();
    const pathname =usePathname()

    return (
        <>
        {pathname === "/"?<></>: <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <span className="text-gray-800 text-2xl font-semibold tracking-tight">💎 AITopia</span>
                </Link>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm text-gray-500">Welcome back,</p>
                        <p className="text-base font-medium text-gray-800">{user?.displayName}</p>
                    </div>
                    <UserButton />
                </div>
            </div>
        </header>}
       
        </>
    )
}

export default AppHeader
