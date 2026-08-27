
import { useEffect, useState } from "react";
import "@google/model-viewer/dist/model-viewer.min.js";
import QRCode from "qrcode";

import "./App.css";

function App() {
  const [menu, setMenu] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [qrCodeURL, setQrCodeURL] = useState("");

  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Food");
  const [URLmodel, setURLmodel] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [paymentMessage, setPaymentMessage] = useState("");

  const websiteURL = window.location.origin;

  const getMenu = () => {
    fetch("/api/get")
      .then((response) => response.json())
      .then((data) => {
        setMenu(data.fullmenu || []);
      })
      .catch((error) => {
        console.log("Menu error:", error);
      });
  };

  useEffect(() => {
    getMenu();
  }, []);

  useEffect(() => {
    QRCode.toDataURL(websiteURL)
      .then((url) => {
        setQrCodeURL(url);
      })
      .catch((error) => {
        console.log("QR Error:", error);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("payment") === "success") {
      setPaymentMessage("success");

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

    if (params.get("payment") === "cancel") {
      setPaymentMessage("cancel");

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }, []);

  const viewAR = (modelURL) => {
    setSelectedModel(modelURL);
  };

  const handleAdminClick = () => {
    setShowAdmin(!showAdmin);
    setAdminError("");
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (adminPassword === "admin123") {
      setIsAdminLoggedIn(true);
      setAdminPassword("");
      setAdminError("");
    } else {
      setAdminError("Wrong password");
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setShowAdmin(false);
    setAdminPassword("");
  };

  const addMenu = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/add", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          price: Number(price),
          category,
          URLmodel,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Menu added successfully");

        setName("");
        setPrice("");
        setCategory("Food");
        setURLmodel("");

        getMenu();
      } else {
        alert(data.message || "Menu add nahi hua");
      }
    } catch (error) {
      console.log("Add menu error:", error);
      alert("Something went wrong");
    }
  };

  const handlePayment = async (item) => {
    try {
      const response = await fetch(
        "/api/create-checkout-session",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: item.name,
            price: item.price,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        setPaymentMessage("failed");
      }
    } catch (error) {
      console.log("Payment error:", error);
      setPaymentMessage("failed");
    }
  };

  const filteredMenu = menu.filter((item) => {
    const categoryMatch =
      selectedCategory === "All" ||
      item.category === selectedCategory;

    const searchMatch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return categoryMatch && searchMatch;
  });

  return (
    <div className="app">

      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">🍽</span>

          <div>
            <h1>AR MENU</h1>
            <p>Experience your food before ordering</p>
          </div>
        </div>

        <button
          className="admin-button"
          onClick={handleAdminClick}
        >
          {showAdmin ? "Close Admin" : "Admin Panel"}
        </button>
      </nav>

      {showAdmin && (
        <section className="admin-section">

          {!isAdminLoggedIn ? (
            <div className="admin-login-card">

              <div className="section-title">
                <span>ADMIN ACCESS</span>

                <h2>Admin Login</h2>

                <p>
                  Enter your password to manage the menu.
                </p>
              </div>

              <form onSubmit={handleAdminLogin}>

                <div className="input-group">
                  <label>Password</label>

                  <input
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) =>
                      setAdminPassword(e.target.value)
                    }
                    required
                  />
                </div>

                {adminError && (
                  <p className="admin-error">
                    {adminError}
                  </p>
                )}

                <button
                  type="submit"
                  className="add-button"
                >
                  Login
                </button>

              </form>

            </div>
          ) : (
            <>
              <div className="admin-top">

                <div className="section-title">
                  <span>ADMIN PANEL</span>

                  <h2>Add a New Menu Item</h2>

                  <p>
                    Add your food details and Cloudinary 3D model link.
                  </p>
                </div>

                <button
                  className="logout-button"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>

              <div className="admin-card">

                <form onSubmit={addMenu}>

                  <div className="input-group">
                    <label>Item Name</label>

                    <input
                      type="text"
                      placeholder="e.g. Chicken Burger"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Price</label>

                    <input
                      type="number"
                      placeholder="e.g. 1200"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label>Category</label>

                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value)
                      }
                    >
                      <option value="Food">Food</option>
                      <option value="Drinks">Drinks</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label>Availability</label>

                    <input
                      type="text"
                      value="Available"
                      disabled
                    />
                  </div>

                  <div className="input-group full-width">
                    <label>3D Model URL</label>

                    <input
                      type="text"
                      placeholder="Paste Cloudinary .glb URL"
                      value={URLmodel}
                      onChange={(e) =>
                        setURLmodel(e.target.value)
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="add-button"
                  >
                    Add Menu Item
                  </button>

                </form>

              </div>
            </>
          )}

        </section>
      )}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-tag">
            INTERACTIVE DINING EXPERIENCE
          </span>

          <h2>
            Explore Your Food
            <span> Before You Order.</span>
          </h2>

          <p>
            View realistic 3D food models and place them
            directly into your space using Augmented Reality.
          </p>

          <div className="hero-stats">

            <div>
              <strong>{menu.length}</strong>
              <span>Menu Items</span>
            </div>

            <div>
              <strong>3D</strong>
              <span>Interactive Models</span>
            </div>

            <div>
              <strong>AR</strong>
              <span>Real World View</span>
            </div>

          </div>

        </div>

        {qrCodeURL && (
          <div className="qr-card">

            <div className="qr-header">

              <span className="qr-icon">📱</span>

              <div>
                <h3>Open on Mobile</h3>
                <p>Scan to experience AR</p>
              </div>

            </div>

            <div className="qr-image">
              <img
                src={qrCodeURL}
                alt="AR Menu QR Code"
              />
            </div>

            <span className="qr-footer">
              Scan with your phone camera
            </span>

          </div>
        )}

      </section>

      <section className="menu-section">

        <div className="menu-heading">

          <div>
            <span className="section-label">
              OUR DIGITAL MENU
            </span>

            <h2>
              Choose Your Experience
            </h2>
          </div>

          <p>
            Select any item to explore it in 3D,
            view it in AR, or proceed to payment.
          </p>

        </div>

        <div className="search-container">

          <input
            type="text"
            className="search-input"
            placeholder="Search food or drinks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="category-filters">

          {["All", "Food", "Drinks", "Desserts"].map(
            (itemCategory) => (
              <button
                key={itemCategory}
                className={
                  selectedCategory === itemCategory
                    ? "category-button active-category"
                    : "category-button"
                }
                onClick={() =>
                  setSelectedCategory(itemCategory)
                }
              >
                {itemCategory}
              </button>
            )
          )}

        </div>

        <div className="menu-container">

          {filteredMenu.length === 0 && (
            <div className="empty-menu">

              <h3>No items found</h3>

              <p>
                Try another category or search for something else.
              </p>

            </div>
          )}

          {filteredMenu.map((item, index) => (
            <div
              key={item._id}
              className="menu-card"
            >

              <div className="card-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="card-content">

                <span className="item-label">
                  {item.category || "Food"}
                </span>

                <h2>{item.name}</h2>

                <p className="price">
                  Rs. {item.price}
                </p>

              </div>

              <button
                className="ar-view-button"
                onClick={() =>
                  viewAR(item.URLmodel)
                }
              >
                <span>View in AR</span>
                <span className="arrow">→</span>
              </button>

              <button
                className="pay-button"
                onClick={() =>
                  handlePayment(item)
                }
              >
                Pay Now
              </button>

            </div>
          ))}

        </div>

      </section>

      {selectedModel && (
        <div className="model-overlay">

          <div className="model-modal">

            <div className="model-header">

              <div>
                <span className="section-label">
                  AR PREVIEW
                </span>

                <h2>
                  Explore Your Selection
                </h2>
              </div>

              <button
                className="close-button"
                onClick={() =>
                  setSelectedModel(null)
                }
              >
                ✕
              </button>

            </div>

            <model-viewer
              src={selectedModel}
              camera-controls
              auto-rotate
              auto-rotate-delay="0"
              min-camera-orbit="-45deg 65deg auto"
              max-camera-orbit="45deg 110deg auto"
              min-field-of-view="25deg"
              max-field-of-view="45deg"
              ar
              ar-modes="webxr scene-viewer quick-look"
              ar-placement="floor"
              ar-scale="auto"
              shadow-intensity="1"
              className="model-viewer"
            >

              <button
                slot="ar-button"
                className="launch-ar-button"
              >
                View in your space 📱
              </button>

            </model-viewer>

          </div>

        </div>
      )}

      {paymentMessage && (
        <div className="payment-popup-overlay">

          <div className="payment-popup">

            {paymentMessage === "success" && (
              <>
                <div className="payment-popup-icon success-popup">
                  ✓
                </div>

                <h2>Payment Successful!</h2>

                <p>
                  Your payment has been completed successfully.
                </p>

                <p className="popup-small-text">
                  Thank you for your order!
                </p>
              </>
            )}

            {paymentMessage === "cancel" && (
              <>
                <div className="payment-popup-icon cancel-popup">
                  ✕
                </div>

                <h2>Payment Cancelled</h2>

                <p>
                  Your payment was not completed.
                </p>
              </>
            )}

            {paymentMessage === "failed" && (
              <>
                <div className="payment-popup-icon cancel-popup">
                  ✕
                </div>

                <h2>Payment Failed</h2>

                <p>
                  Something went wrong. Please try again.
                </p>
              </>
            )}

            <button
              className="popup-button"
              onClick={() =>
                setPaymentMessage("")
              }
            >
              Continue
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;

