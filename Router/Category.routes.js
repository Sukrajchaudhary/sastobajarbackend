const express=require("express");
const router=express.Router();
const {getAllCategory}=require("../Controllers/Category.controllers");
router.get("/category",getAllCategory)


exports.router=router