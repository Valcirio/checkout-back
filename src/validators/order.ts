import { z } from "zod"
import { ZRegisterClient } from "./client"

export const ZRegisterOrder = z.object({
    productId: z.string(),
    cardNumber: z.string().min(13, 'Numero do cartão está incorreto.').max(16, 'Numero do cartão está incorreto.'),
    expDate: z.string().length(6, 'Data de vencimento incorreta.'),
    cvc: z.string().min(3, 'Número de cvc incorreto.').max(4, 'Número de cvc incorreto.')
}).merge(ZRegisterClient)

export type TRegisterOrder = z.infer<typeof ZRegisterOrder>