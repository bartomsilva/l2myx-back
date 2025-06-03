import { Request, Response } from "express"
import { handlerError } from "../../error/handlerError"
import { PaymentBusiness } from "../../business/payments/PaymentBussines"

export class PaymentController {
  constructor(private paymentBusiness: PaymentBusiness) { }

  public processPayment = async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await this.paymentBusiness.processDonation(req.body);
      res.status(200).json(response);
    } catch (error) {
      handlerError(res, error)
    }
  }
}
