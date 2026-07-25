import { useState } from "react";
import axios from "axios";
import Products from "./Products";
import Customers from "./Customers";
import SalesChallans from "./SalesChallans";

function App() {
  // =========================
  // LOGIN STATE
  // =========================
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // =========================
  // PAGE STATE
  // =========================
  const [currentPage, setCurrentPage] = useState("dashboard");

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        localStorage.setItem(
          "token",
          response.data.token
        );

        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        setUser(response.data.user);
      }
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Login failed"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setCurrentPage("dashboard");
  };

  // =========================
  // LOGIN PAGE
  // =========================
  if (!user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f1f5f9",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "400px",
            maxWidth: "100%",
            padding: "40px",
            backgroundColor: "white",
            borderRadius: "16px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08)",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              color: "#0f172a",
              marginBottom: "10px",
            }}
          >
            Mini ERP CRM
          </h1>

          <p
            style={{
              textAlign: "center",
              color: "#64748b",
              marginBottom: "30px",
            }}
          >
            Login to your account
          </p>

          <form onSubmit={handleLogin}>
            {/* EMAIL */}
            <div
              style={{
                marginBottom: "20px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#334155",
                  fontWeight: "600",
                }}
              >
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  boxSizing: "border-box",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>

            {/* PASSWORD */}
            <div
              style={{
                marginBottom: "25px",
              }}
            >
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#334155",
                  fontWeight: "600",
                }}
              >
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter your password"
                required
                style={{
                  width: "100%",
                  padding: "12px",
                  boxSizing: "border-box",
                  border:
                    "1px solid #cbd5e1",
                  borderRadius: "8px",
                  outline: "none",
                  fontSize: "14px",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  // =========================
  // PRODUCTS PAGE
  // =========================
  if (currentPage === "products") {
    return (
      <Products
        onBack={() =>
          setCurrentPage("dashboard")
        }
      />
    );
  }

  // =========================
  // CUSTOMERS PAGE
  // =========================
  if (currentPage === "customers") {
    return (
      <Customers
        onBack={() =>
          setCurrentPage("dashboard")
        }
      />
    );
  }

  // =========================
  // SALES CHALLANS PAGE
  // =========================
  if (currentPage === "sales-challans") {
    return (
      <SalesChallans
        onBack={() =>
          setCurrentPage("dashboard")
        }
      />
    );
  }

  // =========================
  // DASHBOARD
  // =========================
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* =========================
          SIDEBAR
      ========================= */}
      <aside
        style={{
          width: "250px",
          minHeight: "100vh",
          backgroundColor: "#0f172a",
          color: "white",
          padding: "30px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* LOGO */}
        <div
          style={{
            padding: "0 10px",
            marginBottom: "35px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
            }}
          >
            Mini ERP CRM
          </h2>

          <p
            style={{
              marginTop: "6px",
              marginBottom: 0,
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            Business Management
          </p>
        </div>

        {/* =========================
            USER / ADMIN INFORMATION
        ========================= */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "white",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
           👤 {user.name}
          </p>

          <p
            style={{
              margin: "5px 0 0",
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
             {user.role}
          </p>
        </div>

        {/* =========================
            DASHBOARD BUTTON
        ========================= */}
        <button
          onClick={() =>
            setCurrentPage("dashboard")
          }
          style={{
            width: "100%",
            padding: "13px 15px",
            marginBottom: "8px",
            textAlign: "left",
            backgroundColor:
              currentPage === "dashboard"
                ? "#2563eb"
                : "transparent",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          🏠 Dashboard
        </button>

        {/* =========================
            PRODUCTS BUTTON
        ========================= */}
        <button
          onClick={() =>
            setCurrentPage("products")
          }
          style={{
            width: "100%",
            padding: "13px 15px",
            marginBottom: "8px",
            textAlign: "left",
            backgroundColor:
              currentPage === "products"
                ? "#2563eb"
                : "transparent",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          📦 Products
        </button>

        {/* =========================
            CUSTOMERS BUTTON
        ========================= */}
        <button
          onClick={() =>
            setCurrentPage("customers")
          }
          style={{
            width: "100%",
            padding: "13px 15px",
            marginBottom: "8px",
            textAlign: "left",
            backgroundColor:
              currentPage === "customers"
                ? "#2563eb"
                : "transparent",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          👤 Customers
        </button>

        {/* =========================
            SALES CHALLANS BUTTON
        ========================= */}
        <button
          onClick={() =>
            setCurrentPage("sales-challans")
          }
          style={{
            width: "100%",
            padding: "13px 15px",
            marginBottom: "8px",
            textAlign: "left",
            backgroundColor:
              currentPage === "sales-challans"
                ? "#2563eb"
                : "transparent",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          🧾 Sales Challans
        </button>

        {/* =========================
            LOGOUT
        ========================= */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "30px",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================= */}
      <main
        style={{
          flex: 1,
          padding: "50px 60px",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          {/* =========================
              WELCOME HEADER
          ========================= */}
          <div
            style={{
              marginBottom: "35px",
            }}
          >
            <p
              style={{
                color: "#2563eb",
                fontWeight: "600",
                fontSize: "14px",
                margin: "0 0 8px",
                letterSpacing: "0.5px",
              }}
            >
              BUSINESS OVERVIEW
            </p>

            <h1
              style={{
                color: "#0f172a",
                fontSize: "34px",
                margin: 0,
                fontWeight: "700",
              }}
            >
              Welcome back, {user.name}! 👋
            </h1>

            <p
              style={{
                color: "#64748b",
                fontSize: "16px",
                margin: "10px 0 0",
              }}
            >
              Manage your business from one
              simple dashboard.
            </p>
          </div>

          {/* =========================
              DASHBOARD CARDS
          ========================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {/* =========================
                PRODUCTS CARD
            ========================= */}
            <div
              onClick={() =>
                setCurrentPage("products")
              }
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "14px",
                boxShadow:
                  "0 4px 15px rgba(15, 23, 42, 0.06)",
                cursor: "pointer",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#eff6ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginBottom: "18px",
                }}
              >
                📦
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#0f172a",
                  fontSize: "18px",
                }}
              >
                Products
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                Manage products, prices and
                inventory stock.
              </p>
            </div>

            {/* =========================
                CUSTOMERS CARD
            ========================= */}
            <div
              onClick={() =>
                setCurrentPage("customers")
              }
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "14px",
                boxShadow:
                  "0 4px 15px rgba(15, 23, 42, 0.06)",
                cursor: "pointer",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#f0fdf4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginBottom: "18px",
                }}
              >
                👤
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#0f172a",
                  fontSize: "18px",
                }}
              >
                Customers
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                Manage customer information
                and relationships.
              </p>
            </div>

            {/* =========================
                SALES CHALLANS CARD
            ========================= */}
            <div
              onClick={() =>
                setCurrentPage("sales-challans")
              }
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "14px",
                boxShadow:
                  "0 4px 15px rgba(15, 23, 42, 0.06)",
                cursor: "pointer",
                border:
                  "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "12px",
                  backgroundColor: "#fff7ed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px",
                  marginBottom: "18px",
                }}
              >
                🧾
              </div>

              <h3
                style={{
                  margin: "0 0 8px",
                  color: "#0f172a",
                  fontSize: "18px",
                }}
              >
                Sales Challans
              </h3>

              <p
                style={{
                  margin: 0,
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.5",
                }}
              >
                Create and manage sales
                challans and product sales.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;