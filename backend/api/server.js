import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "../config/db.js";
import authRoutes from "../routes/authRoute.js";
import categoryRoutes from "../routes/categoryRoutes.js";
import productRoutes from "../routes/productRoutes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';
import { errorHandler } from "../middlewares/authMiddleware.js";

//configure env
dotenv.config();

//database config
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./client/build")));

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);

app.get("/", (req, res) => {
    res.send("<h1>Welcome to E-commerce App</h1>");
});

// //rest api
// app.use("*", function (req, res) {
//     res.sendFile(path.join(__dirname, "./client/build/index.html"));
// });

app.use("/", (req, res) => {
    console.log("Server is running on port 8080");
})


//PORT
const PORT = process.env.PORT || 8080;

// Error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on localhost:${PORT}`.bgCyan.white);
})