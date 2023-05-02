import mongoose from "mongoose";
const RecipeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ingredient: [{ type: String, required: true }],
  instruction: { type: String, required: true },
  imageURL: { type: String, required: true},
  cookingTime: { type: Number, required: true},
  userOwner: { type: mongoose.Schema.Types.ObjectId, ref:"users", require:true},
});
export const RecipeModel = mongoose.model("recipe", RecipeSchema);
 