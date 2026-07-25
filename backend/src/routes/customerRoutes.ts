import express from "express";

import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customerController";

const router = express.Router();

// Create Customer → ADMIN or MANAGER
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "MANAGER"),
  createCustomer
);

// Get all Customers → Any logged-in user
router.get(
  "/",
  authenticateToken,
  getCustomers
);

// Get one Customer → Any logged-in user
router.get(
  "/:id",
  authenticateToken,
  getCustomerById
);

// Update Customer → ADMIN or MANAGER
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "MANAGER"),
  updateCustomer
);

// Delete Customer → ADMIN only
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteCustomer
);

export default router;