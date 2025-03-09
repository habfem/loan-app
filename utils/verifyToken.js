import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization.split(" ")[1];
  if (!token) {
    return next(
      createError(401, "You are not authenticated: Login or Signup!")
    );
  }
  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "You are not authorized: Login or Signup!"));
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};
