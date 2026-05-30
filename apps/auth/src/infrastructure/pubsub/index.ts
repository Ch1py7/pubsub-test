import { PubSub, Topic } from '@google-cloud/pubsub'

export class PubSubClient {
	private _client: PubSub
	private _topicName = 'auth_events'
	private _topic: Topic | null = null

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

	public async publish<T>(event: PubSubEvent<T>) {
		try {
			const topic = await this.getTopic()
			await topic.publishMessage({
				data: Buffer.from(JSON.stringify(event)),
				attributes: { eventType: event.type },
			})
		} catch (error) {
			console.error('Error publishing message to Pub/Sub:', error)
			throw error
		}
	}
}

export interface PubSubEvent<T> {
	type: string
	payload: T
}
