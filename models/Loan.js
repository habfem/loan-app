import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  collateral: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Collateral',
    required: true,
  },
  loanAmount: {
    type: Number,
    required: true,
  },
  interestRate: {
    type: Number,
  },
  amountPaid: {
    type: Number,
  },
  balance: {
    type: Number,
  },
  tenor: {
    type: Number,
  },
  loanee: {
    type: String,
    required: true,
  },
  nationalId: {
    type: String,
    unique: true,
  },
  bankVerificationNumber: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Settled'],
    default: 'Pending',
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Loan", loanSchema);
