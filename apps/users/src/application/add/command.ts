export class CreateCommand {
	name: string
	username: string | null
	authId: string

	constructor({ name, username, authId }: CommandConstructor) {
		this.name = name
		this.username = username
		this.authId = authId
	}
}

interface CommandConstructor {
	name: string
	username: string | null
	authId: string
}
