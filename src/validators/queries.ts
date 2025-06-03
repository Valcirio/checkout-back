import { z } from 'zod';

enum EQueryTypes {
  page = 'page',
  ordination = 'ordination',
  desc = 'desc'
}

export const ZQueryParams = z.record(z.nativeEnum(EQueryTypes), z.string().superRefine((val, ctx) => {
  switch(ctx.path[0]) {
    case EQueryTypes.page:
      if (isNaN(Number(val))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O parâmetro de `page` deve ser um número.',
        })
      }

      if (Number(val) < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O parâmetro de `page` deve ser maior que 0.',
        })
      }
      break
    case EQueryTypes.ordination:
      if (val !== 'date' && val !== 'alpha' && val !== 'price') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O parâmetro de `ordination` deve ser `price`, `alpha` ou `date`',
        })
      }
      break
    case EQueryTypes.desc:
      if (val !== 'true' && val !== 'false') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'O parâmetro de `desc` deve ser `true` ou `false`',
        })
      }
      break
  }
}).optional())

export type TQueryParams = z.infer<typeof ZQueryParams>