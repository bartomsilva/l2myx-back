
import z from 'zod'

export interface CreateAccountInputDTO {
  login: string,
  password: string,
  secretquestion: string,
  questionresponse: string,
}

export const CreateAccountSchema = z.object({
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
    }).min(6, "'password' deve ter no mínimo 6 caracteres"),
  secretquestion: z.string(
    {
      required_error: "'pegunta secreta' é obrigatória",
      invalid_type_error: "deve ser do tipo texto"
    }).min(2, "deve ter no mínimo 2 caracteres"),
  questionresponse: z.string(
    {
      required_error: "'a resposta' é obrigatória",
      invalid_type_error: "deve ser do tipo texto"
    }).min(2, "deve ter no mínimo 2 caracteres")
}).transform(data => data as CreateAccountInputDTO)