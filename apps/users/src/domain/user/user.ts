export class User {
	private _id: string
	private _createdAt: number
	private _updatedAt: number
	private _name: string
	private _username: string | null
	private _auth_id: string

	constructor(auth: IUserConstructor) {
		this._id = auth.id
		this._createdAt = auth.createdAt
		this._updatedAt = auth.updatedAt
		this._name = auth.name
		this._username = auth.username
		this._auth_id = auth.authId
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

	get name() {
		return this._name
	}

	get username() {
		return this._username
	}

	get auth_id() {
		return this._auth_id
	}
}

interface IUserConstructor {
	id: string
	createdAt: number
	updatedAt: number
	name: string
	username: string | null
	authId: string
}
