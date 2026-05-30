import { User as UserDomain } from '@/domain/user/user'
import { Database } from '@/infrastructure/supabase/database.types'

export class UserParser {
	toDomain(dbModel: Database['public']['Tables']['users']['Row']): UserDomain {
		return new UserDomain({
			id: dbModel.id,
			updatedAt: new Date(dbModel.updated_at).getTime(),
			createdAt: new Date(dbModel.created_at).getTime(),
			name: dbModel.name,
			username: dbModel.username,
			authId: dbModel.auth_id
		})
	}

	toDbModel(domainModel: UserDomain): Database['public']['Tables']['users']['Insert'] {
		return {
			id: domainModel.id,
			created_at: new Date(domainModel.createdAt).toISOString(),
			updated_at: new Date(domainModel.updatedAt).toISOString(),
			name: domainModel.name,
			username: domainModel.username,
			auth_id: domainModel.authId
		}
	}
}
