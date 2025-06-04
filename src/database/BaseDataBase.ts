import knex from "knex"
import crypto from "crypto"
import dotenv from "dotenv"

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
    const encryptedPassword = this.encryptPassword(password)
    await BaseDataBase.connection("accounts").insert({
      login,
      password: encryptedPassword,
      secretquestion: secret,
      questionresponse: response,
      access_level: 0,
    })
  }

  // Método para criptografar a senha
  private encryptPassword(password: string): string {
    const sha1Hash = crypto.createHash("sha1").update(password).digest()
    return sha1Hash.toString("base64")
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
    const result = await BaseDataBase.connection("accounts")
      .where({ login })
      .first()
    return result || null
  }

  // Método para somar coins ao saldo atual de um usuário
  public async addCoinsToLogin(login: string, coinsToAdd: number): Promise<void> {
    await BaseDataBase.connection(this.TABLE_NAME)
      .where({ login })
      .update({
        coin: BaseDataBase.connection.raw('coin + ?', [coinsToAdd]),
        id_donate: null,
        qr_code: null,
        qr_code_text: null,
        amount: 0
      });
  }

  // método para salvar doação não concretizaza
  public async saveDonation(body:any) : Promise<void> {
    const login = body.player_login;    await BaseDataBase.connection(this.TABLE_NAME)
    .where({ login })
    .update({
      id_donate: body.id_donate,
      qr_code: body.qr_code,
      qr_code_text: body.qr_code_text,
      approved: false,
      amount: body.amount
    });
   
  }


}