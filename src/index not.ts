import express from "express";
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
// import https from "https";
import fs from "fs";
import path from 'path';
import cors from "cors";
import dotenv from 'dotenv';
import { accountRouter } from "./routes/accounts/accountsRouter";
import { characterRouter } from "./routes/characters/charactersRouter";
import bodyParser from 'body-parser';

dotenv.config();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, //100 
})

const server = express();
server.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins?.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS não permitido para esta origem'));
    }
  },
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
server.use(helmet())
server.use(limiter)
server.use(express.urlencoded({ extended: true }))
server.use(bodyParser.json());
server.use(express.json());


const allowedOrigins = process.env.CORS_ORIGIN?.split(';').map(o => o.trim());
const filesPath = path.join('/home/bartsilva/l2j/files');

// 🧠 Rotas
server.get("/ping", (req, res) => {
  res.send("servidor online");
});

server.use("/accounts", accountRouter);
server.use("/characters", characterRouter);
server.use('/downloads', express.static(filesPath));

const PORT = parseInt(process.env.PORT || '3003', 10);
    
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
