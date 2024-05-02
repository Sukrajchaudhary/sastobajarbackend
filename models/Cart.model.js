const mongoose = require("mongoose");
const { Schema } = mongoose;
const cartSchemas = new Schema({
  quantity: {
    type: Number,
    default: 1,
  },
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  prodcutOwner: { type: Schema.Types.ObjectId, ref: "Users", required: true }
});

exports.Cart = mongoose.model("carts", cartSchemas);
