import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import categoryModel from "../models/categoryModel.js";
import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//register sign
export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body;
        //validation
        if (!name) {
            return res.status(400).send({ message: "Name is Required" });
        }
        if (!email) {
            return res.status(400).send({ message: "Email is Required" });
        }
        if (!password) {
            return res.status(400).send({ message: "Password is Required" });
        }
        if (!phone) {
            return res.status(400).send({ message: "Phone is Required" });
        }
        if (!address) {
            return res.status(400).send({ message: "Address is Required" });
        }
        if (!answer) {
            return res.status(400).send({ message: "Question is Required" });
        }

        //check user
        const existingUser = await userModel.findOne({ email })

        //exisiting user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please login",
            })
        }

        //register user
        const hashedPassword = await hashPassword(password);

        //save
        const user = await new userModel({ name, email, phone, address, answer, password: hashedPassword }).save();
        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Register Controller",
            error
        })
    }
}

//login
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: "Email and password are required"
            });
        }

        //check user
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).send({
                success: false,
                message: "Invalid password"
            })
        }

        // Update last login time
        user.lastLogin = new Date();
        await user.save();

        //token
        const token = JWT.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).send({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                profilePicture: user.profilePicture,
                isVerified: user.isVerified,
                shippingAddresses: user.shippingAddresses
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error during login",
            error: error.message
        })
    }
}

//test
export const testController = async (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
}

//forgot password
export const forgotPasswordController = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        //validation
        if (!email) {
            return res.status(400).send({ message: "Email is Required" });
        }
        if (!answer) {
            return res.status(400).send({ message: "Question is Required" });
        }
        if (!newPassword) {
            return res.status(400).send({ message: "New Password is Required" });
        }

        //check user
        const user = await userModel.findOne({ email, answer });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found or answer is incorrect"
            })
        }
        //hash password
        const hashedPassword = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashedPassword }, { new: true });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully",
            user: {
                email: user.email,
                newPassword: user.password,
                answer: user.answer
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Somthing went wrong",
            error
        })
    }
}

//update profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone, profilePicture } = req.body;
        const user = await userModel.findById(req.user._id);

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Password validation
        if (password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password should be at least 6 characters long"
            });
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;

        // Update user profile
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
                profilePicture: profilePicture || user.profilePicture,
                lastLogin: new Date()
            },
            { new: true }
        ).select("-password");

        res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating profile",
            error: error.message
        });
    }
};

// Add shipping address
export const addShippingAddressController = async (req, res) => {
    try {
        const { name, street, city, state, postalCode, country, isDefault } = req.body;

        // Validate required fields
        if (!name || !street || !city || !state || !postalCode || !country) {
            return res.status(400).send({
                success: false,
                message: "All address fields are required"
            });
        }

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        // Create new address object
        const newAddress = {
            name,
            street,
            city,
            state,
            postalCode,
            country,
            isDefault: isDefault || false
        };

        // If this is the default address, unset any existing default
        if (newAddress.isDefault) {
            user.shippingAddresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        // If this is the first address, make it default
        if (user.shippingAddresses.length === 0) {
            newAddress.isDefault = true;
        }

        // Add the new address
        user.shippingAddresses.push(newAddress);
        await user.save();

        res.status(201).send({
            success: true,
            message: "Shipping address added successfully",
            addresses: user.shippingAddresses
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error adding shipping address",
            error: error.message
        });
    }
};

// Update shipping address
export const updateShippingAddressController = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { name, street, city, state, postalCode, country, isDefault } = req.body;

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        // Find the address to update
        const addressIndex = user.shippingAddresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return res.status(404).send({
                success: false,
                message: "Address not found"
            });
        }

        // Update address fields
        if (name) user.shippingAddresses[addressIndex].name = name;
        if (street) user.shippingAddresses[addressIndex].street = street;
        if (city) user.shippingAddresses[addressIndex].city = city;
        if (state) user.shippingAddresses[addressIndex].state = state;
        if (postalCode) user.shippingAddresses[addressIndex].postalCode = postalCode;
        if (country) user.shippingAddresses[addressIndex].country = country;

        // Handle default address
        if (isDefault) {
            // Unset any existing default
            user.shippingAddresses.forEach(addr => {
                addr.isDefault = false;
            });

            // Set this address as default
            user.shippingAddresses[addressIndex].isDefault = true;
        }

        await user.save();

        res.status(200).send({
            success: true,
            message: "Shipping address updated successfully",
            addresses: user.shippingAddresses
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error updating shipping address",
            error: error.message
        });
    }
};

// Delete shipping address
export const deleteShippingAddressController = async (req, res) => {
    try {
        const { addressId } = req.params;

        const user = await userModel.findById(req.user._id);

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        // Find the address to delete
        const addressIndex = user.shippingAddresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            return res.status(404).send({
                success: false,
                message: "Address not found"
            });
        }

        // Check if it's the default address
        const isDefault = user.shippingAddresses[addressIndex].isDefault;

        // Remove the address
        user.shippingAddresses.splice(addressIndex, 1);

        // If it was the default and there are other addresses, set a new default
        if (isDefault && user.shippingAddresses.length > 0) {
            user.shippingAddresses[0].isDefault = true;
        }

        await user.save();

        res.status(200).send({
            success: true,
            message: "Shipping address deleted successfully",
            addresses: user.shippingAddresses
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error deleting shipping address",
            error: error.message
        });
    }
};

// Create Order Controller
export const createOrderController = async (req, res) => {
    try {
        const { cart, payment } = req.body;

        // Validate cart
        if (!cart || cart.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Cart is empty"
            });
        }

        // Calculate total amount - handle different possible cart structures
        let totalAmount = 0;

        const processedProducts = cart.map(item => {
            // Handle different possible cart item structures
            let itemPrice = 0;
            let itemQuantity = item.quantity || 1;

            // Check for different price property names
            if (item.price) {
                itemPrice = item.price;
            } else if (item.product && item.product.price) {
                itemPrice = item.product.price;
            } else if (item.productPrice) {
                itemPrice = item.productPrice;
            } else {
                console.error("No price found for item:", item);
                throw new Error(`Price not found for product: ${item.name || item._id}`);
            }

            // Add to total
            totalAmount += itemPrice * itemQuantity;

            // Return processed product for order
            return {
                product: item.product || item._id || item.productId,
                quantity: itemQuantity,
                price: itemPrice
            };
        });

        // Ensure totalAmount is a valid number
        if (isNaN(totalAmount) || totalAmount <= 0) {
            return res.status(400).send({
                success: false,
                message: "Invalid total amount calculated",
                debug: { totalAmount, cart }
            });
        }

        // Create new order with explicitly set totalAmount
        const orderData = {
            products: processedProducts,
            totalAmount: totalAmount,
            payment: payment || {},
            buyer: req.user._id,
        };

        const order = new orderModel(orderData);
        await order.save();

        res.status(201).send({
            success: true,
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.error("Create Order Error:", error);
        res.status(500).send({
            success: false,
            message: "Failed to place order",
            error: error.message,
        });
    }
};

//orders
export const ordersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate({
                path: "products.product",
                select: "name description price photo slug category"
            }).populate("buyer", "name email")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching orders",
            error: error.message,
        });
    }
};

// Get single order
export const getSingleOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await orderModel
            .findById(orderId)
            .populate('products.product', 'name description price photo')
            .populate("buyer", "name email phone address");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if the order belongs to the requesting user or if user is admin
        if (order.buyer._id.toString() !== req.user._id.toString() && req.user.role !== 1) {
            return res.status(403).send({
                success: false,
                message: "Unauthorized access"
            });
        }

        res.json({success: true,order});
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching order details",
            error: error.message
        });
    }
};

//all orders
export const getAllOrdersController = async (req, res) => {
    try {
        // Add filtering options
        const { status } = req.query;
        const filter = {};

        if (status && status !== 'all') {
            filter.status = status;
        }

        const orders = await orderModel
            .find(filter)
            .populate("products", "-photo")
            .populate("buyer", "name email phone")
            .sort({ createdAt: -1 });

        res.status(200).send({
            success: true,
            orders,
            count: orders.length
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting all orders",
            error: error.message
        });
    }
}

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).send({
                success: false,
                message: "Status is required"
            });
        }

        // Find the order first
        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.status(404).send({
                success: false,
                message: "Order not found"
            });
        }

        // Update the order
        const updateData = { status };

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        ).populate("buyer", "name email");

        res.status(200).send({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating order status",
            error: error.message,
        });
    }
};

// Get Admin dashboard statistics
export const getDashboardStatsController = async (req, res) => {
    try {
        // Get basic counts with error handling
        const [totalUsers, totalProducts, totalCategories, totalOrders] = await Promise.allSettled([
            userModel.countDocuments(),
            productModel.countDocuments(),
            categoryModel.countDocuments(),
            orderModel.countDocuments()
        ]);

        // Extract values or default to 0 if failed
        const counts = {
            totalUsers: totalUsers.status === 'fulfilled' ? totalUsers.value : 0,
            totalProducts: totalProducts.status === 'fulfilled' ? totalProducts.value : 0,
            totalCategories: totalCategories.status === 'fulfilled' ? totalCategories.value : 0,
            totalOrders: totalOrders.status === 'fulfilled' ? totalOrders.value : 0
        };

        let totalRevenue = 0;
        try {
            const orders = await orderModel.find({}, 'totalAmount');
            totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
        } catch (error) {
            console.error("Error calculating revenue:", error);
        }

        let recentOrders = [];
        try {
            recentOrders = await orderModel
                .find()
                .populate("buyer", "name email")
                .populate("products.product", "name price")
                .sort({ createdAt: -1 })
                .limit(5);
        } catch (error) {
            console.error("Error fetching recent orders:", error);
        }

        let lowStockProducts = [];
        try {
            lowStockProducts = await productModel
                .find({
                    $or: [
                        { quantity: { $lte: 10 } },
                        { quantity: { $exists: false } },
                        { quantity: null }
                    ]
                })
                .select("name price quantity slug")
                .sort({ quantity: 1 })
                .limit(10);

        } catch (error) {
            console.error("Error finding low stock products:", error);
        }

        let orderStats = { processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
        try {
            // FIXED: Removed buyer filter for admin dashboard - admins should see ALL orders
            const [processing, shipped, delivered, cancelled] = await Promise.allSettled([
                orderModel.countDocuments({ status: "Processing" }),
                orderModel.countDocuments({ status: "Shipped" }),
                orderModel.countDocuments({ status: "Delivered" }),
                orderModel.countDocuments({ status: "Cancelled" })
            ]);

            orderStats = {
                processing: processing.status === 'fulfilled' ? processing.value : 0,
                shipped: shipped.status === 'fulfilled' ? shipped.value : 0,
                delivered: delivered.status === 'fulfilled' ? delivered.value : 0,
                cancelled: cancelled.status === 'fulfilled' ? cancelled.value : 0
            };
        } catch (error) {
            console.error("Error getting order stats:", error);
        }

        // Compile all stats
        const stats = {
            ...counts,
            totalRevenue,
            orderStats,
            recentOrders,
            lowStockProducts,
        };

        res.status(200).send({
            success: true,
            stats
        });
    } catch (error) {
        console.error("Dashboard error:", error);
        res.status(500).send({
            success: false,
            message: "Error fetching dashboard statistics",
            error: error.message
        });
    }
};

// Get user dashboard stats
export const getUserDashboardStatsController = async (req, res) => {
    try {
        const userId = req.user?._id;

        if (!userId) {
            return res.status(400).send({
                success: false,
                message: "User not authenticated properly",
            });
        }

        // Fetch user's orders
        const orders = await orderModel.find({ buyer: userId });

        // Calculate total orders
        const totalOrders = orders.length;

        // Count orders by status (case-insensitive)
        const getStatusCount = (status) =>
            orders.filter((order) => order.status?.toLowerCase() === status.toLowerCase()).length;

        const recentOrders = await orderModel
            .find({ buyer: userId })
            .sort({ createdAt: -1 })
            .limit(5);

        const stats = {
            totalOrders,
            orderStats: {
                processing: getStatusCount("Processing"),
                shipped: getStatusCount("Shipped"),
                delivered: getStatusCount("Delivered"),
                cancelled: getStatusCount("Cancelled"),
            },
            recentOrders,
        };

        res.status(200).send({
            success: true,
            stats,
        });
    } catch (error) {
        console.log("Dashboard Error:", error);
        res.status(500).send({
            success: false,
            message: "Error fetching dashboard statistics",
            error: error.message,
        });
    }
};
