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
			console.error(error)
		}
	}

	private async getSubscription() {
		try {
			const topic = await this.getTopic()
			if (!topic) return
			const [subscriptions] = await topic.getSubscriptions()
			const subExists = subscriptions.some((s) => s.name.includes(this._subscriptionName))

			if (!subExists) {
				const [subscription] = await topic.createSubscription(this._subscriptionName)
				return subscription
			}

			return this._client.subscription(this._subscriptionName)
		} catch (error) {
			console.error(error)
		}
	}

	public async publish(event: PubSubEvent) {
		try {
			const topic = await this.getTopic()
			if (!topic) return
			const dataBuffer = Buffer.from(JSON.stringify(event))

			await topic.publishMessage({ data: dataBuffer })
		} catch (error) {
			console.error(error)
		}
	}

	public async subscribe(onMessage: (data: any) => void) {
		const subscription = await this.getSubscription()

		if (!subscription) return

		subscription.on('message', (message) => {
			onMessage(JSON.parse(message.data.toString()))
			message.ack()
		})

		subscription.on('error', (error) => {
			console.error(`error: ${error.message}`)
		})
	}
}

export interface PubSubEvent {
	type: string
	payload: any
}
