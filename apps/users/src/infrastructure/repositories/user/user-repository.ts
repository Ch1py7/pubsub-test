import { User } from '@/domain/user/user'
import type { IUserRepository } from '@/domain/repositories/user-repository'

export class UserRepository implements IUserRepository {
	private _userParser: Dependencies['userParser']
	private _supabaseClient: Dependencies['supabaseClient']

	constructor({ userParser, supabaseClient }: Pick<Dependencies, 'supabaseClient' | 'userParser'>) {
		this._userParser = userParser
		this._supabaseClient = supabaseClient
	}

	public async save(user: User) {
		const userData = this._userParser.toDbModel(user)

		await this._supabaseClient.from('users').insert(userData)
	}

	public async deleteById(id: string) {
		await this._supabaseClient.from('auth').delete().eq('id', id)
	}
}
