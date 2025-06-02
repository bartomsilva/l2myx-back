import { Request, Response } from "express"
import { handlerError } from "../../error/handlerError"
import { CharacterBusiness } from "../../business/characters/CharacterBusiness"

export class CharacterController {
  constructor(private characterBusiness: CharacterBusiness) { }

  //========== GET top 10 characters by type of kill
  // typeKill: "pvpkills" | "pkkills"
  public getTop10 = async (req: Request, res: Response): Promise<any> => {
    try {

      const output = await this.characterBusiness.getTop10(req.params.typeKill as "pvpkills" | "pkkills")
      res.status(200).send({output})

    } catch (error) {
      handlerError(res, error)
    }
  }

}