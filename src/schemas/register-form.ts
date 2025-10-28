import { z } from 'zod'

import { UI_TEXT } from '@/src/constants/ui-text'

export const registerFormSchema = z.object({
	name: z
		.string({ required_error: UI_TEXT.register.errors.required })
		.trim()
		.min(1, UI_TEXT.register.errors.required),
	expirationType: z.enum(['bestBefore', 'useBy']),
	expirationDate: z
		.string({ required_error: UI_TEXT.register.errors.expirationRequired })
		.min(1, UI_TEXT.register.errors.expirationRequired),
	storageLocation: z.string().optional(),
	categories: z.array(z.string().trim().min(1)).default([]),
	notificationDateTime: z.string().optional()
})
