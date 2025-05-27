import { z } from "zod"

export const ZParams = z.object({
    id: z.string().nonempty('A passagem do parâmetro é obrigatória.')
})

export type TParams = z.infer<typeof ZParams>