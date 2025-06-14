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

// CREATE accout 
accountRouter.post("/", accountController.createAccount);

// login account
accountRouter.post("/login", accountController.loginAccount)

// efetua doação
accountRouter.post("/donate", accountController.processDonate);

// verifica doação - OK
accountRouter.post("/donate/verify", accountController.verifyDonate);

// add coins to login
accountRouter.post("/donate/adcoins", accountController.addCoinsToLogin);

// reset na doação
accountRouter.post("/donate/reset", accountController.resetDonate);
