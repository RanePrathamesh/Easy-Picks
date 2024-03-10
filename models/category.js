import { Schema, model, models } from 'mongoose';

const categorySchema = new Schema({
  categoryName: { type: String, required: true },
  categoryType: { type: String, require: true },
  categoryLink: { type: String, unique: true, required: true },
  parentCategory: { type: Schema.Types.ObjectId, ref: "Category" },
  status:{type: String, required: true,enum:["pending","running","complete", ],default:"pending"},
  note:{type: String},
  lastUpdated: { type: Date, default: null }, 
});

const Category = models.Category || model("Category", categorySchema);

export default Category;
