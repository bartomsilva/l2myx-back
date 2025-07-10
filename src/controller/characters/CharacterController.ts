import { Request, Response } from "express"
import { handlerError } from "../../error/handlerError"
import { CharacterBusiness } from "../../business/characters/CharacterBusiness"

export class CharacterController {
  constructor(private characterBusiness: CharacterBusiness) { }

  //========== GET top 10 characters by type of kill
  // typeKill: "pvpkills" | "pkkills"
  public getTop10 = async (req: Request, res: Response): Promise<any> => {
    try {

      const response = await this.characterBusiness.getTop10(req.params.typeKill as "pvpkills" | "pkkills")
      res.status(200).send(response)

    } catch (error) {
      handlerError(res, error)
    }
  }

  public getAllCharInLogin = async (req: Request, res: Response): Promise<any> => {
    try {

      const response = await this.characterBusiness.getAllCharInLogin(req.params.login as string)
      res.status(200).send(response)

    } catch (error) {
      handlerError(res, error)
    }
  }

  public tradeCoins = async (req: Request, res: Response): Promise<void> => {
    try {

      const login = req.body.login
      const charId = req.body.obj_id
      const quant = req.body.coins

     await this.characterBusiness.tradeCoins(login,charId,quant)
      res.status(200).send("Moedas trocadas com sucesso")

    } catch (error) {
      handlerError(res, error)
    }
  }
}