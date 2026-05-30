export class UserAlreadyExistsError extends Error {
	constructor(authId: string) {
		super(`User with authId ${authId} already exists`)
		this.name = 'UserAlreadyExistsError'
	}
}
