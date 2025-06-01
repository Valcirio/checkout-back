import { z } from 'zod';

const queryStringFormatRegex = /^q\?page=\d+&ordination=[a-zA-Z]+&desc=(true|false)$/

export const ZQueryParams = z.object({
  q: z.string().regex(queryStringFormatRegex, "O formato do filtro não é válido").optional(),
});

export type TQueryParams = z.infer<typeof ZQueryParams>;
