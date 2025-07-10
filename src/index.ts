import express from "express";
import path from 'path';
import cors from "cors";
import dotenv from 'dotenv';
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { accountRouter } from "./routes/accounts/accountsRouter";
import { characterRouter } from "./routes/characters/charactersRouter";
import bodyParser from 'body-parser';

dotenv.config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, //100 
})

const server = express();
const PORT = Number(process.env.PORT) || 3003;
const filesPath = path.join('/home/bartsilva/l2j/files');

server.use(express.json());
server.use(helmet())
server.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type'] }));
server.use(bodyParser.json());
server.use(express.urlencoded({ extended: true }))
server.use(express.json())
server.use(limiter)
server.use(cors({
  origin: [
    'https://l2myx.surge.sh',
    'http://localhost:5000',
    'https://apil2jmyx.criarsite.online'],
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

server.get("/ping", (req, res) => {
  res.send("servidor online.");
});

server.use("/accounts", accountRouter);
server.use("/characters", characterRouter);
server.use('/downloads', express.static(filesPath));

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});




