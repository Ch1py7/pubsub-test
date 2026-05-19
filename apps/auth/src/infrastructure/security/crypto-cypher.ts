import jwt, { type JwtPayload } from 'jsonwebtoken'

export class CryptoCipher {
	private readonly _BASE36_ENCODING = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	private readonly _SECRET: Dependencies['config']['jwtSecret']
	private readonly _crypto: Dependencies['crypto']

	constructor({ crypto, config }: Pick<Dependencies, 'crypto' | 'config'>) {
		this._crypto = crypto
		this._SECRET = config.jwtSecret
	}

	public randomUUID(): string {
		return this._crypto.randomUUID()
	}

	public hashPassword(password: string) {
		const salt = this._crypto.randomBytes(64).toString('hex')
		const hashedPassword = this._crypto
			.pbkdf2Sync(password, salt, 10000, 64, 'sha256')
			.toString('base64')

		return { hashedPassword, salt }
	}

	public verifyPassword(storedHashBase64: string, storedSalt: string, password: string) {
		const hash = this._crypto
			.pbkdf2Sync(password, storedSalt, 10000, 64, 'sha256')
			.toString('base64')

		return storedHashBase64 === hash
	}

	public randomString(length: number): string {
		return Array.from(this._crypto.randomBytes(length))
			.map((byte) => this._BASE36_ENCODING[byte % this._BASE36_ENCODING.length])
			.join('')
	}

	public md5(value: string): string {
		return this._crypto.createHash('md5').update(value).digest('hex')
	}

	public verifyJwt = (token: string) => {
		const decoded = jwt.verify(token, this._SECRET) as JwtContent & JwtPayload
		if (decoded.exp < Date.now()) {
			throw new jwt.TokenExpiredError('Token expired', new Date(decoded.exp))
		}

		return decoded
	}

	public signJwt = (payload: JwtContent) => {
		return jwt.sign(
			{
				...payload,
			},
			this._SECRET
		)
	}
}

interface JwtContent {
	sub: string
	role: number
	iat: number
	exp: number
}
