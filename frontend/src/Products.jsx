import { useEffect, useState } from "react";
import axios from "axios";

function Products({ onBack }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // ADD / EDIT FORM
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  // DELETE MODAL
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // FORM FIELDS
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const [saving, setSaving] = useState(false);

  // =========================
  // FETCH PRODUCTS
  // =========================

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/products",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // OPEN ADD FORM
  // =========================

  const openAddForm = () => {
    setIsEditing(false);
    setEditingProductId(null);

    setName("");
    setSku("");
    setDescription("");
    setPrice("");
    setStock("");

    setMessage("");
    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================

  const openEditForm = (product) => {
    setIsEditing(true);
    setEditingProductId(product.id);

    setName(product.name || "");
    setSku(product.sku || "");
    setDescription(product.description || "");
    setPrice(product.price ?? "");
    setStock(product.stock ?? "");

    setMessage("");
    setShowForm(true);
  };

  // =========================
  // CLOSE ADD / EDIT FORM
  // =========================

  const closeForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingProductId(null);

    setName("");
    setSku("");
    setDescription("");
    setPrice("");
    setStock("");
  };

  // =========================
  // ADD OR EDIT PRODUCT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const productData = {
        name,
        sku,
        description,
        price: Number(price),
        stock: Number(stock),
      };

      let response;

      if (isEditing) {
        // UPDATE PRODUCT
        response = await axios.put(
          `http://localhost:5000/api/products/${editingProductId}`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // CREATE PRODUCT
        response = await axios.post(
          "http://localhost:5000/api/products",
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        closeForm();
        await fetchProducts();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          (isEditing
            ? "Failed to update product."
            : "Failed to add product.")
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // OPEN DELETE MODAL
  // =========================

  const openDeleteModal = (product) => {
    setDeletingProduct(product);
    setShowDeleteModal(true);
  };

  // =========================
  // CLOSE DELETE MODAL
  // =========================

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletingProduct(null);
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDelete = async () => {
    if (!deletingProduct) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/products/${deletingProduct.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        closeDeleteModal();
        await fetchProducts();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete product."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // SEARCH PRODUCTS
  // =========================

  const filteredProducts = products.filter(
    (product) =>
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.sku
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "30px 50px",
        boxSizing: "border-box",
      }}
    >
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "35px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "32px",
            }}
          >
            Products
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px",
              marginBottom: 0,
              fontSize: "15px",
            }}
          >
            Manage your products and inventory
          </p>
        </div>

        {/* BACK TO DASHBOARD */}

        <button
          onClick={onBack}
          style={{
            padding: "10px 18px",
            backgroundColor: "white",
            color: "#475569",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* =========================
          SEARCH + COUNT + ADD
      ========================= */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          gap: "20px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by product name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "400px",
            maxWidth: "100%",
            padding: "13px 16px",
            border: "1px solid #cbd5e1",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          {/* PRODUCT COUNT */}

          <div
            style={{
              backgroundColor: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.05)",
              whiteSpace: "nowrap",
            }}
          >
            <strong>{products.length}</strong>{" "}
            Products
          </div>

          {/* ADD PRODUCT */}

          <button
            onClick={openAddForm}
            style={{
              padding: "12px 20px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "15px",
              fontWeight: "600",
              whiteSpace: "nowrap",
            }}
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* =========================
          MESSAGE
      ========================= */}

      {message && (
        <div
          style={{
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {message}
        </div>
      )}

      {/* =========================
          PRODUCT TABLE
      ========================= */}

      <div
        style={{
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.06)",
          overflow: "hidden",
        }}
      >
        {loading ? (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No products found.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8fafc",
                  textAlign: "left",
                }}
              >
                <th style={headerStyle}>
                  Product
                </th>

                <th style={headerStyle}>
                  SKU
                </th>

                <th style={headerStyle}>
                  Price
                </th>

                <th style={headerStyle}>
                  Stock
                </th>

                <th style={headerStyle}>
                  Status
                </th>

                <th style={headerStyle}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td style={cellStyle}>
                    <strong>
                      {product.name}
                    </strong>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "#64748b",
                        marginTop: "4px",
                      }}
                    >
                      {product.description ||
                        "No description"}
                    </div>
                  </td>

                  <td style={cellStyle}>
                    {product.sku}
                  </td>

                  <td style={cellStyle}>
                    $
                    {Number(
                      product.price
                    ).toLocaleString()}
                  </td>

                  <td style={cellStyle}>
                    {product.stock}
                  </td>

                  <td style={cellStyle}>
                    <span
                      style={{
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor:
                          product.stock > 0
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          product.stock > 0
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      {product.stock > 0
                        ? "In Stock"
                        : "Out of Stock"}
                    </span>
                  </td>

                  <td style={cellStyle}>
                    {/* EDIT BUTTON */}

                    <button
                      onClick={() =>
                        openEditForm(product)
                      }
                      style={{
                        padding: "7px 12px",
                        marginRight: "8px",
                        border:
                          "1px solid #2563eb",
                        backgroundColor: "white",
                        color: "#2563eb",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>

                    {/* DELETE BUTTON */}

                    <button
                      onClick={() =>
                        openDeleteModal(product)
                      }
                      style={{
                        padding: "7px 12px",
                        border: "none",
                        backgroundColor:
                          "#fee2e2",
                        color: "#dc2626",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor:
              "rgba(15, 23, 42, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            boxSizing: "border-box",
            zIndex: 1000,
            overflowY: "auto",
          }}
        >
          <div
            style={{
              width: "450px",
              maxWidth: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "30px",
              boxSizing: "border-box",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            {/* MODAL HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                }}
              >
                {isEditing
                  ? "Edit Product"
                  : "Add New Product"}
              </h2>

              {/* CLOSE BUTTON */}

              <button
                type="button"
                onClick={closeForm}
                style={{
                  border: "none",
                  backgroundColor: "#f1f5f9",
                  color: "#475569",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  fontSize: "22px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>
              {/* PRODUCT NAME */}

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter product name"
                  required
                  style={inputStyle}
                />
              </div>

              {/* SKU */}

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>
                  SKU
                </label>

                <input
                  type="text"
                  value={sku}
                  onChange={(e) =>
                    setSku(e.target.value)
                  }
                  placeholder="Example: LAP-003"
                  required
                  style={inputStyle}
                />
              </div>

              {/* DESCRIPTION */}

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Enter product description"
                  rows="3"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </div>

              {/* PRICE */}

              <div style={{ marginBottom: "18px" }}>
                <label style={labelStyle}>
                  Price
                </label>

                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    setPrice(e.target.value)
                  }
                  placeholder="Enter price"
                  min="0"
                  required
                  style={inputStyle}
                />
              </div>

              {/* STOCK */}

              <div style={{ marginBottom: "25px" }}>
                <label style={labelStyle}>
                  Stock
                </label>

                <input
                  type="number"
                  value={stock}
                  onChange={(e) =>
                    setStock(e.target.value)
                  }
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                  style={inputStyle}
                />
              </div>

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "12px",
                }}
              >
                {/* CANCEL */}

                <button
                  type="button"
                  onClick={closeForm}
                  style={{
                    padding: "11px 20px",
                    backgroundColor: "white",
                    color: "#475569",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "500",
                  }}
                >
                  Cancel
                </button>

                {/* ADD / SAVE */}

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: "11px 20px",
                    backgroundColor:
                      "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                    fontWeight: "600",
                  }}
                >
                  {saving
                    ? isEditing
                      ? "Saving..."
                      : "Adding..."
                    : isEditing
                    ? "Save Changes"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          DELETE CONFIRMATION MODAL
      ========================= */}

      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor:
              "rgba(15, 23, 42, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
            boxSizing: "border-box",
            zIndex: 2000,
          }}
        >
          <div
            style={{
              width: "400px",
              maxWidth: "100%",
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "35px",
              boxSizing: "border-box",
              textAlign: "center",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            {/* TITLE */}

            <h2
              style={{
                margin: "0 0 20px 0",
                color: "#0f172a",
                fontSize: "22px",
              }}
            >
              Delete Product?
            </h2>

            {/* BIN EMOJI - CENTERED IN MIDDLE */}

            <div
              style={{
                fontSize: "48px",
                marginBottom: "20px",
                lineHeight: "1",
              }}
            >
              🗑️
            </div>

            {/* MESSAGE */}

            <p
              style={{
                color: "#64748b",
                fontSize: "15px",
                lineHeight: "1.6",
                margin:
                  "0 auto 10px auto",
              }}
            >
              Are you sure you want to delete
              this product?
            </p>

            {deletingProduct && (
              <p
                style={{
                  color: "#0f172a",
                  fontWeight: "600",
                  margin:
                    "0 0 25px 0",
                }}
              >
                "{deletingProduct.name}"
              </p>
            )}

            {/* MODAL BUTTONS */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "25px",
              }}
            >
              {/* CANCEL */}

              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                style={{
                  padding: "11px 22px",
                  backgroundColor: "white",
                  color: "#475569",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "8px",
                  cursor: deleting
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "500",
                }}
              >
                Cancel
              </button>

              {/* DELETE */}

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: "11px 22px",
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: deleting
                    ? "not-allowed"
                    : "pointer",
                  fontWeight: "600",
                }}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================
// STYLES
// =========================

const headerStyle = {
  padding: "16px 20px",
  color: "#475569",
  fontSize: "13px",
  borderBottom:
    "1px solid #e2e8f0",
};

const cellStyle = {
  padding: "18px 20px",
  borderBottom:
    "1px solid #f1f5f9",
  color: "#334155",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  color: "#334155",
  fontSize: "14px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  padding: "11px 12px",
  boxSizing: "border-box",
  border: "1px solid #cbd5e1",
  borderRadius: "7px",
  outline: "none",
  fontSize: "14px",
};

export default Products;