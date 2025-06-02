import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
  constructor(message: string = "Recursonão encontrado") {
    super(404, message)
  }
}
