import dotenv from 'dotenv'
dotenv.config()

export const config = {
	privateKey: process.env.PRIVATE_KEY ?? '',
	jwtSecret: process.env.JWT_SECRET ?? '',
	supabase: {
		key: process.env.SUPABASE_KEY!.replace(/\\n/g, '\n'),
		url: process.env.SUPABASE_URL!,
	},
	pubsub: {
		id: process.env.PUBSUB_PROJECT_ID!,
		key: process.env.PUBSUB_KEY!.replace(/\\n/g, '\n'),
		email: process.env.PUBSUB_EMAIL!,
	},
}
