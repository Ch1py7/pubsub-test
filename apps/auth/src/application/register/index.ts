import { Auth } from '@/domain/auth/auth'
import { EmailAlreadyExistsError } from '@/domain/auth/errors'
import { CreateCommand } from './command'
import { PubSubEvent } from '@/infrastructure/pubsub'

export class RegisterUser {
	private _authRepository: Dependencies['authRepository']
	private _pubsub: Dependencies['pubsub']
	private _crypto: Dependencies['crypto']
	private _cipher: Dependencies['cipher']

	constructor({
		authRepository,
		cipher,
		crypto,
		pubsub,
	}: Pick<Dependencies, 'authRepository' | 'cipher' | 'crypto' | 'pubsub'>) {
		this._authRepository = authRepository
		this._pubsub = pubsub
		this._cipher = cipher
		this._crypto = crypto
	}

	public async execute(dto: CreateCommand) {
		const exists = await this._authRepository.findByEmail(dto.email)
		this.assertEmailNotExists(exists)
		const { hashedPassword, salt } = this._cipher.hashPassword(dto.password)
		const authId = this._crypto.randomUUID()
		const now = Date.now()

		const auth = new Auth({
			id: authId,
			createdAt: now,
			updatedAt: now,
			email: dto.email,
			password: hashedPassword,
			salt,
		})

		await this._authRepository.save(auth)

		try {
			const userEvent = this.createUserEvent({ ...dto, authId })
			await this._pubsub.publish(userEvent)
		} catch (error) {
			await this._authRepository.deleteById(authId)
			throw error
		}
	}

	private createUserEvent({ name, username, authId }: UserEvent): PubSubEvent<UserEvent> {
		return {
			type: 'auth.user_id_created',
			payload: { name, username, authId },
		}
	}

	private assertEmailNotExists(user: Auth | null) {
		if (user) {
			throw new EmailAlreadyExistsError()
		}
	}
}

interface UserEvent {
	name: string
	username: string | null
	authId: string
}
