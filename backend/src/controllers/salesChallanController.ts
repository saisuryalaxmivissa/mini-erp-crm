import { Request, Response } from "express";
import prisma from "../lib/prisma";

// Create a Sales Challan
export const createSalesChallan = async (req: Request, res: Response) => {
  try {
    const { challanNo, customerId, items } = req.body;

    const salesChallan = await prisma.$transaction(async (tx) => {
      // Check if customer exists
      const customer = await tx.customer.findUnique({
        where: {
          id: Number(customerId),
        },
      });

      if (!customer) {
        throw new Error("Customer not found");
      }

      let total = 0;
      const challanItems = [];

      for (const item of items) {
        // Find product
        const product = await tx.product.findUnique({
          where: {
            id: Number(item.productId),
          },
        });

        if (!product) {
          throw new Error(
            `Product with ID ${item.productId} not found`
          );
        }

        const quantity = Number(item.quantity);

        // Validate quantity
        if (quantity <= 0) {
          throw new Error("Quantity must be greater than 0");
        }

        // Check stock
        if (product.stock < quantity) {
          throw new Error(
            `Insufficient stock for product: ${product.name}. Available stock: ${product.stock}`
          );
        }

        const price = Number(product.price);

        // Calculate total
        total += price * quantity;

        // Prepare challan item
        challanItems.push({
          productId: product.id,
          quantity,
          price: product.price,
        });

        // Decrease product stock
        await tx.product.update({
          where: {
            id: product.id,
          },
          data: {
            stock: {
              decrement: quantity,
            },
          },
        });
      }

      // Create Sales Challan
      return await tx.salesChallan.create({
        data: {
          challanNo,
          customerId: Number(customerId),
          total,
          items: {
            create: challanItems,
          },
        },
        include: {
          customer: true,
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    res.status(201).json({
      success: true,
      message: "Sales Challan created successfully",
      salesChallan,
    });
  } catch (error) {
    console.error("Error creating Sales Challan:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create Sales Challan",
    });
  }
};

// Get all Sales Challans
export const getSalesChallans = async (
  req: Request,
  res: Response
) => {
  try {
    const salesChallans = await prisma.salesChallan.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({
      success: true,
      salesChallans,
    });
  } catch (error) {
    console.error("Error fetching Sales Challans:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Sales Challans",
    });
  }
};

// Get a single Sales Challan by ID
export const getSalesChallanById = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    const salesChallan = await prisma.salesChallan.findUnique({
      where: {
        id,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!salesChallan) {
      return res.status(404).json({
        success: false,
        message: "Sales Challan not found",
      });
    }

    res.json({
      success: true,
      salesChallan,
    });
  } catch (error) {
    console.error("Error fetching Sales Challan:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Sales Challan",
    });
  }
};

// Update a Sales Challan
export const updateSalesChallan = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);
    const { challanNo, customerId, items } = req.body;

    const updatedSalesChallan = await prisma.$transaction(
      async (tx) => {
        // Check if Sales Challan exists
        const existingChallan =
          await tx.salesChallan.findUnique({
            where: {
              id,
            },
            include: {
              items: true,
            },
          });

        if (!existingChallan) {
          throw new Error("Sales Challan not found");
        }

        // Check if customer exists
        const customer = await tx.customer.findUnique({
          where: {
            id: Number(customerId),
          },
        });

        if (!customer) {
          throw new Error("Customer not found");
        }

        // Restore old stock
        for (const oldItem of existingChallan.items) {
          await tx.product.update({
            where: {
              id: oldItem.productId,
            },
            data: {
              stock: {
                increment: oldItem.quantity,
              },
            },
          });
        }

        let total = 0;
        const challanItems = [];

        // Validate new products and calculate total
        for (const item of items) {
          const product = await tx.product.findUnique({
            where: {
              id: Number(item.productId),
            },
          });

          if (!product) {
            throw new Error(
              `Product with ID ${item.productId} not found`
            );
          }

          const quantity = Number(item.quantity);

          if (quantity <= 0) {
            throw new Error(
              "Quantity must be greater than 0"
            );
          }

          // Check available stock after restoring old stock
          if (product.stock < quantity) {
            throw new Error(
              `Insufficient stock for product: ${product.name}. Available stock: ${product.stock}`
            );
          }

          const price = Number(product.price);

          total += price * quantity;

          challanItems.push({
            productId: product.id,
            quantity,
            price: product.price,
          });

          // Deduct new stock
          await tx.product.update({
            where: {
              id: product.id,
            },
            data: {
              stock: {
                decrement: quantity,
              },
            },
          });
        }

        // Delete old challan items
        await tx.salesChallanItem.deleteMany({
          where: {
            challanId: id,
          },
        });

        // Update Sales Challan
        return await tx.salesChallan.update({
          where: {
            id,
          },
          data: {
            challanNo,
            customerId: Number(customerId),
            total,
            items: {
              create: challanItems,
            },
          },
          include: {
            customer: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        });
      }
    );

    res.json({
      success: true,
      message: "Sales Challan updated successfully",
      salesChallan: updatedSalesChallan,
    });
  } catch (error) {
    console.error("Error updating Sales Challan:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update Sales Challan",
    });
  }
};

// Delete a Sales Challan
export const deleteSalesChallan = async (
  req: Request,
  res: Response
) => {
  try {
    const id = Number(req.params.id);

    await prisma.$transaction(async (tx) => {
      // Find Sales Challan and its items
      const salesChallan =
        await tx.salesChallan.findUnique({
          where: {
            id,
          },
          include: {
            items: true,
          },
        });

      if (!salesChallan) {
        throw new Error("Sales Challan not found");
      }

      // Restore stock
      for (const item of salesChallan.items) {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      // Delete Sales Challan items
      await tx.salesChallanItem.deleteMany({
        where: {
          challanId: id,
        },
      });

      // Delete Sales Challan
      await tx.salesChallan.delete({
        where: {
          id,
        },
      });
    });

    res.json({
      success: true,
      message:
        "Sales Challan deleted successfully and stock restored",
    });
  } catch (error) {
    console.error("Error deleting Sales Challan:", error);

    res.status(400).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete Sales Challan",
    });
  }
};