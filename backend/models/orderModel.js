import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [{
      product: {
        type: mongoose.ObjectId,
        ref: "Products",
      },
      quantity: {
        type: Number,
        default: 1
      },
      price: Number
    }],
    totalAmount: {
      type: Number,
      required: true
    }, 
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancelled"]
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);