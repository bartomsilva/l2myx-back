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

  //=========== CREATE ACCOUNT
  public createAccount = async (newAccount: AccountDB): Promise<any> => {

    const accountExist = await this.accountDataBase.findByLogin(newAccount.login)

    if (accountExist != undefined) {
       throw new ConflictError("Conta já cadastrada!")
    }

    await this.accountDataBase.createAccount(newAccount)
  }

}