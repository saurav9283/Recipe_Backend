import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import {
  UserModel
} from "../models/users.js";
const router = express.Router();

router.post('/register', async (req, res) => {
  const {
    name,
    username,
    password
  } = req.body;
  const user = await UserModel.findOne({
    username
  });
  if (user) {
    return res.json({
      message: "User Already Exist!"
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({
    name,
    username,
    password: hashedPassword
  });
  await newUser.save();
  res.json({
    message: "user registered  !"
  });
});

router.post('/login', async (req, res) => {
  const {
    username,
    password
  } = req.body;
  const user = await UserModel.findOne({
    username
  });
  if (!user) {
    return res.json({
      message: "User does not Exist"
    });
  }

  const hPassword = await bcrypt.compare(password, user.password);
  if (!hPassword) {
    return res.json({
      message: "Wrong Password"
    });
  }


  const token = jwt.sign({
    id: user._id
  }, "predator");
  res.json({
    token,
    userID: user._id
  });
});
export {
  router as userRouter
};


export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, "predator", (err) => {
      if (err) return res.sendStatus(403);
      next();
    });

  } else {
    res.sendStatus(401);
  }
};