import type express from 'express'
import { body, type ValidationChain, validationResult } from 'express-validator'

const RegisterRules: ValidationChain[] = [
	body('email').isEmail().withMessage('Invalid email address').bail(),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Password must be at least 8 characters long')
		.bail(),
	body('name').trim().notEmpty().withMessage('Name is required').bail(),
	body('username').trim().notEmpty().withMessage('Username is required').bail(),
]

const validateRequest = (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
): void => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res
			.status(400)
			.json({ message: 'An error occurred while register the user', errors: errors.array() })
		return
	}
	next()
}

export const validateRegister = [...RegisterRules, validateRequest]
