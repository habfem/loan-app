import mongoose from "mongoose";

const collateralSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  assetType: {
    type: String,
    required: true,
    enum: ['Real Estate', 'Vehicle', 'Jewelry', 'Other'],
  },
  assetDescription: {
    type: String,
    required: true,
  },
  assetValue: {
    type: Number,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Collateral", collateralSchema);