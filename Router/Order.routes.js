const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../Middleware/auth.middleware");
const {
  createOrders,
  getOreders,
  updateOrders,
  
} = require("../Controllers/Orders.controllers");
router
  .post("/order", verifyJWT, createOrders)
  .get("/getOrders", verifyJWT, getOreders)
  .patch("/updateOrder/:id", updateOrders)

exports.router = router;
