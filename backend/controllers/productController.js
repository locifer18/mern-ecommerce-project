import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js"
import fs from "fs";
import slugify from "slugify";
import braintree from "braintree";
import dotenv from "dotenv";

dotenv.config();

//payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in crearing product",
    });
  }
};

//get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      counTotal: products.length,
      message: "All-Products ",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Erorr in getting products",
      error: error.message,
    });
  }
};
// get single product
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");

    // Check if product exists
    if (!product || !product.photo || !product.photo.data) {
      return res.status(404).send({
        success: false,
        message: "Product photo not found",
      });
    }

    res.set("Content-Type", product.photo.contentType);
    return res.status(200).send(product.photo.data);
  } catch (error) {
    console.error("Error in productPhotoController:", error);
    res.status(500).send({
      success: false,
      message: "Error while fetching product photo",
      error: error.message,
    });
  }
};


//delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //alidation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Updte product",
    });
  }
};

// filters
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const products = await productModel.find(args);
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Filtering Products",
      error,
    });
  }
};

// product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};

// product list base on page
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
      
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error in per page ctrl",
      error,
    });
  }
};

// search product
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const resutls = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json(resutls);
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error In Search Product API",
      error,
    });
  }
};

// similar products
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "error while geting related product",
      error,
    });
  }
};

// get prdocyst by catgory
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    res.status(200).send({
      success: true,
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error,
      message: "Error While Getting products",
    });
  }
};

//payment gateway api
//token
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log("Token controller error:", error);
    res.status(500).send({ error: error.message });
  }
};

//payment
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    
    // Validate inputs
    if (!nonce) {
      return res.status(400).send({ error: "Payment nonce is required" });
    }
    
    if (!cart || cart.length === 0) {
      return res.status(400).send({ error: "Cart is empty" });
    }
    
    // Calculate total amount and format products according to schema
    let totalAmount = 0;
    const formattedProducts = cart.map(item => {
      const price = Number(item?.price) || 0;
      const quantity = Number(item?.quantity) || 1;
      totalAmount += price * quantity;
      
      return {
        product: item._id,  // Product ObjectId reference
        quantity: quantity,
        price: price
      };
    });
    
    // Validate total amount
    if (totalAmount <= 0) {
      return res.status(400).send({ error: "Invalid total amount" });
    }
    
    // // Check for problematic sandbox amounts
    // const problematicAmounts = [2000, 2001, 2002, 2003, 2004, 2005, 2544];
    // if (process.env.NODE_ENV !== 'production' && problematicAmounts.includes(Math.floor(totalAmount))) {
    //   console.warn(`Warning: Amount ${totalAmount} may be declined in sandbox environment`);
    // }
    
    // Create payment with Braintree with additional options for better success rate
    let newTransaction = await gateway.transaction.sale({
      amount: totalAmount.toFixed(2),
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
      // Add customer info if available to reduce decline rate
      ...(req.user?.email && {
        customer: {
          email: req.user.email,
          firstName: req.user.name?.split(' ')[0] || 'Customer',
          lastName: req.user.name?.split(' ')[1] || 'User'
        }
      })
    });
    

    
    if (newTransaction.success) {
      // Create order in database with correct schema format
      const order = await new orderModel({
        products: formattedProducts,  // Use formatted products array
        payment: {
          id: newTransaction.transaction.id,
          status: newTransaction.transaction.status,
          amount: newTransaction.transaction.amount,
          processorResponseCode: newTransaction.transaction.processorResponseCode,
          processorResponseText: newTransaction.transaction.processorResponseText,
          createdAt: newTransaction.transaction.createdAt
        },
        buyer: req.user._id,
        status: "Not Process",
        totalAmount: totalAmount
      }).save();
      
      res.json({ 
        ok: true, 
        orderId: order._id,
        transactionId: newTransaction.transaction.id 
      });
    } else {
      // Enhanced error handling for declined payments
      const errorMessage = newTransaction.message;
      const processorResponse = newTransaction.transaction?.processorResponseText;
      const gatewayRejection = newTransaction.transaction?.gatewayRejectionReason;
      
      console.error("Payment Declined:", errorMessage);      
      // Send more specific error message to frontend
      let userFriendlyMessage = "Payment was declined. Please try a different payment method.";
      
      if (processorResponse?.includes("Insufficient Funds")) {
        userFriendlyMessage = "Payment declined due to insufficient funds.";
      } else if (processorResponse?.includes("Do Not Honor")) {
        userFriendlyMessage = "Payment declined by your bank. Please contact your bank or try a different card.";
      } else if (gatewayRejection) {
        userFriendlyMessage = "Payment was rejected. Please check your payment details.";
      }
      
      res.status(400).json({ 
        ok: false,
        error: userFriendlyMessage,
        details: {
          processorResponse,
          gatewayRejection,
          code: newTransaction.transaction?.processorResponseCode
        }
      });
    }
  } catch (error) {
    console.log("Payment processing error:", error);
    res.status(500).send({
      ok: false,
      error: "Error in payment processing",
      message: error.message
    });
  }
};