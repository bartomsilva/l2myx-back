import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { accountRouter } from "./routes/accounts/accountsRouter";
import { characterRouter } from "./routes/characters/charactersRouter";
import bodyParser from 'body-parser';
import { MercadoPagoConfig, Payment } from "mercadopago";

dotenv.config();

// Configura o access token do Mercado Pago


const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN_MP || "",
  options: {
    timeout: 5000,       // opcional: timeout em ms
    // idempotencyKey: "alguma-chave-unica", // opcional
  },
});

// 3) Instancia o recurso de Payment
const paymentClient = new Payment(client);

const server = express();
server.use(express.json());
server.use(cors());
server.use(bodyParser.json());

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rotas
server.use("/accounts", accountRouter);
server.use("/characters", characterRouter);

// Endpoint para processar um pagamento
server.post("/process_payment", async (req, res) => {
  const {
    transaction_amount,
    description,
    payment_method_id,
    payer_email,
  } = req.body;

  // Monta o objeto conforme a documentação da API (Checkout API v1)
  const payment_data = {
    transaction_amount,
    description,
    payment_method_id,
    payer: {
      email: payer_email,
    },
  };

  try {
    // 4) Chama paymentClient.create(...) para criar o pagamento
    const body = await paymentClient.create({ body: payment_data });
    res.status(201).json(body);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Endpoint webhook para receber notificações do Mercado Pago
server.post("/webhook/:id", async (req, res) => {
  try {

    const id = req.params.id as string;

    if (!id) {
      return res.status(400).send("Parâmetros inválidos");
    }

    const paymentInfo = await paymentClient.get({ id });
    const status = paymentInfo.status;

    return res.status(200).send(status);

  } catch (err) {

    console.error("Erro no webhook:", err);
    res.status(500).send("Erro interno");
  }
});