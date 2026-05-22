import type { User } from '../user/user'

export interface IUserRepository {
	save(user: User): Promise<void>
	deleteById(id: string): Promise<void>
}
