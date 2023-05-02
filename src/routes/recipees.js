import {
    RecipeModel
} from "../models/recipees.js";
import { UserModel } from "../models/users.js";
import express from "express";

import { verifyToken } from "./users.js";
const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const response = await RecipeModel.find({});
        res.json(response);
    } catch (error) {
        return res.json(error);
    }
});

router.put("/", verifyToken,async (req, res) => {
     
    try {
    const recipe=await RecipeModel.findById(req.body.recipeID);
    const user=await UserModel.findById(req.body.userID);
    
    user.savedRecipe.push(recipe); 
    await user.save();
    res.json({savedRecipe:user.savedRecipe})
    } catch (error) {
        return res.json(error);
    }
});

router.post("/createRecipe",verifyToken, async (req, res) => {
    

    const recipe = new RecipeModel(req.body);
    try {
       const response= await recipe.save();
       res.json({message:"success"});
    } catch (error) {
        return res.json({message:"error"});
    }
});

router.get("/savedRecipe/ids/:userID" ,async(req,res)=>{
 try {
    const user=await UserModel.findById(req.params.userID);
    res.json({savedRecipe:user?.savedRecipe});
 } catch (error) {
    res.json(error);
 }
});

router.get("/savedRecipe/:userID" ,async(req,res)=>{
    try {
       const user=await UserModel.findById(req.params.userID);
      const savedRecipe=await RecipeModel.find({
        _id: {$in: user.savedRecipe}
      });
      res.json(savedRecipe);
      
    } catch (error) {
       res.json(error);
    }
   });
export {
    router as recipeRouter
};