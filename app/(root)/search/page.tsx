import UserCard from '@/components/cards/UserCard'
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

const Page = async () => {
	const user = await currentUser()
	if (!user) return null

	const userInfo: any = await fetchUser(user.id)
	if (!userInfo?.onboarded) redirect('/onboarding')

	const result = await fetchUsers({
		userId: user.id,
		searchString: '',
		pageNumber: 1,
		pageSize: 25,
	})

	return (
		<section>
			<h1 className='head-text mb-10'>Поиск</h1>

			{/* search bar */}

			<div className='mt-14 flex flex-col gap-9'>
				{result.users.length === 0 ? (
					<p className='no-result'>Пользователей нет</p>
				) : (
					<>
						{result.users.map(person => (
							<UserCard
								key={person.id}
								id={person.id}
								name={person.name}
								username={person.username}
								imgUrl={person.image}
								personType='User'
							/>
						))}
					</>
				)}
			</div>
		</section>
	)
}

export default Page
