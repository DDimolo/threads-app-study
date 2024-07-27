'use server'

import ThreadCard from '@/components/cards/ThreadCard'
import { fetchPosts } from '@/lib/actions/thread.actions'
import Thread from '@/lib/models/thread.model'
import { connectToDB } from '@/lib/mongoose'
import { ClerkProvider, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'

async function Home() {
	const result = await fetchPosts(1, 30)
	const user = await currentUser()
	if (!user) return null

	return (
		<div>
			<h1 className='head-text text-left'>🔥 Горячие обсуждения</h1>

			<section className='mt-9 flex flex-col gap-10'>
				{result.posts.length === 0 ? (
					<p className='no-result'>Ниче не найдено</p>
				) : (
					<>
						{result.posts.map(post => (
							<ThreadCard
								key={post._id}
								id={post._id}
								currentUserId={user.id}
								parentId={post.parentId}
								content={post.text}
								author={post.author}
								community={post.community}
								createdAt={post.createdAt}
								comments={post.children}
							/>
						))}
					</>
				)}
			</section>
		</div>
	)
}

export default Home
