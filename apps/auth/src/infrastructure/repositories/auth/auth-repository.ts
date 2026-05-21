import { Auth } from '@/domain/auth/auth'
import type { IAuthRepository } from '@/domain/repositories/auth-repository'

export class AuthRepository implements IAuthRepository {
	private _authParser: Dependencies['authParser']
	private _supabaseClient: Dependencies['supabaseClient']

	constructor({
		authParser,
		supabaseClient,
	}: Pick<Dependencies, 'cipher' | 'supabaseClient' | 'authParser'>) {
		this._authParser = authParser
		this._supabaseClient = supabaseClient
	}

	public async save(auth: Auth) {
		const authData = this._authParser.toDbModel(auth)

		await this._supabaseClient.from('auth').insert(authData)
	}

	public async findByEmail(email: string) {
		const { data } = await this._supabaseClient.from('auth').select('*').eq('email', email).single()

		return data && this._authParser.toDomain(data)
	}

	public async deleteById(id: string) {
		await this._supabaseClient.from('auth').delete().eq('id', id)
	}
}
