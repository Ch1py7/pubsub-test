import { User } from '@/domain/user/user'
import { UserAlreadyExistsError } from '@/domain/user/errors'
import { CreateCommand } from './command'

export class AddUser {
	private _userRepository: Dependencies['userRepository']
	private _crypto: Dependencies['crypto']

	constructor({ userRepository, crypto }: Pick<Dependencies, 'userRepository' | 'crypto'>) {
		this._userRepository = userRepository
		this._crypto = crypto
	}

	public async execute(dto: CreateCommand) {
		const now = Date.now()
		const id = this._crypto.randomUUID()

		const user = new User({
			id,
			authId: dto.authId,
			createdAt: now,
			updatedAt: now,
			name: dto.name,
			username: dto.username,
		})

		try {
			await this._userRepository.save(user)
		} catch (err) {
			if (err instanceof UserAlreadyExistsError) {
				console.log(`Event for authId ${dto.authId} already processed, skipping`)
				return
			}
			throw err
		}
	}
}
