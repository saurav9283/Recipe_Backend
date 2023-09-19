import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/users.js";

const router = express.Router();
// const maxAge = 60;
const secretKey = "saurav";

function generateToken(userId) {
  return jwt.sign(
    {
      id: userId,
    },
    secretKey,
    {
      expiresIn: '1m',
    }
  );
}

router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;
  const user = await UserModel.findOne({username});
  if (user) {
    return res.json({
      message: "User Already Exist!",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({
    name,
    username,
    password: hashedPassword,
  });
  await newUser.save();
  res.json({
    message: "user registered",
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // console.log("Received username:", username);
  const user = await UserModel.findOne({username});

  if (!user) {
    return res.json({
      message: "User does not Exist",
    });
  }

  const hPassword = await bcrypt.compare(password, user.password);
  if (!hPassword) {
    return res.json({
      message: "Wrong Password",
    });
  }

  const token = generateToken(user._id);

  res.json({
    token,
    userID: user._id,
  });
});

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secretKey, (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export { router as userRouter };
