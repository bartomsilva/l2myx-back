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
accountRouter.post("/login", accountController.loginAccount)
accountRouter.post("/donate/process", accountController.processDonate)
accountRouter.post("/donate/verify/:id", accountController.verifyDonate)  
accountRouter.post("/donate/addcoins/:login", accountController.addCoinsToLogin)  
accountRouter.post("/donate/resetdonate/:login", accountController.resetDonate)  
