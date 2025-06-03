
import { Response } from "express"
import { BaseError } from "./BaseError"
import { ZodError } from "zod"

export const handlerError = (res: Response, error: unknown) => {

  if (error instanceof ZodError) {
    res.status(400).send(error.issues)
  } else if (error instanceof BaseError) {
    res.status(error.statusCode).send({message: error.message}) 
  } else {    
    res.status(500).send(error)
  }
}