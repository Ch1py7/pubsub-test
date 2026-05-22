import { PubSub } from '@google-cloud/pubsub'

export class PubSubClient {
	private _client: PubSub
	private _topicName = 'auth_events'
	private _subscriptionName = 'auth_events-sub'

	constructor({ config }: Pick<Dependencies, 'config'>) {
		this._client = new PubSub({
			projectId: config.pubsub.id,
			credentials: {
				project_id: config.pubsub.id,
				client_email: config.pubsub.email,
				private_key: config.pubsub.key,
			},
		})
	}

	private async getTopic() {
		try {
			const [topics] = await this._client.getTopics()
			const topicExists = topics.some((t) => t.name.includes(this._topicName))

			if (!topicExists) {
				const [topic] = await this._client.createTopic(this._topicName)
				return topic
			}

			return this._client.topic(this._topicName)
		} catch (error) {
			console.error('Failed to get or create topic:', error)
			throw error
		}
	}

	private async getSubscription() {
		const topic = await this.getTopic()
		const [subscriptions] = await topic.getSubscriptions()
		const subExists = subscriptions.some((s) => s.name.includes(this._subscriptionName))

		if (!subExists) {
			await topic.createSubscription(this._subscriptionName)
		}

		return this._client.subscription(this._subscriptionName)
	}

	public async subscribe(onMessage: (data: any) => void) {
		const subscription = await this.getSubscription()
		if (!subscription) throw new Error('Pub/Sub Subscription could not be resolved.')

		subscription.on('message', (message) => {
			onMessage(JSON.parse(message.data.toString()))
			message.ack()
		})

		subscription.on('error', (error) => {
			console.log(`error: ${error.message}`)
		})
	}
}

export interface PubSubEvent<T> {
	type: string
	payload: T
}

export interface UserEvent {
	name: string
	username: string | null
	authId: string
}

