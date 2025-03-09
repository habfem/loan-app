import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mailchimp from "@mailchimp/mailchimp_marketing";

dotenv.config();

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: process.env.MAILCHIMP_API_SERVER,
});



export const register = async (req, res, next) => {
  try {
    const findUser = await User.findOne({ email: req.body.email });
    if (findUser) return next(createError(404, "Email does exist"));

    let hash; 

    if (req.body.password) {
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(req.body.password, salt);
    }

    const user = new User({
      ...req.body,
      ...(hash && { password: hash }),
      ...(req.image && { img: req.image }),
    });
    await user.save();
    res.status(200).send({ user });
  } catch (err) {
    next(err);
  }
};


export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "Email does not exist"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT,
      { expiresIn: "2d" }
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      })
      .status(200)
      .json({ user, token });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
    console.log(err);
  }
};

export const subscribe = async (req, res) => {
  const { email } = req.body;
  try {
    const response = await mailchimp.lists.addListMember(
      process.env.MAILCHIMP_AUDIENCE_ID,
      {
        email_address: email,
        status: "subscribed",
      }
    );

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: JSON.parse(error?.response?.text) });
    console.log(error?.response?.text);
  }
};