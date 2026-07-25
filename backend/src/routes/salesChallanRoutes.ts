import express from "express";

import { authenticateToken } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";

import {
  createSalesChallan,
  getSalesChallans,
  getSalesChallanById,
  updateSalesChallan,
  deleteSalesChallan,
} from "../controllers/salesChallanController";

const router = express.Router();

// Create Sales Challan → ADMIN or MANAGER
router.post(
  "/",
  authenticateToken,
  authorizeRoles("ADMIN", "MANAGER"),
  createSalesChallan
);

// Get all Sales Challans → Any logged-in user
router.get(
  "/",
  authenticateToken,
  getSalesChallans
);

// Get one Sales Challan → Any logged-in user
router.get(
  "/:id",
  authenticateToken,
  getSalesChallanById
);

// Update Sales Challan → ADMIN or MANAGER
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN", "MANAGER"),
  updateSalesChallan
);

// Delete Sales Challan → ADMIN only
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("ADMIN"),
  deleteSalesChallan
);

export default router;