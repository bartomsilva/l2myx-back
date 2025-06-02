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
}
