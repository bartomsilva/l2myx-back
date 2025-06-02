import { BaseError } from "./BaseError";

export class ConflictError extends BaseError {
  constructor(message: string = "Recurso já cadastrado") {
    super(409, message)
  }
}
