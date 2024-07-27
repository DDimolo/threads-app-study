import React from 'react'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import '../globals.css'
import type { Metadata } from 'next'

export const metadata = {
	title: 'Threads',
	description: 'A Next.js Threads Application',
}

const inter = Inter({ subsets: ['cyrillic', 'latin'] })

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<ClerkProvider>
			<html lang='en,ru'>
				<body className={`${inter.className} bg-dark-2 `}>
					<div className='w-full flex justify-center items-center min-h-screen'>
						{children}
					</div>
				</body>
			</html>
		</ClerkProvider>
	)
}
