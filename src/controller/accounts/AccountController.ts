import { Request, Response } from "express"
import { handlerError } from "../../error/handlerError"
import { AccountBusiness } from "../../business/accounts/AccountBusiness"
import { CreateAccountSchema } from "../../dtos/accounts/CreateAccount.dto"

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

  //=========== SING UP / CREATE ACCOUNT
  public createAccount = async (req: Request, res: Response): Promise<void> => {

    try {
      const input: any = CreateAccountSchema.parse({
        login: req.body.login,
        password: req.body.password,
        secretquestion: req.body.secretquestion,
        questionresponse: req.body.questionresponse
      })
      await this.accountBusiness.createAccount(input);
      res.status(201).json({ message: "Conta criada com sucesso" })

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

  public verifyDonate = async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id;
      const response = await this.accountBusiness.verifyDonate(id);
      res.status(200).json(response);
    } catch (error) {
      handlerError(res, error)
    }
  }

  public addCoinsToLogin = async (req: Request, res: Response): Promise<any> => {
    const login = req.params.login;
    try {
      const response = await this.accountBusiness.addCoinsToLogin(login);
      res.status(200).json(response);
    } catch (error) {
      handlerError(res, error)
    }
  }

  public resetDonate = async (req: Request, res: Response): Promise<any> => {
    try {
      const login = req.params.login;
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
      await this.accountBusiness.saveDonation(resetDonate);
      res.status(200);
    } catch (error) {
      handlerError(res, error)
    }
  }
}