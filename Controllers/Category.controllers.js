const {Category}=require("../models/Category.model");
exports.getAllCategory=async(_,res)=>{
    try {
       const category= await Category.find();
       return res.status(200).json(category); 
    } catch (error) {
        return res.status(500).json(error.message)
    }
}

