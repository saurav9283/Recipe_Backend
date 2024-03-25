import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { UserModel } from "../models/users.js";
import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config();

const router = express.Router();
// const maxAge = 60;
const secretKey = "saurav";


// this transpporter is used as a transporter to send mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// this  function is used to send mail
async function sendEmail(to,subject,text){
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,subject,text
    });
    console.log("Email send suceddful");
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

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
  //Sending registration email
  await sendEmail(username, 'Registration Successful', 'Welcome to our platform! You have successfully registered.');
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
