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

  public addItemsToUser = async (login: string, itemsToAdd: number): Promise<void> => {
    const user = await this.accountDataBase.findByLogin(login)
    if (!user) {
      throw new ConflictError("Usuário não encontrado!")
    }
    if (itemsToAdd <= 0) {
      throw new ConflictError("Quantidade de itens a adicionar deve ser maior que zero!")
    }
    await this.accountDataBase.addCoinsToLogin(login, itemsToAdd);


    // Aqui você pode adicionar a lógica para adicionar itens ao usuário
    // Por exemplo, atualizar o banco de dados com os novos itens
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