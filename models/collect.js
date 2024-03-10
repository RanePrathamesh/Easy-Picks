import mongoose, { Schema, model, models } from 'mongoose';

const visitPageSchema = new mongoose.Schema({
    route: {
      type: String,
      required: true,
    },
    noOfVisit: {
      type: Number,
      required: true,
    }
  });
const clickedProductSchema = new mongoose.Schema({
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    index:[{
        position:{
            type:Number,
            required:true
        },
        filter:{
            type:String,
        },
        clickTime:{
          type:Date,
          required:true
        }
    }],

    productPageUrl:{
      type:String,
      required:true
    }
  });

const collectSchema = new Schema({
    visitId: { type: String, unique: true, required: true },
    visitpages: {
        type: [visitPageSchema],
        required: true
    },
    visiterIp: {
        type: String,
    },
    entryTime: {
        type:Date,
        default:Date.now()
    },
    productClicked:{
        type:[clickedProductSchema]
    }
});

const Collect = models.collect || model('collect', collectSchema);
export default Collect;