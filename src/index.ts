// import express from "express";
// import https from "https";
// import fs from "fs";
// import cors from "cors";
// import dotenv from 'dotenv';
// import { accountRouter } from "./routes/accounts/accountsRouter";
// import { characterRouter } from "./routes/characters/charactersRouter";
// import bodyParser from 'body-parser';

// dotenv.config();

// const server = express();

// server.use(express.json());
// server.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type'] }));
// server.use(bodyParser.json());

// const PORT = Number(process.env.PORT) || 3003;

// // 🔐 Caminhos para o certificado SSL
// const sslOptions = {
//   key: fs.readFileSync("/etc/letsencrypt/live/apil2jmyx.criarsite.online/privkey.pem"),
//   cert: fs.readFileSync("/etc/letsencrypt/live/apil2jmyx.criarsite.online/fullchain.pem"),
// };

// // 🧠 Rotas
// server.get("/ping", (req, res) => {
//   res.send("servidor online!");
// });

// server.use("/accounts", accountRouter);
// server.use("/characters", characterRouter);

// // 🚀 Inicia o servidor HTTPS
// https.createServer(sslOptions, server).listen(PORT, () => {
//   console.log(`Servidor HTTPS rodando na porta ${PORT}`);
// });

import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { accountRouter } from "./routes/accounts/accountsRouter";
import { characterRouter } from "./routes/characters/charactersRouter";
import bodyParser from 'body-parser';

dotenv.config();

const server = express();

server.use(express.json());
server.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','OPTIONS'], allowedHeaders: ['Content-Type'] }));
server.use(bodyParser.json());

const PORT = Number(process.env.PORT) || 3003;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});


server.get("/ping", (req, res) => {
  res.send("servidor online");
});

server.use("/accounts", accountRouter);
server.use("/characters", characterRouter);



