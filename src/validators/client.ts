import { cpf } from "cpf-cnpj-validator";
import { z } from "zod";

export const ZRegisterClient = z.object({
    name: z.string().nonempty('Nome do usuário é obrigatório.'),
    email: z.string().email('E-mail inválido.').nonempty(),
    cpf: z.string().nonempty('Campo do CPF é obrigatório.').refine(el => cpf.isValid(el), {message: 'CPF Inválido.'}),
    address: z.string().nonempty('Campo de endereço é obrigatório.'),
    quantity: z.number().min(1, 'Quantidade inválida.').max(5, 'Quantidade máxima de 5 unidades.')
})

export type TRegisterClient = z.infer<typeof ZRegisterClient>