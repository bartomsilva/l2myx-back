import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { accountRouter } from "./routes/accounts/accountsRouter";
import { characterRouter } from "./routes/characters/charactersRouter";
import bodyParser from 'body-parser';

dotenv.config();

const server = express();
server.use(express.json());
// server.use(cors())
server.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type'] }));

server.use(bodyParser.json());

const PORT = Number(process.env.PORT) || 3003;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


server.get("/ping", (req, res) => {
  res.send("servidor online");
});

// Rotas
server.use("/accounts", accountRouter);
server.use("/characters", characterRouter);



