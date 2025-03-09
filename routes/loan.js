import express from "express";
import {
  createLoanApplication,
  getUserLoans,
  updateLoanApplication,
  deleteLoanApplication,
} from "../controllers/loan.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Create a new loan application
router.post("/", verifyToken, createLoanApplication);

// Get all loan applications for a user
router.get("/user/:userId", verifyToken, getUserLoans);

// Update a loan application
router.put("/:id", verifyToken, updateLoanApplication);

// Delete a loan application
router.delete("/:id", verifyToken, deleteLoanApplication);

export default router;