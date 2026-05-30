import 'module-alias/register'
import { container } from './container'

async function bootstrap() {
	const authSubscriber = container.resolve('authSubscriber')
	await authSubscriber.start()
}

bootstrap().catch((err) => {
	console.error('Bootstrap failed:', err)
	process.exit(1)
})
