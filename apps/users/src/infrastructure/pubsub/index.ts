import { PubSub, Subscription, Topic } from '@google-cloud/pubsub'

export class PubSubClient {
	private _client: PubSub
	private _topicName = 'auth_events'
	private _subscriptionName = 'auth_events-sub'
	private _topic: Topic | null = null
	private _subscription: Subscription | null = null

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
		if (this._topic) return this._topic
		const [topic] = await this._client.topic(this._topicName).get({ autoCreate: true })
		this._topic = topic
		return topic
	}

	private async getSubscription() {
		if (this._subscription) return this._subscription
		const topic = await this.getTopic()
		const [subscription] = await topic
			.subscription(this._subscriptionName)
			.get({ autoCreate: true })
		this._subscription = subscription
		return subscription
	}

	public async subscribe(onMessage: (data: any) => void) {
		const subscription = await this.getSubscription()

		subscription.on('message', async (message) => {
			try {
				await onMessage(JSON.parse(message.data.toString()))
				message.ack()
			} catch (error) {
				console.error('Error subscribing to Pub/Sub:', error)
				message.nack()
			}
		})

		subscription.on('error', (error) => {
			console.error('Pub/Sub subscription error:', error)
			process.exit(1)
		})
	}
}
