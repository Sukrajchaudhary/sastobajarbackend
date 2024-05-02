const { Order } = require("../models/Order.model");

exports.createOrders = async (req, res) => {
  try {
    console.log(req.body);
    const { id } = req.user;
    const {
      items,
      user,
      totalAmount,
      paymentmethod,
      totalItems,
      selectedAddress,
    } = req.body;

    if (
      [
        items,
        user,
        totalAmount,
        paymentmethod,
        totalItems,
        selectedAddress,
      ].some((field) => !field || field === "")
    ) {
      return res
        .status(400)
        .json({ message: "Shipping Information is Missing." });
    }
    const order = new Order({
      ...req.body,
      user: id,
    });
    await order.save();
    return res.status(200).json({
      message: "Order palced SuccessFully",
      order,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.getOreders = async (req, res) => {
  try {
    const { id } = req.user;
    // const order = await Order.aggregate([
    //   {
    //     $match: {
    //       productOwner: new mongoose.Types.ObjectId(id),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "user",
    //       foreignField: "_id",
    //       as: "user",
    //       pipeline: [
    //         {
    //           $project: {
    //             username: 1,
    //             email: 1,
    //             addresses: 1,
    //             OrganizationsName: 1,
    //           },
    //         },
    //       ],
    //     },
    //   },
    // ]);
    const order = await Order.find({ user: id });
    if (!order) {
      return res.status(200).json({
        message: "No orders Yet",
      });
    }
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

exports.updateOrders = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).json({
      message: "Update SuccessFully",
      order,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
