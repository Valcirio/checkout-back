import { z } from "zod"

export const ZParams = z.object({
    id: z.string().uuid('O parâmetro é inválido.').nonempty('A passagem do parâmetro é obrigatória.')
})

export type TParams = z.infer<typeof ZParams>