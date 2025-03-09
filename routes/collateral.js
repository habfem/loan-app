import express from "express";
import {
  createCollateral,
  getUserCollateral,
  updateCollateral,
  deleteCollateral,
} from "../controllers/collateral.js";
import { verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// Create a new collateral asset
router.post("/", verifyToken, createCollateral);

// Get all collateral assets for a user
router.get("/user/:userId", verifyToken, getUserCollateral);

// Update a collateral asset
router.put("/:id", verifyToken, updateCollateral);

// Delete a collateral asset
router.delete("/:id", verifyToken, deleteCollateral);

export default router;