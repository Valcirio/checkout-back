import { z } from "zod";

export const ZRegisterAdmin = z.object({
    username: z.string().regex(/^[a-z]+[a-z0-9]*$/, { message: 'Nome de usuário inválido.'}),
    email: z.string().email(),
    cnpj: z.string(),
    password: z.string()
})

const ZLoginName = z.string().regex(/^[a-z]+[a-z0-9]*$/, { message: 'Nome de usuário inválido.'})

export const ZLoginAdmin = z.object({
    login: z.union([ZLoginName, z.string().email()]),
    name: z.string(),
    email: z.string().email(),
    password: z.string()
})
