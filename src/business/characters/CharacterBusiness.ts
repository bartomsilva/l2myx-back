import { CharacterDataBase } from "../../database/CharacterDatabase"

export class CharacterBusiness {
  constructor(
    private characterDataBase: CharacterDataBase,
  ) { }

  public getTop10 = async (typeKill: "pvpkills" | "pkkills"): Promise<{ char_name: string; kills: number }[]> => {
    const resultDB = await this.characterDataBase.getTop10(typeKill);
    return resultDB;
  }


}