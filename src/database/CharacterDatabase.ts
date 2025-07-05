// Em algum arquivo de Database, por exemplo CharactersDatabase.ts

import { BaseDataBase } from "./BaseDataBase";

// O parâmetro `killType` deve ser exatamente "pvpkills" ou "pkkills"

export class CharacterDataBase extends BaseDataBase {
  TABLE_NAME = "characters"  // o nome correto da tabela no banco L2J é 'characters'

  // O parâmetro `killType` deve ser exatamente "pvpkills" ou "pkkills"
  public async getTop10(killType: "pvpkills" | "pkkills"): Promise<
    { char_name: string; kills: number }[]
  > {
    // Validação simples para garantir que só esses dois valores sejam aceitos
    if (killType !== "pvpkills" && killType !== "pkkills") {
      throw new Error("Parâmetro inválido. Use 'pvpkills' ou 'pkkills'.");
    }

    // Mapeamos o nome da coluna selecionada para um alias genérico "kills"
    const column = killType; // já será "pvpkills" ou "pkkills"
    const result = await BaseDataBase.connection("characters")
      .select("char_name", `${column} as kills`)
      .orderBy(column, "desc");

    // O Knex vai retornar algo como: [{ char_name: "Fulano", kills: 123 }, ...]
    return result;
  }

  public async getAllCharInLogin(login: string): Promise<
    { char_name: string, obj_id: number }[]
  > {
    const result = await BaseDataBase.connection("characters")
      .select("char_name", "obj_id")
      .where("account_name", login);

    return result;
  }

  public async generateUniqueObjectId() : Promise<number> {
  
    const generateRandomId = (): number => {
      // Gera um número que começa com 1 e tem 9 dígitos
      const min = 100000000;
      const max = 199999999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
  
    let objectId: number;
    let exists = true;
  
    do {
      objectId = generateRandomId();
  
      const result = await BaseDataBase.connection("items")
        .select("object_id")
        .where({ object_id: objectId })
        .first();
        exists = !!result;

    } while (exists);
  
    return objectId;
  };


  public async existsItemInBag(ownerId: number, itemId: number): Promise<boolean> {
    const result = await BaseDataBase.connection("items")
      .select("object_id")
      .where({
        owner_id: ownerId,
        item_id: itemId,
      })
      .first();

    return !!result;
  }

  public async tradeCoins(owner_id: number, quant: number, exist: boolean): Promise<void> {

    const ITEM_ID = 29057;

    if (exist) {
      await BaseDataBase.connection("items")
        .where({
          owner_id: owner_id,
          item_id: ITEM_ID
        })
        .increment("count", quant);
    } else {

      const object_id = await this.generateUniqueObjectId();  

      const newItem = {
        owner_id: owner_id,
        object_id: object_id,
        item_id: ITEM_ID,
        count: quant,
        enchant_level: 0,
        loc: "INVENTORY",
        loc_data: 0,
        price_sell: 0,
        price_buy: 0
      };
      await BaseDataBase.connection("items").insert(newItem);
    }
  }

  public async resetCoins(login: string): Promise<void> {
    await BaseDataBase.connection("accounts")  
      .where({ login: login })              
      .update({ coin: 0 });                 
  }

}
