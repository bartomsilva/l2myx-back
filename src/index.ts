import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { accountRouter } from "./routes/accounts/accountsRouter";
import { characterRouter } from "./routes/characters/charactersRouter";
import bodyParser from 'body-parser';
import { paymentRouter } from "./routes/payments/paymentsRouter";

dotenv.config();

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
server.use("/process_payment", paymentRouter) 

 
// // Endpoint webhook para receber notificações do Mercado Pago
server.post("/webhook/:id", async (req, res) => {
//   try {

//     const id = req.params.id as string;

//     if (!id) {
//       return res.status(400).send("Parâmetros inválidos");
//     }

//     const paymentInfo = await paymentClient.get({ id });
//     const status = paymentInfo.status;

//     return res.status(200).send(status);

//   } catch (err) {

//     console.error("Erro no webhook:", err);
//     res.status(500).send("Erro interno");
//   }
});