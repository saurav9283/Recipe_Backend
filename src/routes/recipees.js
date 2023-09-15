import { RecipeModel } from "../models/recipees.js";
import { UserModel } from "../models/users.js";
import express from "express";

const router = express.Router();
router.post("/", async (req, res) => {
  const recipe = new RecipeModel(req.body);
  try {
    const response = await recipe.save();
    res.json({ message: "success" });
  } catch (error) {
    return res.json({ message: "error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await RecipeModel.find({});
    res.json(response);
  } catch (error) {
    return res.json(error);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const response = await RecipeModel.findById(req.params.id);
    res.json(response);
  } catch (error) {
    return res.json(error);
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    console.log(req.body)
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findByIdAndUpdate(id , {$push : {savedRecipe:recipe} }, {new:true});

    res.json(user);
  } catch (error) {
    return res.json(error);
  }
});



// router.get("/savedRecipe/ids/:userID", async (req, res) => {
//   try {
//     const user = await UserModel.findById(req.params.userID);
//     res.json({ savedRecipe: user?.savedRecipe });
//   } catch (error) {
//     res.json(error);
//   }
// });

router.get("/savedRecipe/:userID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userID);
    const savedRecipe = await RecipeModel.find({
      _id: { $in: user.savedRecipe },
    });
    res.json(savedRecipe);
  } catch (error) {
    res.json(error);
  }
});

router.put("/remove/:userId", async (req, res) => {
  try {
    const id = req.params.userId;
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findByIdAndUpdate(id , {$pull : {savedRecipe:req.body.recipeID} }, {new:true});

    res.json(user);
  } catch (error) {
    return res.json(error);
  }
});


export { router as recipeRouter };
