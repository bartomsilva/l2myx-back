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
      .increment('coin', coinsToAdd);
  }

  // // Você pode também manter o método para buscar o usuário, se precisar
  // public async findByLogin(login: string): Promise<any | null> {
  //   const result = await BaseDataBase.connection(this.TABLE_NAME)
  //     .where({ login })
  //     .first();
  //   return result || null;
  // }

}