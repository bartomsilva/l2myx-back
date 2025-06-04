import { BadRequestError } from "../../error/BadRequest";
import { AccountBusiness } from "../accounts/AccountBusiness";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN_MP || "",
  options: {
    timeout: 5000,
  },
});
const paymentClient = new Payment(client);

// PaymentBusiness.ts
export class PaymentBusiness {
  constructor(private accountsService: AccountBusiness) { }

    async processDonate(body: any) {
    try {
      const login = body.player_login;
      const amount = body.transaction_amount;

      if (!login || amount <= 0) {
        console.error("erro 1", login, amount)
        throw new BadRequestError('Erro ao processar doação! Login não informado.');
      }

      const user = await this.accountsService.findUserByLogin(login);
      if (!user) {
        console.error("erro 2")
        throw new BadRequestError('Erro ao processar doação! Usuário não encontrado.');
      }
      // Monta o objeto conforme a documentação da API (Checkout API v1)
      const payment_data = {
        transaction_amount: body.transaction_amount,
        description: body.description,
        payment_method_id: "pix",
        payer: {
          email: body.player_email,
        },
      };
      const response = await paymentClient.create({ body: payment_data });
      return response
    } catch (error: any) {
      throw error
    }

  }

  async addCoinsToLogin(body: any): Promise<void> {
    /*
    body
      id_donate: paymentResponse.id,
      qr_code_text: paymentResponse.point_of_interaction.transaction_data.qr_code,
      qr_code: paymentResponse.point_of_interaction.transaction_data.qr_code_base64,
      amount: paymentResponse.transaction_amount,
      approved: paymentResponse.status === 'approved',
      player_login: playerLogin
    */
    try {
      const login = body.player_login;
      const coinsToAdd = body.amount / 5;
      if (!login || coinsToAdd <= 0) {
        throw new BadRequestError('Doação inválida.');
      }
      const findLogin: any = await this.accountsService.findUserByLogin(login);
      if (!findLogin) {
        throw new BadRequestError('Faça primeiro sua doação.');
      }
      //efetiva a doação
      if (findLogin.approved) {
        await this.accountsService.addCoinsToLogin(login, coinsToAdd);
      } else {
        await this.accountsService.saveDonation(body);
      }
    } catch (error: any) {
      throw error;
    }
  }

  // // Endpoint webhook para receber notificações do Mercado Pago

  async verifyDonate(body: any) {
    try {

      const id = body.id_donate

      if (!id) {
        throw new BadRequestError("Parâmetros inválidos");
      }
      const paymentInfo = await paymentClient.get({ id });
      const status = paymentInfo.status;

      return status;

    } catch (err) {
      throw err;
    }
  }
}