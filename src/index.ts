import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { accountRouter } from "./routes/accounts/accountsRouter";
import { characterRouter } from "./routes/characters/charactersRouter";
import bodyParser from 'body-parser';

dotenv.config();

// Defina a origem do seu frontend (o domínio da Vercel)
// const allowedOrigins = ['https://l2myx-return.ddns.net',"localhost"]; 

const server = express();
server.use(express.json());
server.use(cors())
// server.use(cors({
//   origin: allowedOrigins,
//   credentials: false, // se estiver usando cookies ou auth com credenciais
// }));
server.use(bodyParser.json());

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

// Rotas
server.use("/accounts", accountRouter);
server.use("/characters", characterRouter);




