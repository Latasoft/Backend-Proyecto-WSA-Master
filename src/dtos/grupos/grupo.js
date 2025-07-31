import z from 'zod'


export const createGroupSchema= z.object({
    name:z.string({
        required_error: 'El nombre es obligatorio',

    }),
    members: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de usuario inválido')).optional(),
    status:z.boolean(true).optional(),

})


// DTO para agregar o remover un miembro
export const modifyMemberSchema = z.object({
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID de usuario inválido'),
  });