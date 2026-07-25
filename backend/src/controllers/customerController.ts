import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Create a customer
export const createCustomer = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address } = req.body;

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    console.error("Error creating customer:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create customer",
    });
  }
};

// Get all customers
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customers",
    });
  }
};
// Get one customer by ID
export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const customer = await prisma.customer.findUnique({
      where: {
        id: id,
      },
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error("Error fetching customer:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch customer",
    });
  }
};
// Update a customer
export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const { name, email, phone, address } = req.body;

    const customer = await prisma.customer.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        phone,
        address,
      },
    });

    res.json({
      success: true,
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    console.error("Error updating customer:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update customer",
    });
  }
};
// Delete a customer
export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    const customer = await prisma.customer.delete({
      where: {
        id: id,
      },
    });

    res.json({
      success: true,
      message: "Customer deleted successfully",
      customer,
    });
  } catch (error) {
    console.error("Error deleting customer:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete customer",
    });
  }
};