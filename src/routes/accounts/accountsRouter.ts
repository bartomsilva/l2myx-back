import express from "express"
import { AccountBusiness } from "../../business/accounts/AcountBusiness"
import { AccountController } from "../../controller/accounts/AccountController"
import { AccountDataBase } from "../../database/AccountDataBase"


export const accountRouter = express.Router()

const accountController = new AccountController
  (
    new AccountBusiness(
      new AccountDataBase()
    )
  )

//================== GET all accout
accountRouter.get("/", accountController.getAllLogins)

//================== SING UP / CREATE accout
accountRouter.post("/", accountController.createAccount)

