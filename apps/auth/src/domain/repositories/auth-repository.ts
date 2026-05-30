import type { Auth } from '../auth/auth'

export interface IAuthRepository {
	save(auth: Auth): Promise<void>
	findByEmail(email: string): Promise<Auth | null>
	deleteById(id: string): Promise<void>
}
