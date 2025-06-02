import { BaseError } from "./BaseError";

export class UnAuthorizedError extends BaseError {
  constructor(message: string = "Autorização negada") {
    super(401, message)
  }
}
