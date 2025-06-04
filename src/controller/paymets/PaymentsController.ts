import { Request, Response } from "express"
import { handlerError } from "../../error/handlerError"
import { PaymentBusiness } from "../../business/payments/PaymentBussines"

export class PaymentController {
  constructor(private paymentBusiness: PaymentBusiness) { }

  public processDonate = async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await this.paymentBusiness.processDonate(req.body);
      res.status(200).json(response);
    } catch (error) {
      handlerError(res, error)
    }
  }

  public verifyDonate = async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await this.paymentBusiness.verifyDonate(req.body);
      res.status(200).json(response);
    } catch (error) {
      handlerError(res, error)
    }
  }

  public addCoinsToLogin = async (req: Request, res: Response): Promise<any> => {
    /*
    body
      id_donate: paymentResponse.id,
      qr_code_text: paymentResponse.point_of_interaction.transaction_data.qr_code,
      qr_code: paymentResponse.point_of_interaction.transaction_data.qr_code_base64,
      amount: paymentResponse.transaction_amount,
      approved: paymentResponse.status === 'approved',
      player_login: playerLogin
    */
    
    try {
      const response = await this.paymentBusiness.addCoinsToLogin(req.body);
      res.status(200).json(response);
    } catch (error) {
      handlerError(res, error)
    }
  }
}
