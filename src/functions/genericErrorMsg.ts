import { PrismaClientInitializationError, PrismaClientKnownRequestError } from "@/generated/dbClient/runtime/library";
import { STATUS_CODE } from "@/types/httpStatus";

export const GenericMessages = (status: STATUS_CODE | undefined) => {
    const MESSAGES: Record<number, string> = {
        [STATUS_CODE.BadRequest]: "Erro no corpo da requisição.",
        [STATUS_CODE.NotFound]: "Recurso não encontrado.",
        [STATUS_CODE.UnsupportedMediaType]: "Tipo de mídia não suportado."
    }
    return status ? MESSAGES[status] : "Erro no servidor"
}

export const PrismaError = (objErr: unknown) => {
    if (objErr instanceof Error || objErr instanceof PrismaClientInitializationError || objErr instanceof PrismaClientKnownRequestError) {
        switch(objErr.name){
            case "PrismaClientInitializationError":
                return `Error(${objErr.message}): ${objErr instanceof PrismaClientInitializationError && objErr.errorCode }`
            case "PrismaClientKnownRequestError":
                return `Error(${objErr instanceof PrismaClientKnownRequestError && objErr.code}):`+
                 ` table ${objErr instanceof PrismaClientKnownRequestError && objErr.meta?.modelName} => `+
                  `${objErr instanceof PrismaClientKnownRequestError && objErr.meta?.cause}`
        default:
            return "Erro desconhecido."
        }
    }
}