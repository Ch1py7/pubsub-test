import { Auth } from '@/domain/auth/auth'
import type { IAuthRepository } from '@/domain/repositories/auth-repository'

export class AuthRepository implements IAuthRepository {
	private _authParser: Dependencies['authParser']
	private _supabaseClient: Dependencies['supabaseClient']

	constructor({
		authParser,
		supabaseClient,
	}: Pick<Dependencies, 'supabaseClient' | 'authParser'>) {
		this._authParser = authParser
		this._supabaseClient = supabaseClient
	}

	public async save(auth: Auth) {
		const authData = this._authParser.toDbModel(auth)

		const { error } = await this._supabaseClient.from('auth').insert(authData)
		if (error) throw error
	}

	public async findByEmail(email: string) {
		const { data, error } = await this._supabaseClient
			.from('auth')
			.select('*')
			.eq('email', email)
			.maybeSingle()

		if (error) throw error
		return data ? this._authParser.toDomain(data) : null
	}

	public async deleteById(id: string) {
		const { error } = await this._supabaseClient.from('auth').delete().eq('id', id)
		if (error) throw error
	}
}
