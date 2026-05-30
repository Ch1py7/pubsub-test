import express from 'express'
import { validateRegister } from './middlewares/validate-register'
import { CreateCommand } from '@/application/register/command'
import { EmailAlreadyExistsError } from '@/domain/auth/errors'
import { container } from '@/container'

export const router: express.Router = express.Router()

router.post(
	'/auth/register',
	validateRegister,
	async (req: express.Request, res: express.Response) => {
		const auth = req.body
		try {
			const cmd = new CreateCommand(auth)
			const registerUser = container.resolve('registerUser')
			await registerUser.execute(cmd)

			res.status(201).json({
				message: 'User registered successfully',
			})
		} catch (error) {
			if (error instanceof EmailAlreadyExistsError) {
				res.status(409).json({
					message: 'Email is already registered',
				})
				return
			}

			console.error('Unexpected error during registration:', error)
			res.status(500).json({
				message: 'An unexpected error occurred',
			})
		}
	}
)
