import { User } from '@/domain/user/user'
import { UserAlreadyExistsError } from '@/domain/user/errors'
import type { IUserRepository } from '@/domain/repositories/user-repository'

const POSTGRES_UNIQUE_VIOLATION = '23505'

export class UserRepository implements IUserRepository {
	private _userParser: Dependencies['userParser']
	private _supabaseClient: Dependencies['supabaseClient']

	constructor({ userParser, supabaseClient }: Pick<Dependencies, 'supabaseClient' | 'userParser'>) {
		this._userParser = userParser
		this._supabaseClient = supabaseClient
	}

	public async save(user: User) {
		const userData = this._userParser.toDbModel(user)

		const { error } = await this._supabaseClient.from('users').insert(userData)

		if (error) {
			if (error.code === POSTGRES_UNIQUE_VIOLATION) {
				throw new UserAlreadyExistsError(user.authId)
			}
			throw error
		}
	}

	public async deleteById(id: string) {
		const { error } = await this._supabaseClient.from('users').delete().eq('id', id)
		if (error) throw error
	}
}
