import { AccountDataBase } from "../../database/AccountDataBase"
import { BadRequestError } from "../../error/BadRequest"
import { ConflictError } from "../../error/ConflictError"
import { AccountDB } from "../../models/accounts/Account"
import { MercadoPagoConfig, Payment } from "mercadopago"
import dotenv from 'dotenv'
import { CreateAccountSchema } from "../../dtos/accounts/CreateAccount.dto"
import { LoginAccountSchema } from "../../dtos/accounts/loginAccount.dto"
import { encryptPassword } from "../../utilities/utilities"
import { UnAuthorizedError } from "../../error/UnAuthorized"

dotenv.config()

const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN_MP || "",
  options: {
    timeout: 5000,
  },
})

const paymentClient = new Payment(client)

export class AccountBusiness {
  constructor(
    private accountDataBase: AccountDataBase,
  ) { }

  public getAllLogins = async (): Promise<any[]> => {

    const resultDB: AccountDB[] = await this.accountDataBase.getAllLogins()
    return resultDB
  }

  // busca um usuário pelo login
  public findUserByLogin = async (login: string): Promise<any> => {
    const result = await this.accountDataBase.findByLogin(login)
    return result
  }

  // cria uma doação no Mercado Pago
  public processDonate = async (body: any) => {
    try {
      const login = body.player_login
      const amount = body.transaction_amount

      if (!login || amount <= 0) {
        throw new BadRequestError('Erro ao processar doação! Login não informado.')
      }

      const user: any = await this.findUserByLogin(login)

      if (!user) {
        throw new BadRequestError('Erro ao processar doação! Usuário não encontrado.')
      }

      // verifica se o usuário já tem uma doação pendente
      const existingDonation = (user?.id_donate ?? '').trim()

      if (!existingDonation || existingDonation === null || existingDonation === "") {
        // Monta o objeto conforme a documentação da API (Checkout API v1)
        const payment_data = {
          transaction_amount: body.transaction_amount,
          description: body.description,
          payment_method_id: "pix",
          payer: {
            email: body.player_email,
          },
        }
        const response = await paymentClient.create({ body: payment_data })

        const newDonate = {
          id_donate: response?.id,
          qr_code_text: response?.point_of_interaction?.transaction_data?.qr_code,
          qr_code: response?.point_of_interaction?.transaction_data?.qr_code_base64,
          amount: response?.transaction_amount,
          approved: response.status === 'approved' ? 1 : 0,
          player_login: login,
          response: JSON.stringify(response),
        }
        await this.accountDataBase.saveDonation(newDonate)

        return response
      } else {
        return await JSON.parse(user.response)
      }
    } catch (error: any) {
      throw error
    }

  }

  // verifica o status de uma doação no Mercado Pago
  public verifyDonate = async (id: string): Promise<string> => {

    if (!id) {
      throw new BadRequestError("erro interno, contactar suporte.")
    }

    try {

      const paymentInfo = await paymentClient.get({ id })
      const status = paymentInfo.status || ""

      return status

    } catch (err: any) {
      throw err
    }
  }

  // adiciona as moedas ao login do usuário após a doação concretizada
  public addCoinsToLogin = async (login: string): Promise<void> => {
    try {
      if (!login) {
        throw new BadRequestError('Doação inválida')
      }
      const findLogin: any = await this.findUserByLogin(login)
      if (!findLogin) {
        throw new BadRequestError('Doação inválida')
      }
      if (!findLogin.id_donate || !findLogin.amount || findLogin.amount <= 0) {
        throw new BadRequestError('Doação já processada acessar o painel')
      }
      const nCoins = findLogin.amount / 5
      await this.accountDataBase.addCoinsToLogin(login, nCoins)
    } catch (error: any) {
      throw error
    }
  }

  // atualiza o status da doação no login do usuário
  public saveDonation = async (body: any): Promise<void> => {
    try {
      await this.accountDataBase.saveDonation(body)
    } catch (error) {
      throw error
    }
  }

  // Cria uma nova conta de usuário
  public createAccount = async (newAccount: AccountDB): Promise<any> => {

    try {
      CreateAccountSchema.parse(newAccount)

      const accountExist = await this.accountDataBase.findByLogin(newAccount.login)

      if (accountExist != undefined) {
        throw new ConflictError("Conta já cadastrada!")
      }
      await this.accountDataBase.createAccount(newAccount)

    } catch (error) {
      throw error
    }
  }

  // Realiza o login de um usuário
  public loginAccount = async (userData: any): Promise<any> => {

    try {

      LoginAccountSchema.parse(userData)

      const accountExist = await this.accountDataBase.findByLogin(userData.login)

      if (!accountExist) {
        throw new ConflictError("Conta inexistente!")
      }
      const passwordHashed = encryptPassword(userData.password)
      if (passwordHashed !== accountExist.password) {
        throw new UnAuthorizedError("Acesso negado!")
      }
      const userResponse = {
        login: accountExist.login,
        coins: accountExist.coin ||0
            }
      return userResponse

    } catch (error) {
      throw error
    }
  }

  // Cancela um pagamento no Mercado Pago
  public cancelPayment = async (paymentId: string) => {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.ACCESS_TOKEN_MP}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "cancelled",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Erro ao cancelar o pagamento")
      }

      const data = await response.json()
      return data
    } catch (error) {
      throw error
    }
  }

}