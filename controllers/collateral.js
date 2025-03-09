import Collateral from "../models/Collateral.js";
import { createError } from "../utils/error.js";

// Create a new collateral asset
export const createCollateral = async (req, res, next) => {
  try {
    const { user, assetType, assetDescription, assetValue } = req.body;

    // Check if the user already has a collateral with the same description
    const existingCollateral = await Collateral.findOne({
      user,
      assetDescription,
    });
    if (existingCollateral) {
      return next(createError(400, "Collateral with this description already exists for the user."));
    }

    const newCollateral = new Collateral({
      user,
      assetType,
      assetDescription,
      assetValue,
      isUsed: false, // Default to false
    });

    await newCollateral.save();
    res.status(201).json(newCollateral);
  } catch (err) {
    next(err);
  }
};

// Get all collateral assets for a user
export const getUserCollateral = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const collateral = await Collateral.find({ user: userId });
    res.status(200).json(collateral);
  } catch (err) {
    next(err);
  }
};

// Update a collateral asset
export const updateCollateral = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedCollateral = await Collateral.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCollateral);
  } catch (err) {
    next(err);
  }
};

// Delete a collateral asset
export const deleteCollateral = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Collateral.findByIdAndDelete(id);
    res.status(200).json("Collateral has been deleted.");
  } catch (err) {
    next(err);
  }
};