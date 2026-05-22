import 'module-alias/register'
import dotenv from 'dotenv'
dotenv.config()
import { container } from './container'
import { PubSubEvent, UserEvent } from './infrastructure/pubsub'

async function initializer() {
	const { pubsub, addUser } = container.cradle

	try {
		await pubsub.subscribe(async (event: PubSubEvent<UserEvent>) => {
			const payload = event.payload

			if (event.type === 'auth.user_id_created') {
				await addUser.execute({
					authId: payload.authId,
					name: payload.name,
					username: payload.username,
				})
			}
		})
	} catch (error) {
		console.error('💥 Error crítico al inicializar la suscripción de Pub/Sub:', error)
		process.exit(1)
	}
}

initializer()
