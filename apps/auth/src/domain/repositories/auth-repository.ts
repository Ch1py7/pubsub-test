import type { Auth } from '../auth/auth'

export interface IAuthRepository {
	save(userAuth: Auth): Promise<void>
	findByEmail(email: string): Promise<Auth | null>
}
