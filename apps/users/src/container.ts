import { asClass, asValue, createContainer, InjectionMode } from 'awilix'
import crypto from 'node:crypto'
import { config } from '@/infrastructure/config'
import { supabaseClient } from '@/infrastructure/supabase/client'
import { UserParser } from './infrastructure/repositories/user/user-parser'
import { UserRepository } from './infrastructure/repositories/user/user-repository'
import { AddUser } from './application/add'
import { PubSubClient } from './infrastructure/pubsub'

export const container = createContainer<Dependencies>({
	injectionMode: InjectionMode.PROXY,
})

container.register({
	crypto: asValue(crypto),
	config: asValue(config),

	// Use Cases
	addUser: asClass(AddUser),

	// DB
	supabaseClient: asValue(supabaseClient),

	// Repositories
	userRepository: asClass(UserRepository),

	// PubSub
	pubsub: asClass(PubSubClient),

	// Parser
	userParser: asClass(UserParser),
})

declare global {
	interface Dependencies {
		crypto: typeof crypto
		config: typeof config

		// Use Cases
		addUser: AddUser

		// DB
		supabaseClient: typeof supabaseClient

		// Repositories
		userRepository: UserRepository

		// PubSub
		pubsub: PubSubClient

		// Parser
		userParser: UserParser
	}
}
