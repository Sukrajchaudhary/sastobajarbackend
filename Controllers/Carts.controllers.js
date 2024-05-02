const { default: mongoose } = require("mongoose");
const { Cart } = require("../models/Cart.model");
exports.createCart = async (req, res) => {
  try {
    const { id } = req.user;
    const cart = new Cart({
      prodcutOwner: req.body.productOwner,
      product: req.body.product,
      user: id,
    });
    await cart.save();
    return res.status(200).json({
      message: "Cart Added SuccessFully",
      cart,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.getUserCartItems = async (req, res) => {
  try {
    const { id } = req.user;
    const cart = await Cart.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "prodcutOwner",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                email: 1,
                OrganizationsName: 1,
                address: 1,
                _id: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $project: {
          product: { $arrayElemAt: ["$product", 0] },
          owner: { $arrayElemAt: ["$owner", 0] },
          quantity: 1,
        },
      },
    ]);

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
exports.updateUserCartItems = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const cart = await Cart.findByIdAndUpdate(
      id,
      { $set: { quantity: quantity } },
      { new: true }
    );

    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
exports.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findByIdAndDelete(id);
    return res.status(200).json({
      message: "Items Deleted  Successfully",
      cart,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
