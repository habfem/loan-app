import express from "express";
import {
  addBankAccount,
  getUserBankAccounts,
  updateBankAccount,
  deleteBankAccount,
} from "../controllers/bank.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Add a new bank account
router.post("/", verifyToken, addBankAccount);

// Get all bank accounts for a user
router.get("/user/:userId", verifyToken, getUserBankAccounts);

// Update a bank account
router.put("/:id", verifyToken, updateBankAccount);

// Delete a bank account
router.delete("/:id", verifyToken, deleteBankAccount);

export default router;