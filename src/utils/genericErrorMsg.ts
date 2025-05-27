import { STATUS_CODE } from "@/types/httpStatus";

export const GenericMessages = (status: STATUS_CODE | undefined) => {
    const MESSAGES: Record<number, string> = {
        [STATUS_CODE.BadRequest]: "Erro no corpo da requisição.",
        [STATUS_CODE.NotFound]: "Recurso não encontrado.",
        [STATUS_CODE.UnsupportedMediaType]: "Tipo de mídia não suportado."
    }
    return status ? MESSAGES[status] : "Erro no servidor"
}