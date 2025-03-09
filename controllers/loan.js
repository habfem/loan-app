import LoanApplication from "../models/Loan.js";
import { createError } from "../utils/error.js";

// Create a new loan application
export const createLoanApplication = async (req, res, next) => {
  try {
    const { user, collateral, loanAmount } = req.body;

    // Check if the collateral is already used in another loan application
    const existingLoan = await LoanApplication.findOne({ collateral });
    if (existingLoan) {
      return next(createError(400, "This collateral is already used in another loan application."));
    }

    const newLoanApplication = new LoanApplication({
      user,
      collateral,
      loanAmount,
      status: "Pending", // Default status
    });

    await newLoanApplication.save();

    // Mark the collateral as used
    await Collateral.findByIdAndUpdate(collateral, { isUsed: true });

    res.status(201).json(newLoanApplication);
  } catch (err) {
    next(err);
  }
};

// Get all loan applications for a user
export const getUserLoans = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const loans = await LoanApplication.find({ user: userId }).populate("collateral");
    res.status(200).json(loans);
  } catch (err) {
    next(err);
  }
};

// Update a loan application (e.g., change status)
export const updateLoanApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedLoan = await LoanApplication.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedLoan);
  } catch (err) {
    next(err);
  }
};

// Delete a loan application
export const deleteLoanApplication = async (req, res, next) => {
  try {
    const { id } = req.params;
    await LoanApplication.findByIdAndDelete(id);
    res.status(200).json("Loan application has been deleted.");
  } catch (err) {
    next(err);
  }
};