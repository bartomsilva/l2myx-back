import express from "express"
import { CharacterController } from "../../controller/characters/CharacterController"
import { CharacterBusiness } from "../../business/characters/CharacterBusiness"
import { CharacterDataBase } from "../../database/CharacterDatabase"


export const characterRouter = express.Router()

const characterController = new CharacterController
  (
    new CharacterBusiness(
      new CharacterDataBase()
    )
  )

  characterRouter.get("/top10/:typeKill", characterController.getTop10);
  characterRouter.get("/:login", characterController.getAllCharInLogin)
  characterRouter.post("/", characterController.tradeCoins)
