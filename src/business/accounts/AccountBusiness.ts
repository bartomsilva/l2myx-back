import { AccountDataBase } from "../../database/AccountDataBase"
import { ConflictError } from "../../error/ConflictError"
import { AccountDB } from "../../models/accounts/Account"

export class AccountBusiness {
  constructor(
    private accountDataBase: AccountDataBase,
  ) { }

  public getAllLogins = async (): Promise<any[]> => {

    const resultDB: AccountDB[] = await this.accountDataBase.getAllLogins()     
    return resultDB
  }

  public findUserByLogin = async (login:string): Promise<any[]> => {
    const result: AccountDB[] = await this.accountDataBase.findByLogin(login)     
    return result
  }

  public addCoinsToLogin = async (login: string, itemsToAdd: number): Promise<void> => {
    const user = await this.accountDataBase.findByLogin(login)
    if (!user || !user.approved) {
      throw new ConflictError("Doação inválida! Usuário não encontrado ou não aprovado.")
    }   
    await this.accountDataBase.addCoinsToLogin(login, itemsToAdd);
  }

  public saveDonation = async (body: any): Promise<void> => {
    console.log("em salva donate")
    await this.accountDataBase.saveDonation(body)
  }


  //=========== CREATE ACCOUNT
  public createAccount = async (newAccount: AccountDB): Promise<any> => {

    const accountExist = await this.accountDataBase.findByLogin(newAccount.login)

    if (accountExist != undefined) {
       throw new ConflictError("Conta já cadastrada!")
    }
    await this.accountDataBase.createAccount(newAccount)
  }

}