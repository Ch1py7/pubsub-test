export class AuthEventsSubscriber {
	private _pubsub: Dependencies['pubsub']
	private _addUser: Dependencies['addUser']
	private _events: Dependencies['events']

	constructor({ pubsub, addUser, events }: Pick<Dependencies, 'pubsub' | 'addUser' | 'events'>) {
		this._pubsub = pubsub
		this._addUser = addUser
		this._events = events
	}

	public async start() {
		await this._pubsub.subscribe((event: PubSubEvent<UserEvent>) => this.handle(event))
	}

	private async handle(event: PubSubEvent<UserEvent>) {
		if (event.type === this._events.AUTH_USER_ID_CREATED) {
			await this._addUser.execute({
				authId: event.payload.authId,
				name: event.payload.name,
				username: event.payload.username,
			})
		} else {
			console.warn('Unknown event type, skipping:', event.type)
		}
	}
}

interface PubSubEvent<T> {
	type: string
	payload: T
}

export interface UserEvent {
	name: string
	username: string | null
	authId: string
}
