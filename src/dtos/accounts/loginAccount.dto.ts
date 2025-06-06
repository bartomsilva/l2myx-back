import z from 'zod'

export interface LoginAccountInputDTO {
  login: string,
  password: string,
 }

export const LoginAccountSchema = z.object({
  login: z.string({
    required_error: "'login' é obrigatório",
    invalid_type_error: "'login' deve ser do tipo string"
  })
  .min(6, "'login' deve ter no mínimo 6 caracteres")
  .regex(/^[^\s]+$/, "'login' não pode conter espaços"),
  password: z.string(
    {
      required_error: "'password' é obrigatória",
      invalid_type_error: "'password' deve ser do tipo string"
    }).min(6, "'password' deve ter no mínimo 6 caracteres")
  
}).transform(data => data as LoginAccountInputDTO)