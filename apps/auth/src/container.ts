import { asClass, asValue, createContainer, InjectionMode } from 'awilix'
import crypto from 'node:crypto'
import { config } from '@/infrastructure/config'
import { supabaseClient } from '@/infrastructure/supabase/client'
import { AuthParser } from './infrastructure/repositories/auth/auth-parser'
import { CryptoCipher } from './infrastructure/security/crypto-cypher'
import { AuthRepository } from './infrastructure/repositories/auth/auth-repository'
import { RegisterUser } from './application/register'
import { PubSubClient } from './infrastructure/pubsub'

export const container = createContainer<Dependencies>({
	injectionMode: InjectionMode.PROXY,
})

container.register({
	crypto: asValue(crypto),
	cipher: asClass(CryptoCipher),
	config: asValue(config),

	// Use Cases
	registerUser: asClass(RegisterUser),

	// DB
	supabaseClient: asValue(supabaseClient),

	// Repositories
	authRepository: asClass(AuthRepository),

	// PubSub
	pubsub: asClass(PubSubClient),

	// Parser
	authParser: asClass(AuthParser),
})

declare global {
	interface Dependencies {
		crypto: typeof crypto
		cipher: CryptoCipher
		config: typeof config

		// Use Cases
		registerUser: RegisterUser

		// DB
		supabaseClient: typeof supabaseClient

		// Repositories
		authRepository: AuthRepository

		// PubSub
		pubsub: PubSubClient

		// Parser
		authParser: AuthParser
	}
}
