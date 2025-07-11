import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { accountRouter } from "./routes/accounts/accountsRouter";
import { characterRouter } from "./routes/characters/charactersRouter";
import bodyParser from "body-parser";

dotenv.config();

const server = express();
server.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['https://l2myx.surge.sh', 'http://localhost:5000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

server.options('*', cors()); // Habilita preflight

server.use(express.json());
server.use(bodyParser.json());

// 📁 Arquivos públicos
const filesPath = path.join('/home/bartsilva/l2j/files');

// 🔗 Rotas
server.get("/ping", (req, res) => {
  res.send("servidor online");
});

server.use("/accounts", accountRouter);
server.use("/characters", characterRouter);
server.use("/downloads", express.static(filesPath));

// 🚀 Inicia servidor
const PORT = parseInt(process.env.PORT || "3003", 10);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
