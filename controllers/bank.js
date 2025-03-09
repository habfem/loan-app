import Bank from "../models/Bank.js";
import { createError } from "../utils/error.js";

// Add a new bank account
export const addBankAccount = async (req, res, next) => {
  try {
    const { user, bankName, accountNumber, accountType } = req.body;

    // Check if the account number already exists for the user
    const existingBankAccount = await Bank.findOne({ user, accountNumber });
    if (existingBankAccount) {
      return next(createError(400, "Bank account with this account number already exists for the user."));
    }

    const newBankAccount = new Bank({
      user,
      bankName,
      accountNumber,
      accountType,
    });

    await newBankAccount.save();
    res.status(201).json(newBankAccount);
  } catch (err) {
    next(err);
  }
};

// Get all bank accounts for a user
export const getUserBankAccounts = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const bankAccounts = await Bank.find({ user: userId });
    res.status(200).json(bankAccounts);
  } catch (err) {
    next(err);
  }
};

// Update a bank account
export const updateBankAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedBankAccount = await Bank.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedBankAccount);
  } catch (err) {
    next(err);
  }
};

// Delete a bank account
export const deleteBankAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Bank.findByIdAndDelete(id);
    res.status(200).json("Bank account has been deleted.");
  } catch (err) {
    next(err);
  }
};