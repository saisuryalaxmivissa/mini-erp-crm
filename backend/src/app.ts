import express from "express";
import cors from "cors";
import prisma from "./lib/prisma";
import customerRoutes from "./routes/customerRoutes";
import productRoutes from "./routes/productRoutes";
import salesChallanRoutes from "./routes/salesChallanRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Customer routes
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/sales-challans", salesChallanRoutes);
app.use("/api/auth", authRoutes);
// Home route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Mini ERP CRM API is running!",
  });
});

// Database test route
app.get("/api/test-db", async (req, res) => {
  console.log("➡️ Database test started");

  try {
    console.log("➡️ About to query database...");

    await prisma.$queryRaw`SELECT 1`;

    console.log("✅ Database query completed");

    res.json({
      success: true,
      message: "Database connected successfully!",
    });
  } catch (error) {
    console.error("❌ Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
    });
  }
});

export default app;