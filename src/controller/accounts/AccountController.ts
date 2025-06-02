import { Request, Response } from "express"
import { handlerError } from "../../error/handlerError"
import { AccountBusiness } from "../../business/accounts/AcountBusiness"
import { CreateAccountSchema } from "../../dtos/accounts/CreateAccount.dto"

export class AccountController {
  constructor(private accountBusiness: AccountBusiness) { }

  //========== GET ACCONTS
  public getAllLogins = async (req: Request, res: Response): Promise<any> => {
    try {

      const output = await this.accountBusiness.getAllLogins()
      res.status(200).send({output})

    } catch (error) {
      handlerError(res, error)
    }
  }

  //=========== SING UP / CREATE ACCOUNT
  public createAccount = async (req: Request, res: Response): Promise<void> => {

    try {
      const input:any = CreateAccountSchema.parse({
        login: req.body.login,
        password: req.body.password,
        secretquestion: req.body.secretquestion,
        questionresponse: req.body.questionresponse
      })
      await this.accountBusiness.createAccount(input);
      res.status(201).json({message:"Conta criada com sucesso"})

    } catch (error) {
      handlerError(res, error)
    }
  }
 

  

}