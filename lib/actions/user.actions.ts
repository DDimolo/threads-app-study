'use server'

import { revalidatePath } from 'next/cache'
import User from '../models/user.model'
import { connectToDB } from '../mongoose'
import Thread from '../models/thread.model'
import { FilterQuery, SortOrder } from 'mongoose'

interface Params {
	userId: string
	username: string
	name: string
	bio: string
	image: string
	path: string
}

export async function updateUser({
	userId,
	username,
	name,
	bio,
	image,
	path,
}: Params): Promise<void> {
	try {
		connectToDB().then

		await User.findOneAndUpdate(
			{ id: userId },
			{
				username: username.toLowerCase(),
				name,
				bio,
				image,
				onboarded: true,
			},
			{
				upsert: true,
			}
		)

		if (path === '/profile/edit') {
			revalidatePath(path)
		}
	} catch (error: any) {
		throw new Error(
			`Не получилось создать или обновить юзера: ${error.message}`
		)
	}
}

export async function fetchUser(userId: string) {
	try {
		connectToDB()

		return await User.findOne({ id: userId })
	} catch (error: any) {
		throw new Error(`Не получилось опознать юзера: ${error.message}`)
	}
}

export async function fetchUserPosts(userId: string) {
	try {
		connectToDB()

		const threads = await User.findOne({ id: userId }).populate({
			path: 'threads',
			model: Thread,
			populate: {
				path: 'author',
				model: User,
				select: 'name image id',
			},
		})
		return threads
	} catch (error: any) {
		throw new Error(`Не опознались треды у юзера этого ${error.message}`)
	}
}

export async function fetchUsers({
	userId,
	searchString = '',
	pageNumber = 1,
	pageSize = 20,
	sortBy = 'desc',
}: {
	userId: string
	searchString?: string
	pageNumber?: number
	pageSize?: number
	sortBy?: SortOrder
}) {
	try {
		connectToDB()

		const skipAmount = (pageNumber - 1) * pageSize

		const regex = new RegExp(searchString, 'i')

		const query: FilterQuery<typeof User> = {
			id: { $ne: userId },
		}

		if (searchString.trim() !== '') {
			query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }]
		}

		const sortOptons = { createdAt: sortBy }

		const usersQuery = User.find(query)
			.sort(sortOptons)
			.skip(skipAmount)
			.limit(pageSize)

		const totalUsersCount = await User.countDocuments(query)

		const users = await usersQuery.exec()

		const isNext = totalUsersCount > skipAmount + users.length

		return { users, isNext }
	} catch (error: any) {
		throw new Error(`Не получилось фетчнуть юзеров ${error.message}`)
	}
}

export async function getActivity(userId: string) {
	try {
		connectToDB()

		const userThreads = await Thread.find({ author: userId })

		const childThreadIds = userThreads.reduce((acc, userThread) => {
			return acc.concat(userThread.children)
		}, [])

		const replies = await Thread.find({
			_id: { $in: childThreadIds },
			author: { $ne: userId },
		}).populate({
			path: 'author',
			model: User,
			select: 'name image _id',
		})

		return replies
	} catch (error: any) {
		throw new Error(`Не получилось фетчнуть юзеров ${error.message}`)
	}
}
