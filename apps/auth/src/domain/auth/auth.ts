export class Auth {
	private _id: string
	private _createdAt: number
	private _updatedAt: number
	private _userId: string
	private _email: string
	private _password: string
	private _salt: string

	constructor(auth: IAuthConstructor) {
		this._id = auth.id
		this._createdAt = auth.createdAt
		this._updatedAt = auth.updatedAt
		this._userId = auth.userId
		this._email = auth.email
		this._password = auth.password
		this._salt = auth.salt
	}

	get id() {
		return this._id
	}

	get createdAt() {
		return this._createdAt
	}

	get updatedAt() {
		return this._updatedAt
	}

	get userId() {
		return this._userId
	}

	get email() {
		return this._email
	}

	get password() {
		return this._password
	}

	get salt() {
		return this._salt
	}
}

interface IAuthConstructor {
	id: string
	createdAt: number
	updatedAt: number
	password: string
	salt: string
	userId: string
	email: string
}
