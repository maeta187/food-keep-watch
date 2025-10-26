import { z } from 'zod'

import { registerFormSchema } from '@/src/schemas/register-form'

export type RegisterFormValues = z.infer<typeof registerFormSchema>
