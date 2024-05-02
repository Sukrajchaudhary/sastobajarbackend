const { Product } = require("../models/Product.model");
const { default: mongoose } = require("mongoose");
const { uploadOnCloudinary } = require("../utils/cloudinary");
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, discountPercentage, stock, category } =
      req.body;
    const { id } = req.user;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    const imagesLocalPath1 = req.files?.image1[0]?.path;
    const imagesLocalPath2 = req.files?.image2[0]?.path;
    const imagesLocalPath3 = req.files?.image3[0]?.path;
    if (!thumbnailLocalPath) {
      return res.status(400).json({
        message: "Thumbnail is required",
      });
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    const images1 = await uploadOnCloudinary(imagesLocalPath1);
    const images2 = await uploadOnCloudinary(imagesLocalPath2);
    const images3 = await uploadOnCloudinary(imagesLocalPath3);
    const images = [images1?.url, images2?.url, images3?.url];
    console.log(images);
    const product = new Product({
      ...req.body,
      title: title,
      description: description,
      user: id,
      price: +price,
      discountPercentage: +discountPercentage,
      stock: +stock,
      category: category,
      thumbnail: thumbnail.url || "",
      images: images || "",
    });
    await product.save();
    return res
      .status(200)
      .json({ message: "Product Added SuccessFully", product });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
exports.getProductByID = async (req, res) => {
  try {
    const { id } = req.params;
  

    const product=await Product.findById(id).populate('user')
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    let condition = [
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "owner",
          pipeline: [
            {
              $project: {
                username: 1,
                email: 1,
                OrganizationsName: 1,
                _id: 1,
              },
            },
          ],
        },
      },
    ];
    if (req.query.search) {
      condition.unshift({
        $search: {
          index: "default",
          text: {
            query: req.query.search.toLowerCase(),
            path: {
              wildcard: "*",
            },
          },
        },
      });
    }

    if (req.query.category) {
      condition.unshift({
        $match: {
          category: req.query.category,
        },
      });
    }
    if (req.query.brand) {
      condition.unshift({
        $match: {
          brand: req.query.brand,
        },
      });
    }
    if (req.query._sort && req.query._order) {
      condition.push({
        $sort: {
          [req.query._sort]: Number(req.query._order),
        },
      });
    }

    if (req.query._page && req.query._limit) {
      const pageSize = parseInt(req.query._limit, 10);
      const page = parseInt(req.query._page, 10);
      condition.push(
        {
          $skip: (page - 1) * pageSize,
        },
        { $limit: pageSize }
      );
    }
    const product = await Product.aggregate(condition).exec();
    const total = await Product.countDocuments(condition).exec();
    res.set("X-TOTAL-COUNT", total);
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.getAllUsersProducts = async (req, res) => {
  try {
    const { id } = req.user;
    const product = await Product.find({ user: id }).select("-user");
    if (!product) {
      return res.status(400).json({
        message: "No Product Found",
      });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      message: "Product deleted SuccesFully",
      product,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({
      message: "Product Updated SuccessFully",
      product,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
