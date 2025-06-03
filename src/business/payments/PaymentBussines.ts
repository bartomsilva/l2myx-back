import { BadRequestError } from "../../error/BadRequest";
import { AccountBusiness } from "../accounts/AccountBusiness";
import { MercadoPagoConfig, Payment } from "mercadopago";

// PaymentBusiness.ts
export class PaymentBusiness {
  constructor(private accountsService: AccountBusiness) { }

  async processDonation(body: any) {
    try {
      const login = body.player_login;
      const amount = body.transaction_amount;

      if (!login || !amount || amount <= 0) {
        throw new BadRequestError('Erro ao processar doação! Login não informado.');
      }

      const user = await this.accountsService.findUserByLogin(login);
      if (!user) {
        throw new BadRequestError('Erro ao processar doação! Usuário não encontrado.');
      }
      const client = new MercadoPagoConfig({
        accessToken: process.env.ACCESS_TOKEN_MP || "",
        options: {
          timeout: 5000,
        },
      });

      // Instancia o recurso de Payment
      const paymentClient = new Payment(client);

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
}