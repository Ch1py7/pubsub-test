export class CreateCommand {
	email: string
	password: string
	name: string
	username: string | null

	constructor({ email, password, name, username }: CommandConstructor) {
		this.email = email
		this.password = password
		this.name = name
		this.username = username
	}
}

interface CommandConstructor {
	email: string
	password: string
	name: string
	username: string | null
}
