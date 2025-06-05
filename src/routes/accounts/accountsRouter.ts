import express from "express"
import { AccountBusiness } from "../../business/accounts/AccountBusiness"
import { AccountController } from "../../controller/accounts/AccountController"
import { AccountDataBase } from "../../database/AccountDataBase"

export const accountRouter = express.Router()

const accountController = new AccountController
  (
    new AccountBusiness(
      new AccountDataBase()
    )
  )

//================== GET all account (test)
accountRouter.get("/", accountController.getAllLogins)

//================== SING UP / CREATE accout / Donate
accountRouter.post("/", accountController.createAccount)
accountRouter.post("/donate/process", accountController.processDonate)
accountRouter.post("/donate/verify/:id", accountController.verifyDonate)  
accountRouter.post("/donate/addcoins/:login", accountController.addCoinsToLogin)  
accountRouter.post("/donate/resetdonate/:login", accountController.resetDonate)  

// routes/paymentRouter.ts ou direto no server
// accountRouter.post("/webhook", async (req, res) => {
//   try {
//     const topic = String(req.query.topic || req.body.topic || '');
//     const id = String(req.query.id || req.body.id || '');

//     if (topic === "payment" && id) {
//       const client = new MercadoPagoConfig({
//         accessToken: process.env.ACCESS_TOKEN_MP || "",
//       });

//       const paymentClient = new Payment(client);
//       const paymentInfo = await paymentClient.get({ id });

//       console.log("Webhook recebido. Status:", paymentInfo.status);
//       // Aqui você pode atualizar sua base de dados, liberar pedido, etc.

//       return res.sendStatus(200); // Sempre retorne 200
//     }

//     return res.sendStatus(200); // Retorne 200 mesmo que não seja um evento tratado

//   } catch (error) {
//     console.error("Erro no webhook:", error);
//     return res.sendStatus(500);
//   }
// });
