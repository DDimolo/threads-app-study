'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

const BackButton = () => {
	const router = useRouter()

	const handleBack = () => {
		router.back()
	}

	return (
		<div className='flex w-full justify-start flex-row mb-6 gap-4'>
			<button onClick={handleBack}>
				<Image src='/assets/logout.svg' alt='logout' width={24} height={24} />
			</button>
			<h1 className='head-text text-left'>Назад</h1>
		</div>
	)
}

export default BackButton
