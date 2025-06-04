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
server.use("/payments", paymentRouter) 
 
