import { z } from "zod"
import { ZRegisterClient } from "./client"
import { ZRegisterProduct } from "./product"

export const ZRegisterOrder = z.object({
    productId: z.string()
})
.merge(ZRegisterClient)

export type TRegisterOrder = z.infer<typeof ZRegisterOrder>