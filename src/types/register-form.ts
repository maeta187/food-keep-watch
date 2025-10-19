import { z } from 'zod'

import { registerFormSchema } from '@/schemas/register-form'

export type RegisterFormValues = z.infer<typeof registerFormSchema>
