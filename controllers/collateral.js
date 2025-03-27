import Collateral from "../models/Collateral.js";
import { createError } from "../utils/error.js";
import { cloudinaryDeleteImg } from "../utils/cloudinary.js";

// Create a new collateral asset
export const createCollateral = async (req, res, next) => {
  const newRoom = new Collateral({
    ...req.body,
    images: req.images,
  });
  try {
        const savedCollateral = await newRoom.save();
    res.status(200).json(savedCollateral);
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

export const getCollaterals = async (req, res, next) => {
  try {
      const collaterals = await Collateral.find(req.query);
      res.status(200).json(collaterals);
    } catch (err) {
      next(err);
    }
}

// Update a collateral asset
export const updateCollateral = async (req, res, next) => {
  try {
    let updatedData = req.body;
    const { id } = req.params;

    // Parse previousImages if provided
    const parsedPreviousImages = req?.body?.previousImages?.map((imageString) =>
      typeof imageString === 'string' ? JSON.parse(imageString) : imageString
    );

    const collateral = await Collateral.findById(id);
    if (!collateral) {
      return next(createError(404, "Collateral not found"));
    }

    const existingImages = collateral?.images || [];

    // Handle image deletion if previousImages is provided
    if (parsedPreviousImages) {
      const removedImages = existingImages.filter(
        (existingImage) =>
          !parsedPreviousImages.some(
            (previousImage) => previousImage === existingImage
          )
      );

      // Delete removed images from cloud storage
      for (const removedImage of removedImages) {
        const publicId = removedImage.split("/").pop().split(".")[0];
        await cloudinaryDeleteImg(publicId);
      }

      // Update the images array to exclude removed images
      updatedData.images = existingImages.filter(
        (existingImage) =>
          !removedImages.some((removedImage) => removedImage === existingImage)
      );
    } else {
      updatedData.images = existingImages; // Keep existing images if no removal is requested
    }

    // If there are new images uploaded, add them to the images array
    if (req.images && Array.isArray(req.images)) {
      updatedData.images = [...req.images, ...updatedData.images];
    }

    // Prevent updating these fields
    delete updatedData.previousImages;
    delete updatedData.user;
    delete updatedData.isUsed;

    const updatedCollateral = await Collateral.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedCollateral);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

// Get Collateral By :id
export const getCollateralById = async (req, res, next) => {
  try {
    const { id } = req.params; 
    const collateral = await Collateral.findById(id);
    if (!collateral) {
      return res.status(404).json({ message: "Collateral not found" });
    }
    res.status(200).json(collateral);
  } catch (err) {
    next(err);
  }
};

// Delete a collateral asset
export const deleteCollateral = async (req, res, next) => {
  try {
    const collateralData = await Collateral.findById(req.params.id);
    const imagesToDelete = collateralData.images;
    for (const image of imagesToDelete) {
      const publicId = image.split("/").pop().split(".")[0];
      await cloudinaryDeleteImg(publicId);
    }
    const collateral = await Collateral.findByIdAndDelete(req.params.id);
    res.status(200).json(`${collateral.assetName} has been deleted.`);
  } catch (err) {
    next(err);
  }
};