// import bcrypt from 'bcryptjs'

// // Utils
// import { hash } from "@/utils/hash";
// import { prisma } from '@/utils/prisma'

// // Validators
// import { TRegisterOrder } from "@/validators/order";

// // Types
// import { STATUS_CODE } from "@/types/httpStatus";
// import { FastifyReply, FastifyRequest } from "fastify";
// import { TParams } from '@/validators/params';

// export async function CreateOrder
// (
//     req: FastifyRequest<{ Body: TRegisterOrder }>,
//     reply: FastifyReply
// ) {

//     const resultDB = await prisma.order.create({
//         data: {
            
//         }
//     })

//     return reply.status(STATUS_CODE.Created).send({message:'Usuário criado com sucesso!'})
// }

// export async function FindOrder
// (
//     req: FastifyRequest<{ Params: TParams }>,
//     reply: FastifyReply
// ) {

//     const resultDB = await prisma.order.findUnique({
//         where: {
//             id: req.params.id
//         }
//     })

//     if(!resultDB){
//         return reply.status(STATUS_CODE.Created).send({message:'Pedido encontrado!'})
//     }

//     return reply.status(STATUS_CODE.OK)
//     .send({message:'Pedido encontrado!', 
//         data: {

//         }
//     })
// }