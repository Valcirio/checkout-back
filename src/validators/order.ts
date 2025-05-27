import { z } from "zod"

export const ZRegisterOrder = z.object({
    product: z.string(),
    admin: z.string()
})

export type TRegisterOrder = z.infer<typeof ZRegisterOrder>