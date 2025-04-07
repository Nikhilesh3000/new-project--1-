import express from "express"
import {
  addClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
  searchClients,
} from "../controllers/client_dataController.js"

const router = express.Router()

router.post("/", addClient)
router.get("/", getAllClients)
router.get("/search/:term", searchClients)
router.get("/:id", getClientById)
router.put("/:id", updateClient)
router.delete("/:id", deleteClient)

export default router
