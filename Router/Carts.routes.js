const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../Middleware/auth.middleware");
const {
  createCart,
  getUserCartItems,
  updateUserCartItems,
  deleteCartItem
} = require("../Controllers/Carts.controllers");

router
  .post("/AddttoCart",verifyJWT, createCart)
  .get("/getuserCart",verifyJWT, getUserCartItems)
  .patch("/updatecart/:id",verifyJWT, updateUserCartItems).
  delete("/deleteItem/:id",verifyJWT,deleteCartItem)

exports.router = router;
