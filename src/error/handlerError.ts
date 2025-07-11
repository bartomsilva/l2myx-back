
import { Response } from "express"
import { BaseError } from "./BaseError"
import { ZodError } from "zod"

export const handlerError = (res: Response, error: unknown) => {

  console.log(error)
  if (error instanceof ZodError) {
    const mensagem = error.errors[0]?.message || "Erro de validação";
    return res.status(400).json({ message: mensagem });
  } else if (error instanceof BaseError) {
    return res.status(error.statusCode).json({ message: error.message });
  } else {
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}