import { Auth } from '@/domain/auth/auth'
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

		const password = dto.password
		const { hashedPassword, salt } = this._cipher.hashPassword(password)
		const userId = this._crypto.randomUUID()

		const auth = new Auth({
			id: this._crypto.randomUUID(),
			createdAt: Date.now(),
			updatedAt: Date.now(),
			email: dto.email,
			password: hashedPassword,
			salt,
			userId,
		})

		await this._authRepository.save(auth)
		const userEvent = this.createUserEvent({ ...dto })
    this._pubsub.publish(userEvent)
	}

	private createUserEvent({ name, username }: UserEvent): PubSubEvent {
		return {
			type: 'auth.user_event',
			payload: { name, username },
		}
	}

	private assertEmailNotExists(user: Auth | null) {
		if (user) {
			throw new Error('Email is already registered.')
		}
	}
}

interface UserEvent {
	name: string
	username: string | null
}
