import { useEffect, useState } from "react";
import axios from "axios";

function SalesChallans({ onBack }) {
  const [salesChallans, setSalesChallans] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =========================
  // ADD / EDIT FORM
  // =========================
  const [showForm, setShowForm] = useState(false);
  const [editingChallan, setEditingChallan] = useState(null);

  const [challanNo, setChallanNo] = useState("");
  const [customerId, setCustomerId] = useState("");

  const [items, setItems] = useState([
    {
      productId: "",
      quantity: 1,
    },
  ]);

  const [saving, setSaving] = useState(false);

  // =========================
  // DELETE CHALLAN
  // =========================
  const [challanToDelete, setChallanToDelete] =
    useState(null);

  const [deleting, setDeleting] = useState(false);

  // =========================
  // FETCH SALES CHALLANS
  // =========================
  const fetchSalesChallans = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/sales-challans",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSalesChallans(
          response.data.salesChallans
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to load Sales Challans."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH CUSTOMERS
  // =========================
  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/customers",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCustomers(response.data.customers);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchSalesChallans();
    fetchCustomers();
    fetchProducts();
  }, []);

  // =========================
  // OPEN ADD FORM
  // =========================
  const openAddForm = () => {
    setEditingChallan(null);

    setChallanNo("");
    setCustomerId("");

    setItems([
      {
        productId: "",
        quantity: 1,
      },
    ]);

    setMessage("");
    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================
  const openEditForm = (challan) => {
    setEditingChallan(challan);

    setChallanNo(challan.challanNo || "");

    setCustomerId(
      challan.customerId
        ? String(challan.customerId)
        : ""
    );

    setItems(
      challan.items?.map((item) => ({
        productId: String(item.productId),
        quantity: item.quantity,
      })) || [
        {
          productId: "",
          quantity: 1,
        },
      ]
    );

    setMessage("");
    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================
  const closeForm = () => {
    setShowForm(false);
    setEditingChallan(null);

    setChallanNo("");
    setCustomerId("");

    setItems([
      {
        productId: "",
        quantity: 1,
      },
    ]);
  };

  // =========================
  // HANDLE ITEM CHANGE
  // =========================
  const handleItemChange = (
    index,
    field,
    value
  ) => {
    const updatedItems = [...items];

    updatedItems[index][field] = value;

    setItems(updatedItems);
  };

  // =========================
  // ADD ITEM ROW
  // =========================
  const addItem = () => {
    setItems([
      ...items,
      {
        productId: "",
        quantity: 1,
      },
    ]);
  };

  // =========================
  // REMOVE ITEM ROW
  // =========================
  const removeItem = (index) => {
    if (items.length === 1) {
      return;
    }

    const updatedItems = items.filter(
      (_, itemIndex) => itemIndex !== index
    );

    setItems(updatedItems);
  };

  // =========================
  // CALCULATE TOTAL
  // =========================
  const calculateTotal = () => {
    return items.reduce(
      (total, item) => {
        const product = products.find(
          (product) =>
            product.id ===
            Number(item.productId)
        );

        if (!product) {
          return total;
        }

        return (
          total +
          Number(product.price) *
            Number(item.quantity || 0)
        );
      },
      0
    );
  };

  // =========================
  // ADD / UPDATE CHALLAN
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!challanNo.trim()) {
      setMessage(
        "Please enter a Challan Number."
      );
      return;
    }

    if (!customerId) {
      setMessage(
        "Please select a customer."
      );
      return;
    }

    const hasEmptyProduct = items.some(
      (item) => !item.productId
    );

    if (hasEmptyProduct) {
      setMessage(
        "Please select a product for every item."
      );
      return;
    }

    const hasInvalidQuantity = items.some(
      (item) =>
        Number(item.quantity) <= 0
    );

    if (hasInvalidQuantity) {
      setMessage(
        "Quantity must be greater than 0."
      );
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const challanData = {
        challanNo,
        customerId: Number(customerId),

        items: items.map((item) => ({
          productId: Number(
            item.productId
          ),
          quantity: Number(
            item.quantity
          ),
        })),
      };

      let response;

      // =========================
      // UPDATE CHALLAN
      // =========================
      if (editingChallan) {
        response = await axios.put(
          `http://localhost:5000/api/sales-challans/${editingChallan.id}`,
          challanData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // =========================
      // ADD CHALLAN
      // =========================
      else {
        response = await axios.post(
          "http://localhost:5000/api/sales-challans",
          challanData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        closeForm();

        await fetchSalesChallans();

        // Refresh products because
        // stock may have changed
        await fetchProducts();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save Sales Challan."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // OPEN DELETE CONFIRMATION
  // =========================
  const openDeleteConfirmation = (
    challan
  ) => {
    setChallanToDelete(challan);
  };

  // =========================
  // CLOSE DELETE CONFIRMATION
  // =========================
  const closeDeleteConfirmation = () => {
    setChallanToDelete(null);
  };

  // =========================
  // DELETE CHALLAN
  // =========================
  const handleDeleteChallan = async () => {
    if (!challanToDelete) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/sales-challans/${challanToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        closeDeleteConfirmation();

        await fetchSalesChallans();

        // Stock is restored after deletion
        await fetchProducts();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete Sales Challan."
      );

      closeDeleteConfirmation();
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // SEARCH SALES CHALLANS
  // =========================
  const filteredSalesChallans =
    salesChallans.filter((challan) => {
      const searchText =
        search.toLowerCase();

      const challanNumber =
        challan.challanNo
          ?.toLowerCase() || "";

      const customerName =
        challan.customer?.name
          ?.toLowerCase() || "";

      return (
        challanNumber.includes(
          searchText
        ) ||
        customerName.includes(
          searchText
        )
      );
    });

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
            🧾 Sales Challans
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px",
              marginBottom: 0,
              fontSize: "15px",
            }}
          >
            Manage your sales challans
            and product sales
          </p>
        </div>

        <button
          onClick={onBack}
          style={{
            padding: "10px 18px",
            backgroundColor: "white",
            color: "#475569",
            border:
              "1px solid #cbd5e1",
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
          SEARCH + SUMMARY + ADD
      ========================= */}
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: "25px",
          gap: "20px",
        }}
      >
        <input
          type="text"
          placeholder="🔍 Search by challan number or customer..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "400px",
            maxWidth: "100%",
            padding: "13px 16px",
            border:
              "1px solid #cbd5e1",
            borderRadius: "8px",
            outline: "none",
            fontSize: "14px",
            boxSizing: "border-box",
            color: "#0f172a",
            backgroundColor: "white",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "12px 20px",
              borderRadius: "8px",
              boxShadow:
                "0 2px 8px rgba(0,0,0,0.05)",
              whiteSpace: "nowrap",
              color: "#334155",
            }}
          >
            <strong>
              {salesChallans.length}
            </strong>{" "}
            Challans
          </div>

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
            + Add Sales Challan
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
          SALES CHALLAN TABLE
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
            Loading Sales Challans...
          </div>
        ) : filteredSalesChallans.length ===
          0 ? (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No Sales Challans found.
          </div>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor:
                    "#f8fafc",
                  textAlign: "left",
                }}
              >
                <th style={headerStyle}>
                  Challan No
                </th>

                <th style={headerStyle}>
                  Customer
                </th>

                <th style={headerStyle}>
                  Items
                </th>

                <th style={headerStyle}>
                  Total
                </th>

                <th style={headerStyle}>
                  Date
                </th>

                <th style={headerStyle}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredSalesChallans.map(
                (challan) => (
                  <tr key={challan.id}>
                    <td
                      style={{
                        ...cellStyle,
                        fontWeight:
                          "600",
                      }}
                    >
                      {challan.challanNo}
                    </td>

                    <td
                      style={cellStyle}
                    >
                      {challan.customer
                        ?.name ||
                        "Unknown Customer"}
                    </td>

                    <td
                      style={cellStyle}
                    >
                      {challan.items
                        ?.length || 0}{" "}
                      item(s)
                    </td>

                    <td
                      style={{
                        ...cellStyle,
                        fontWeight:
                          "600",
                      }}
                    >
                      $
                      {Number(
                        challan.total
                      ).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </td>

                    <td
                      style={cellStyle}
                    >
                      {challan.createdAt
                        ? new Date(
                            challan.createdAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td
                      style={cellStyle}
                    >
                      <button
                        onClick={() =>
                          openEditForm(
                            challan
                          )
                        }
                        style={{
                          padding:
                            "7px 12px",
                          marginRight:
                            "8px",
                          border:
                            "1px solid #2563eb",
                          backgroundColor:
                            "white",
                          color:
                            "#2563eb",
                          borderRadius:
                            "6px",
                          cursor:
                            "pointer",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          openDeleteConfirmation(
                            challan
                          )
                        }
                        style={{
                          padding:
                            "7px 12px",
                          border: "none",
                          backgroundColor:
                            "#fee2e2",
                          color:
                            "#dc2626",
                          borderRadius:
                            "6px",
                          cursor:
                            "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              )}
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
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor:
              "rgba(15, 23, 42, 0.5)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 1000,
            overflowY: "auto",
            padding: "30px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "550px",
              maxWidth: "95%",
              backgroundColor:
                "white",
              borderRadius: "14px",
              padding: "30px",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.15)",
              maxHeight: "90vh",
              overflowY: "auto",
              boxSizing: "border-box",
            }}
          >
            {/* MODAL HEADER */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
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
                {editingChallan
                  ? "Edit Sales Challan"
                  : "Add New Sales Challan"}
              </h2>

              <button
                onClick={closeForm}
                style={{
                  border: "none",
                  background: "none",
                  fontSize: "24px",
                  color: "#64748b",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {/* FORM */}
            <form
              onSubmit={handleSubmit}
            >
              {/* CHALLAN NUMBER */}
              <div
                style={{
                  marginBottom:
                    "18px",
                }}
              >
                <label
                  style={labelStyle}
                >
                  Challan Number
                </label>

                <input
                  type="text"
                  value={challanNo}
                  onChange={(e) =>
                    setChallanNo(
                      e.target.value
                    )
                  }
                  placeholder="Enter challan number"
                  required
                  style={{
                    ...inputStyle,
                    color: "#0f172a",
                    backgroundColor:
                      "white",
                  }}
                />
              </div>

              {/* CUSTOMER */}
              <div
                style={{
                  marginBottom:
                    "22px",
                }}
              >
                <label
                  style={labelStyle}
                >
                  Customer
                </label>

                <select
                  value={customerId}
                  onChange={(e) =>
                    setCustomerId(
                      e.target.value
                    )
                  }
                  required
                  style={{
                    ...inputStyle,
                    color: "#0f172a",
                    backgroundColor:
                      "white",
                    colorScheme: "light",
                  }}
                >
                  <option
                    value=""
                    style={{
                      color: "#0f172a",
                      backgroundColor:
                        "white",
                    }}
                  >
                    Select Customer
                  </option>

                  {customers.map(
                    (customer) => (
                      <option
                        key={
                          customer.id
                        }
                        value={
                          customer.id
                        }
                        style={{
                          color: "#0f172a",
                          backgroundColor:
                            "white",
                        }}
                      >
                        {customer.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* ITEMS HEADER */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom:
                    "12px",
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    color:
                      "#334155",
                    fontSize:
                      "16px",
                  }}
                >
                  Products
                </h3>

                <button
                  type="button"
                  onClick={addItem}
                  style={{
                    padding:
                      "7px 12px",
                    backgroundColor:
                      "#eff6ff",
                    color:
                      "#2563eb",
                    border:
                      "1px solid #bfdbfe",
                    borderRadius:
                      "6px",
                    cursor:
                      "pointer",
                    fontWeight:
                      "600",
                  }}
                >
                  + Add Item
                </button>
              </div>

              {/* ITEMS */}
              {items.map(
                (item, index) => (
                  <div
                    key={index}
                    style={{
                      display:
                        "flex",
                      gap: "10px",
                      alignItems:
                        "flex-end",
                      marginBottom:
                        "14px",
                      padding:
                        "14px",
                      backgroundColor:
                        "#f8fafc",
                      borderRadius:
                        "8px",
                    }}
                  >
                    {/* PRODUCT */}
                    <div
                      style={{
                        flex: 1,
                      }}
                    >
                      <label
                        style={
                          labelStyle
                        }
                      >
                        Product
                      </label>

                      {/* FIXED PRODUCT DROPDOWN */}
                      <select
                        value={
                          item.productId
                        }
                        onChange={(
                          e
                        ) =>
                          handleItemChange(
                            index,
                            "productId",
                            e.target
                              .value
                          )
                        }
                        required
                        style={{
                          ...inputStyle,
                          backgroundColor:
                            "white",
                          color:
                            "#0f172a",
                          colorScheme:
                            "light",
                          cursor:
                            "pointer",
                        }}
                      >
                        <option
                          value=""
                          style={{
                            backgroundColor:
                              "white",
                            color:
                              "#0f172a",
                          }}
                        >
                          Select Product
                        </option>

                        {products.map(
                          (
                            product
                          ) => (
                            <option
                              key={
                                product.id
                              }
                              value={
                                product.id
                              }
                              style={{
                                backgroundColor:
                                  "white",
                                color:
                                  "#0f172a",
                              }}
                            >
                              {
                                product.name
                              }{" "}
                              - $
                              {Number(
                                product.price
                              ).toFixed(
                                2
                              )}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    {/* QUANTITY */}
                    <div
                      style={{
                        width:
                          "100px",
                      }}
                    >
                      <label
                        style={
                          labelStyle
                        }
                      >
                        Qty
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={
                          item.quantity
                        }
                        onChange={(
                          e
                        ) =>
                          handleItemChange(
                            index,
                            "quantity",
                            e.target
                              .value
                          )
                        }
                        required
                        style={{
                          ...inputStyle,
                          backgroundColor:
                            "white",
                          color:
                            "#0f172a",
                        }}
                      />
                    </div>

                    {/* REMOVE */}
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(
                          index
                        )
                      }
                      disabled={
                        items.length ===
                        1
                      }
                      style={{
                        height:
                          "42px",
                        padding:
                          "0 12px",
                        border:
                          "none",
                        backgroundColor:
                          items.length ===
                          1
                            ? "#e2e8f0"
                            : "#fee2e2",
                        color:
                          items.length ===
                          1
                            ? "#94a3b8"
                            : "#dc2626",
                        borderRadius:
                          "6px",
                        cursor:
                          items.length ===
                          1
                            ? "not-allowed"
                            : "pointer",
                        fontSize:
                          "18px",
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                )
              )}

              {/* TOTAL */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  backgroundColor:
                    "#f1f5f9",
                  padding:
                    "15px 18px",
                  borderRadius:
                    "8px",
                  marginTop:
                    "20px",
                  marginBottom:
                    "25px",
                }}
              >
                <strong
                  style={{
                    color:
                      "#334155",
                  }}
                >
                  Total
                </strong>

                <strong
                  style={{
                    color:
                      "#2563eb",
                    fontSize:
                      "20px",
                  }}
                >
                  $
                  {calculateTotal().toLocaleString(
                    "en-US",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>
              </div>

              {/* BUTTONS */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={closeForm}
                  style={{
                    padding:
                      "11px 18px",
                    backgroundColor:
                      "white",
                    color:
                      "#475569",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius:
                      "8px",
                    cursor:
                      "pointer",
                  }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding:
                      "11px 20px",
                    backgroundColor:
                      "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius:
                      "8px",
                    cursor: saving
                      ? "not-allowed"
                      : "pointer",
                    fontWeight:
                      "600",
                  }}
                >
                  {saving
                    ? "Saving..."
                    : editingChallan
                    ? "Save Changes"
                    : "Add Sales Challan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          DELETE CONFIRMATION MODAL
      ========================= */}
      {challanToDelete && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor:
              "rgba(15, 23, 42, 0.5)",
            display: "flex",
            justifyContent:
              "center",
            alignItems: "center",
            zIndex: 1100,
          }}
        >
          <div
            style={{
              width: "400px",
              maxWidth: "90%",
              backgroundColor:
                "white",
              borderRadius: "14px",
              padding: "30px",
              boxShadow:
                "0 20px 40px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            {/* WARNING ICON */}
            <div
              style={{
                width: "55px",
                height: "55px",
                margin:
                  "0 auto 20px",
                borderRadius: "50%",
                backgroundColor:
                  "#fee2e2",
                display: "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                fontSize: "26px",
              }}
            >
              🗑️
            </div>

            <h2
              style={{
                margin:
                  "0 0 10px",
                color: "#0f172a",
              }}
            >
              Delete Sales Challan?
            </h2>

            <p
              style={{
                color: "#64748b",
                lineHeight: "1.6",
                marginBottom:
                  "25px",
              }}
            >
              Are you sure you want
              to delete{" "}
              <strong>
                {
                  challanToDelete.challanNo
                }
              </strong>
              ? This action cannot be
              undone and the product
              stock will be restored.
            </p>

            {/* DELETE BUTTONS */}
            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                gap: "12px",
              }}
            >
              <button
                onClick={
                  closeDeleteConfirmation
                }
                disabled={deleting}
                style={{
                  padding:
                    "11px 20px",
                  backgroundColor:
                    "white",
                  color:
                    "#475569",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius:
                    "8px",
                  cursor:
                    "pointer",
                  fontWeight:
                    "500",
                }}
              >
                Cancel
              </button>

              <button
                onClick={
                  handleDeleteChallan
                }
                disabled={deleting}
                style={{
                  padding:
                    "11px 20px",
                  backgroundColor:
                    "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius:
                    "8px",
                  cursor: deleting
                    ? "not-allowed"
                    : "pointer",
                  fontWeight:
                    "600",
                }}
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Sales Challan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================
// TABLE STYLES
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
  border:
    "1px solid #cbd5e1",
  borderRadius: "7px",
  outline: "none",
  fontSize: "14px",
};

export default SalesChallans;