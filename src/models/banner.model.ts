import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  _id: mongoose.Schema.Types.ObjectId;
  title: string;
  category: string;
  price: number;
  image: string;
}

const bannerSchema = new Schema({
  title: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false ,
  },
  price: {
    type: Number,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

// Create the User model
const Banner = mongoose.model<IBanner>("Banner", bannerSchema);

export default Banner;
