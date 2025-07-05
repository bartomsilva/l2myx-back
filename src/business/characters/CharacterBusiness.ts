import { error } from "console";
import { CharacterDataBase } from "../../database/CharacterDatabase"
import { BadRequestError } from "../../error/BadRequest";

export class CharacterBusiness {

  constructor(
    private characterDataBase: CharacterDataBase,

  ) { }

  public getTop10 = async (typeKill: "pvpkills" | "pkkills"): Promise<{ char_name: string; kills: number }[]> => {

    const resultDB = await this.characterDataBase.getTop10(typeKill);
    return resultDB;

  }

  public getAllCharInLogin = async (login: string): Promise<{ char_name: string; obj_id: number }[]> => {

    const resultDB = await this.characterDataBase.getAllCharInLogin(login);
    return resultDB;

  }

  public tradeCoins = async (login: string, charId: number, quant: number): Promise<void> => {

    try {

      if (quant <= 0) {
        throw new BadRequestError("Você não tem coins para trocar")
      }
      const userData = await this.characterDataBase.findByLogin(login)

      const existCoins = userData.coin > 0

      if (!existCoins) {
        throw new BadRequestError("Você não tem coins para trocar")
      }

      const exitIteminBag = await this.characterDataBase.existsItemInBag(charId, 29057)

      await this.characterDataBase.tradeCoins(charId, quant, exitIteminBag);
      await this.characterDataBase.resetCoins(login)

    } catch (error) {
      throw error

    }


  }

}