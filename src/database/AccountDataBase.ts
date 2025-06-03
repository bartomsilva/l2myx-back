import { AccountDB } from "../models/accounts/Account"
import { BaseDataBase } from "./BaseDataBase"

export class AccountDataBase extends BaseDataBase {
  TABLE_NAME = "accounts" // o nome correto da tabela no banco L2J é 'accounts'

  // ============= SIGN UP
  public async createAccount(newAccount: AccountDB): Promise<void> {
    await this.createAccounts(newAccount.login, newAccount.password, newAccount.secretquestion, newAccount.questionresponse)
  }

 
}
