import express from "express";
import {
  createCollateral,
  getUserCollateral,
  updateCollateral,
  deleteCollateral,
  getCollateralById,
  getCollaterals,
} from "../controllers/collateral.js";
import { Multer, uploadImages } from "../middlewares/uploadFile.js";

const router = express.Router();

router.post("/", Multer.array("images"), uploadImages, createCollateral);
router.get("/user/:userId", getUserCollateral);
router.get("/", getCollaterals)
router.get("/:id", getCollateralById)
router.put("/:id", Multer.array("images"), uploadImages, updateCollateral);
router.delete("/:id", deleteCollateral);

export default router;