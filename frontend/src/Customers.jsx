import { useEffect, useState } from "react";
import axios from "axios";

function Customers({ onBack }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // =========================
  // ADD / EDIT FORM
  // =========================
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [saving, setSaving] = useState(false);

  // =========================
  // DELETE CUSTOMER
  // =========================
  const [customerToDelete, setCustomerToDelete] =
    useState(null);

  const [deleting, setDeleting] = useState(false);

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
      setMessage("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================
  // OPEN ADD FORM
  // =========================
  const openAddForm = () => {
    setEditingCustomer(null);

    setName("");
    setEmail("");
    setPhone("");
    setAddress("");

    setMessage("");
    setShowForm(true);
  };

  // =========================
  // OPEN EDIT FORM
  // =========================
  const openEditForm = (customer) => {
    setEditingCustomer(customer);

    setName(customer.name || "");
    setEmail(customer.email || "");
    setPhone(customer.phone || "");
    setAddress(customer.address || "");

    setMessage("");
    setShowForm(true);
  };

  // =========================
  // CLOSE FORM
  // =========================
  const closeForm = () => {
    setShowForm(false);
    setEditingCustomer(null);

    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
  };

  // =========================
  // ADD OR UPDATE CUSTOMER
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const customerData = {
        name,
        email,
        phone,
        address,
      };

      let response;

      // UPDATE CUSTOMER
      if (editingCustomer) {
        response = await axios.put(
          `http://localhost:5000/api/customers/${editingCustomer.id}`,
          customerData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // ADD CUSTOMER
      else {
        response = await axios.post(
          "http://localhost:5000/api/customers",
          customerData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      if (response.data.success) {
        closeForm();
        await fetchCustomers();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to save customer."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // OPEN DELETE CONFIRMATION
  // =========================
  const openDeleteConfirmation = (customer) => {
    setCustomerToDelete(customer);
  };

  // =========================
  // CLOSE DELETE CONFIRMATION
  // =========================
  const closeDeleteConfirmation = () => {
    setCustomerToDelete(null);
  };

  // =========================
  // DELETE CUSTOMER
  // =========================
  const handleDeleteCustomer = async () => {
    if (!customerToDelete) {
      return;
    }

    setDeleting(true);
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        `http://localhost:5000/api/customers/${customerToDelete.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        closeDeleteConfirmation();
        await fetchCustomers();
      }
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Failed to delete customer."
      );

      closeDeleteConfirmation();
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // SEARCH CUSTOMERS
  // =========================
  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.email
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      customer.phone
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
            👤 Customers
          </h1>

          <p
            style={{
              color: "#64748b",
              marginTop: "10px",
              marginBottom: 0,
              fontSize: "15px",
            }}
          >
            Manage your customers and their information
          </p>
        </div>

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
          SEARCH + SUMMARY + ADD
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
          placeholder="🔍 Search by name, email or phone..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
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
            <strong>
              {customers.length}
            </strong>{" "}
            Customers
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
            + Add Customer
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
          CUSTOMER TABLE
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
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div
            style={{
              padding: "50px",
              textAlign: "center",
              color: "#64748b",
            }}
          >
            No customers found.
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
                  Name
                </th>

                <th style={headerStyle}>
                  Email
                </th>

                <th style={headerStyle}>
                  Phone
                </th>

                <th style={headerStyle}>
                  Address
                </th>

                <th style={headerStyle}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map(
                (customer) => (
                  <tr key={customer.id}>
                    <td
                      style={{
                        ...cellStyle,
                        fontWeight: "600",
                      }}
                    >
                      {customer.name}
                    </td>

                    <td style={cellStyle}>
                      {customer.email}
                    </td>

                    <td style={cellStyle}>
                      {customer.phone}
                    </td>

                    <td style={cellStyle}>
                      {customer.address}
                    </td>

                    <td style={cellStyle}>
                      <button
                        onClick={() =>
                          openEditForm(customer)
                        }
                        style={{
                          padding:
                            "7px 12px",
                          marginRight: "8px",
                          border:
                            "1px solid #2563eb",
                          backgroundColor:
                            "white",
                          color: "#2563eb",
                          borderRadius: "6px",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          openDeleteConfirmation(
                            customer
                          )
                        }
                        style={{
                          padding:
                            "7px 12px",
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
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              width: "450px",
              maxWidth: "90%",
              backgroundColor: "white",
              borderRadius: "14px",
              padding: "30px",
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
                {editingCustomer
                  ? "Edit Customer"
                  : "Add New Customer"}
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
            <form onSubmit={handleSubmit}>
              {/* NAME */}
              <div
                style={{
                  marginBottom: "18px",
                }}
              >
                <label style={labelStyle}>
                  Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter customer name"
                  required
                  style={inputStyle}
                />
              </div>

              {/* EMAIL */}
              <div
                style={{
                  marginBottom: "18px",
                }}
              >
                <label style={labelStyle}>
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter email address"
                  required
                  style={inputStyle}
                />
              </div>

              {/* PHONE */}
              <div
                style={{
                  marginBottom: "18px",
                }}
              >
                <label style={labelStyle}>
                  Phone
                </label>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  placeholder="Enter phone number"
                  required
                  style={inputStyle}
                />
              </div>

              {/* ADDRESS */}
              <div
                style={{
                  marginBottom: "25px",
                }}
              >
                <label style={labelStyle}>
                  Address
                </label>

                <textarea
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  placeholder="Enter address"
                  required
                  rows="3"
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
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
                <button
                  type="button"
                  onClick={closeForm}
                  style={{
                    padding: "11px 18px",
                    backgroundColor: "white",
                    color: "#475569",
                    border:
                      "1px solid #cbd5e1",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

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
                    ? "Saving..."
                    : editingCustomer
                    ? "Save Changes"
                    : "Add Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================
          DELETE CONFIRMATION MODAL
      ========================= */}
      {customerToDelete && (
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
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1100,
          }}
        >
          <div
            style={{
              width: "400px",
              maxWidth: "90%",
              backgroundColor: "white",
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
                margin: "0 auto 20px",
                borderRadius: "50%",
                backgroundColor: "#fee2e2",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "26px",
              }}
            >
              🗑️
            </div>

            <h2
              style={{
                margin: "0 0 10px",
                color: "#0f172a",
              }}
            >
              Delete Customer?
            </h2>

            <p
              style={{
                color: "#64748b",
                lineHeight: "1.6",
                marginBottom: "25px",
              }}
            >
              Are you sure you want to delete{" "}
              <strong>
                {customerToDelete.name}
              </strong>
              ? This action cannot be undone.
            </p>

            {/* DELETE BUTTONS */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
              }}
            >
              <button
                onClick={closeDeleteConfirmation}
                disabled={deleting}
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

              <button
                onClick={handleDeleteCustomer}
                disabled={deleting}
                style={{
                  padding: "11px 20px",
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
                  : "Delete Customer"}
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
  border: "1px solid #cbd5e1",
  borderRadius: "7px",
  outline: "none",
  fontSize: "14px",
};

export default Customers;