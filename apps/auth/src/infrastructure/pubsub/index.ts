import { PubSub } from '@google-cloud/pubsub'

export class PubSubClient {
	private _client: PubSub
	private _topicName = 'auth_events'

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

	public async publish<T>(event: PubSubEvent<T>) {
		try {
			const topic = await this.getTopic()
			console.log('topic')
			if (!topic) throw new Error('Pub/Sub Topic could not be resolved.')
				console.log('event', event)
			const dataBuffer = Buffer.from(JSON.stringify(event))

			await topic.publishMessage({
				data: dataBuffer,
				attributes: {
					eventType: event.type
				},
			})
			console.log('published')
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
