import knex from "knex"
import crypto from "crypto"
import dotenv from "dotenv"
import { AccountDB } from "../models/accounts/Account"
import { encryptPassword } from "../utilities/utilities"

dotenv.config()

export abstract class BaseDataBase {
  protected static connection = knex({
    client: "mysql2",
    connection: {
      host: process.env.host,
      user: process.env.user_db,
      password: process.env.password_db,
      database: process.env.database,
    },
    pool: { min: 0, max: 7 },
  })

  public abstract TABLE_NAME: string

  // Método para criar uma nova conta
  public async createAccounts(login: string, password: string, secret: string, response: string): Promise<void> {
    const encryptedPassword = encryptPassword(password)
    await BaseDataBase.connection("accounts").insert({
      login,
      password: encryptedPassword,
      secretquestion: secret,
      questionresponse: response,
      access_level: 0,
    })
  }
 
  public async getAllLogins(): Promise<any[]> {
    // Seleciona todas as colunas apenas para inspeção
    return []
    const result = await BaseDataBase
      .connection("accounts")
      .select("*");
    return result;
  }

  // Busca uma conta pelo login
  public async findByLogin(login: string): Promise<any | null> {
    const result: AccountDB = await BaseDataBase.connection("accounts")
      .where({ login })
      .first()
    return result || null
  }

  // Método para somar coins ao saldo atual de um usuário
  public async addCoinsToLogin(login: string, coinsToAdd: number): Promise<void> {

    await BaseDataBase.connection(this.TABLE_NAME)
      .where({ login })
      .update({
        coin: BaseDataBase.connection.raw('IFNULL(coin, 0) + ?', [coinsToAdd]),
        id_donate: null,
        qr_code: null,
        qr_code_text: null,
        amount: 0,
        approved: 0
      });
  }

  // método para salvar doação 
  public async saveDonation(newDonate: any): Promise<void> {
    const login = newDonate.player_login; 
    await BaseDataBase.connection(this.TABLE_NAME)
      .where({ login })
      .update({
        id_donate: newDonate.id_donate,
        qr_code: newDonate.qr_code,
        qr_code_text: newDonate.qr_code_text,
        approved: newDonate.approved,
        amount: newDonate.amount,
        response: newDonate.response
      });
  }


}