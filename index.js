require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { connectToDb } = require("./Db/connection");
const app = express();
connectToDb();
//
const userRouter = require("./Router/users.routes");
const productRouter = require("./Router/Product.routes");
const cartRouter = require("./Router/Carts.routes");
const orderRouter = require("./Router/Order.routes");
const categoryRouter = require("./Router/Category.routes");
// middleware
app.use(cors({
  exposedHeaders:"X-TOTAL-COUNT",
  origin:true,
  credentials:true
}));
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: "keyboard cat", cookie: { maxAge: 60000 } }));
//
app.use("/api", userRouter.router);
app.use("/api", productRouter.router);
app.use("/api", cartRouter.router);
app.use("/api", orderRouter.router);
app.use("/api", categoryRouter.router);

app.listen(process.env.PORT, () => {
  console.log(`App is Running on Port:http://localhost:${process.env.PORT}`);
});
