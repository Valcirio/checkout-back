import { z } from "zod"
import { ZRegisterClient } from "./client"

export const ZRegisterOrder = z.object({
    productId: z.string(),
    value: z.number().min(1, 'Valor mínimo de R$1,00.'),
}).merge(ZRegisterClient)

export type TRegisterOrder = z.infer<typeof ZRegisterOrder>