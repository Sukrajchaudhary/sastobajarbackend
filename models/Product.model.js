const mongoose = require("mongoose");
const { Schema } = mongoose;
const productSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
   default:1
  },
  stock: {
    type: Number,
    required: true,
    max: [100, "Stocks less then 100"],
    min: [1, "at leat one stock is required"],
  },
  brand: {
    type: String,
    
  },
  category: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: true,
  },
});


exports.Product = mongoose.model("Product", productSchema);
