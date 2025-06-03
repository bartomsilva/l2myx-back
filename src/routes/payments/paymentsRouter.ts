import express from "express"
import { PaymentController } from "../../controller/paymets/PaymentsController"
import { PaymentBusiness } from "../../business/payments/PaymentBussines"
import { AccountBusiness } from "../../business/accounts/AccountBusiness"
import { AccountDataBase } from "../../database/AccountDataBase"

export const paymentRouter = express.Router()

const paymentController = new PaymentController
  (
    new PaymentBusiness(
      new AccountBusiness(
        new AccountDataBase()
      )
    )
  )

paymentRouter.post("/", paymentController.processPayment)

