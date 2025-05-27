// import { FindOrder } from "@/controllers/order";
// import { FastifyZodInstance } from "@/types/zod";
// import { ZRegisterOrder } from "@/validators/order";
// import { ZParams } from "@/validators/params";
// import { z } from "zod";

// export default async function orderRoutes(app: FastifyZodInstance) {
//     app.get('/:id', {
//         schema: {
//             params: ZParams
//         }
//     }, FindOrder)

//     app.post('',
//     {
//         schema: {
//             body: ZRegisterOrder
//         }
//     },
//     async (req, reply) =>{
//         return reply.status(200).send({message: ''})
//     })
// }