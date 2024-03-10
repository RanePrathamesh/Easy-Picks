import mongoose, {Schema, model, models} from 'mongoose';

const productSchema = new Schema({
  productID: { type: String, required: true },
  title: { type: String, required: true },
  brand: String,
  mainImageSrc: String,
  savingsPercentage: Number,
  priceToPay: Number,
  mrp: Number,
  rating: Number,
  reviewCount: Number,
  description: String,
  availability: String,
  warrantyInfo: String,
  replacementInfo: String,
  seller: String,
  url: String,
  soldInPastMonth: Number,
  priceHistory:[{
    priceToPay:{
      type: Number,
      require:true,
    },
    mrp:{
      type: Number
    },
    timeStamp:{
      type: Date,
      require:true,
      default:Date.now()
    }
  }],
  reviews:[],
  variants: {type: Array},
  personalizedRating:{
    type: Number
  },
  category: { type:mongoose.Schema.Types.ObjectId, ref: "Category" },
});

productSchema.index({ productID: 1, category: 1 }, { unique: true });

const Product = models.Product || model('Product',productSchema);
export default Product;