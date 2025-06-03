import { z } from "zod"

const ACCEPTED_MIME_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp"
]

export const ZRegisterProduct = z.object({
  title: z.string().nonempty('O produto precisa de um nome.'),
  description: z.string().nonempty('O produto precisa de uma descrição.'),
  price: z.number().min(0, 'Preço inválido.'),
  picture: z.string(),
  quantity: z.number().min(0, 'Quantidade inválida.')
})

export type TRegisterProduct = z.infer<typeof ZRegisterProduct>

export const ZUpdateProduct = z.object({
  id: z.string().nonempty('O produto precisa de um id de identificação.'),
  title: z.string().nonempty('O produto precisa de um nome.').optional(),
  description: z.string().nonempty('O produto precisa de uma descrição.').optional(),
  price: z.number().min(0, 'Preço inválido.').optional(),
  picture: z.string().optional(),
  quantity: z.number().min(0, 'Quantidade inválida.').optional()
})

export type TUpdateProduct = z.infer<typeof ZUpdateProduct>