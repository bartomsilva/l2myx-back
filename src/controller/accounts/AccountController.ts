import { Request, Response } from "express"
import { handlerError } from "../../error/handlerError"
import { AccountBusiness } from "../../business/accounts/AccountBusiness"

export class AccountController {
  constructor(private accountBusiness: AccountBusiness) { }

  //========== GET ACCONTS
  public getAllLogins = async (req: Request, res: Response): Promise<any> => {
    try {

      const output = await this.accountBusiness.getAllLogins()
      res.status(200).send({ output })

    } catch (error) {
      handlerError(res, error)
    }
  }

  public createAccount = async (req: Request, res: Response): Promise<void> => {

    try {
      await this.accountBusiness.createAccount(req.body);
      res.status(201).json({ message: "Conta criada com sucesso" })

    } catch (error) {
      handlerError(res, error)
    }
  }

  public loginAccount = async (req: Request, res: Response): Promise<void> => {

    try {
      await this.accountBusiness.loginAccount(req.body);
      res.status(201).json({ message: "Login feito com sucesso" })
    } catch (error) {
      handlerError(res, error)
    }
  }

  public processDonate = async (req: Request, res: Response): Promise<any> => {
    try {
      const response = await this.accountBusiness.processDonate(req.body);
      res.status(200).json(response);
    } catch (error) {
      handlerError(res, error)
    }
  }

  // verificação de doação = OK
  public verifyDonate = async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.body;
      const response = await this.accountBusiness.verifyDonate(id);
      res.status(200).json(response);
    } catch (error) {
      handlerError(res, error)
    }
  }

  public addCoinsToLogin = async (req: Request, res: Response): Promise<any> => {
    const login = req.body.login as string
    try {
      const response = await this.accountBusiness.addCoinsToLogin(login);
      res.status(200).json(response);
    } catch (error) {
      handlerError(res, error)
    }
  }

  public resetDonate = async (req: Request, res: Response): Promise<any> => {
    try {

      const login = req.body.login;
      const paymentId = req.body.paymentId;

      const
        resetDonate = {
          player_login: login,
          id_donate: null,
          amount: null,
          qr_code: null,
          qr_code_text: null,
          approved: null,
          response: null
        }

      await this.cancelPayment(req.body.paymentId);
      await this.accountBusiness.saveDonation(resetDonate);
      res.status(200).json({ message: "Doação resetada com sucesso" });

    } catch (error) {

      handlerError(res, error)

    }
  }

  private cancelPayment = async (paymentId: string) => {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cancelar o pagamento");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

}