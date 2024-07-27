import mongoose from 'mongoose'

let isConnected = false

export const connectToDB = async () => {
	mongoose.set('strictQuery', true)

	if (!process.env.MONGODB_URL) return console.log('Где ЮРЛ от базы блеать')

	if (isConnected) {
		console.log('связь в базу закинута уже, не очкуй')
		return
	}

	try {
		await mongoose.connect(process.env.MONGODB_URL)

		isConnected = true
		console.log('База подключена')
	} catch (e) {
		console.log(e)
	}
}
