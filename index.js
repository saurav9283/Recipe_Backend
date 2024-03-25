import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv"
import {userRouter} from "./src/routes/users.js"
import { recipeRouter } from "./src/routes/recipees.js";
dotenv.config();
const app=express();
const port = process.env.PORT || 8080
app.use(express.json());
app.use(cors());
app.get('/', function (req, res) {
    res.send('Backend API Connected!');
 })
app.use("/auth",userRouter);
app.use("/recipes",recipeRouter);
const connect = async () => {
    try {
      await mongoose.connect(process.env.MongoURL);
      console.log("Connected To MongoDB.");
    } catch (error) {
      throw error;
    }
  };
connect();
 
app.listen(port,()=>{console.log("Server Started at "+port);});