type TLiteralOrdination = {
    [key: string]: TInsideLiteralOrdination
}

type TInsideLiteralOrdination = {
    [key: string]: string | {
        [key: string]: string
    }
}

export function OrdinationLiterals(ordination: string | undefined, desc: string | undefined): TInsideLiteralOrdination {
    const literals: TLiteralOrdination = {
        date: { createdAt: desc === 'true' ? 'desc' : 'asc' },
        alpha: { client: { name: desc === 'true' ? 'desc' : 'asc' } },
        price: { value: desc === 'true' ? 'desc' : 'asc' }
    }

    return ordination ? literals[ordination] : literals['date']
}