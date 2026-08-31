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

  // Popup states
  const [popupType, setPopupType] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [deleteId, setDeleteId] = useState("");

  // Update states
  const [showUpdate, setShowUpdate] = useState(false);
  const [updateId, setUpdateId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateCategory, setUpdateCategory] = useState("Food");
  const [updateURLmodel, setUpdateURLmodel] = useState("");

  const websiteURL = window.location.origin;

  // =========================
  // GET MENU
  // =========================

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

  // =========================
  // QR CODE
  // =========================

  useEffect(() => {
    QRCode.toDataURL(websiteURL)
      .then((url) => {
        setQrCodeURL(url);
      })
      .catch((error) => {
        console.log("QR Error:", error);
      });
  }, [websiteURL]);

  // =========================
  // PAYMENT RESULT
  // =========================

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

  // =========================
  // VIEW AR
  // =========================

  const viewAR = (modelURL) => {
    setSelectedModel(modelURL);
  };

  // =========================
  // ADMIN
  // =========================

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

  // =========================
  // ADD MENU
  // =========================

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
        setName("");
        setPrice("");
        setCategory("Food");
        setURLmodel("");

        getMenu();

        setPopupType("success");
        setPopupMessage("Menu item added successfully!");
      } else {
        setPopupType("error");
        setPopupMessage(data.message || "Menu add nahi hua");
      }
    } catch (error) {
      console.log("Add menu error:", error);

      setPopupType("error");
      setPopupMessage("Something went wrong");
    }
  };

  // =========================
  // DELETE MENU
  // =========================

  const handleDelete = (id) => {
    setDeleteId(id);
    setPopupType("delete-confirm");
    setPopupMessage(
      "Are you sure you want to delete this menu item?"
    );
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `/api/delete/${deleteId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        setDeleteId("");

        getMenu();

        setPopupType("success");
        setPopupMessage(
          "Menu item deleted successfully!"
        );
      } else {
        setPopupType("error");
        setPopupMessage(
          data.message || "Menu delete nahi hua"
        );
      }
    } catch (error) {
      console.log("Delete menu error:", error);

      setPopupType("error");
      setPopupMessage("Something went wrong");
    }
  };

  // =========================
  // UPDATE MENU
  // =========================

  const handleUpdateClick = (item) => {
    setUpdateId(item._id);
    setUpdateName(item.name);
    setUpdatePrice(item.price);
    setUpdateCategory(item.category || "Food");
    setUpdateURLmodel(item.URLmodel);

    setShowUpdate(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/api/update/${updateId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: updateName,
            price: Number(updatePrice),
            category: updateCategory,
            URLmodel: updateURLmodel,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setShowUpdate(false);

        getMenu();

        setPopupType("success");
        setPopupMessage(
          "Menu item updated successfully!"
        );
      } else {
        setPopupType("error");
        setPopupMessage(
          data.message || "Menu update nahi hua"
        );
      }
    } catch (error) {
      console.log("Update menu error:", error);

      setPopupType("error");
      setPopupMessage("Something went wrong");
    }
  };

  // =========================
  // PAYMENT
  // =========================

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

  // =========================
  // SEARCH + FILTER
  // =========================

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

      {/* =========================
          NAVBAR
      ========================= */}

      <nav className="navbar">

        <div className="logo">

          <span className="logo-icon">
            🍽
          </span>

          <div>
            <h1>AR MENU</h1>

            <p>
              Experience your food before ordering
            </p>
          </div>

        </div>

        <button
          className="admin-button"
          onClick={handleAdminClick}
        >
          {showAdmin
            ? "Close Admin"
            : "Admin Panel"}
        </button>

      </nav>


      {/* =========================
          ADMIN PANEL
      ========================= */}

      {showAdmin && (

        <section className="admin-section">

          {!isAdminLoggedIn ? (

            <div className="admin-login-card">

              <div className="section-title">

                <span>
                  ADMIN ACCESS
                </span>

                <h2>
                  Admin Login
                </h2>

                <p>
                  Enter your password to manage the menu.
                </p>

              </div>

              <form onSubmit={handleAdminLogin}>

                <div className="input-group">

                  <label>
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter admin password"
                    value={adminPassword}
                    onChange={(e) =>
                      setAdminPassword(
                        e.target.value
                      )
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

                  <span>
                    ADMIN PANEL
                  </span>

                  <h2>
                    Add a New Menu Item
                  </h2>

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

                    <label>
                      Item Name
                    </label>

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

                    <label>
                      Price
                    </label>

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

                    <label>
                      Category
                    </label>

                    <select
                      value={category}
                      onChange={(e) =>
                        setCategory(e.target.value)
                      }
                    >
                      <option value="Food">
                        Food
                      </option>

                      <option value="Drinks">
                        Drinks
                      </option>

                      <option value="Desserts">
                        Desserts
                      </option>
                    </select>

                  </div>


                  <div className="input-group">

                    <label>
                      Availability
                    </label>

                    <input
                      type="text"
                      value="Available"
                      disabled
                    />

                  </div>


                  <div className="input-group full-width">

                    <label>
                      3D Model URL
                    </label>

                    <input
                      type="text"
                      placeholder="Paste Cloudinary .glb URL"
                      value={URLmodel}
                      onChange={(e) =>
                        setURLmodel(
                          e.target.value
                        )
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


      {/* =========================
          HERO
      ========================= */}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-tag">
            INTERACTIVE DINING EXPERIENCE
          </span>

          <h2>
            Explore Your Food
            <span>
              {" "}
              Before You Order.
            </span>
          </h2>

          <p>
            View realistic 3D food models and place them
            directly into your space using Augmented Reality.
          </p>


          <div className="hero-stats">

            <div>

              <strong>
                {menu.length}
              </strong>

              <span>
                Menu Items
              </span>

            </div>


            <div>

              <strong>
                3D
              </strong>

              <span>
                Interactive Models
              </span>

            </div>


            <div>

              <strong>
                AR
              </strong>

              <span>
                Real World View
              </span>

            </div>

          </div>

        </div>


        {qrCodeURL && (

          <div className="qr-card">

            <div className="qr-header">

              <span className="qr-icon">
                📱
              </span>

              <div>

                <h3>
                  Open on Mobile
                </h3>

                <p>
                  Scan to experience AR
                </p>

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


      {/* =========================
          MENU
      ========================= */}

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


        {/* SEARCH */}

        <div className="search-container">

          <input
            type="text"
            className="search-input"
            placeholder="Search food or drinks..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {/* CATEGORIES */}

        <div className="category-filters">

          {[
            "All",
            "Food",
            "Drinks",
            "Desserts",
          ].map((itemCategory) => (

            <button
              key={itemCategory}
              className={
                selectedCategory === itemCategory
                  ? "category-button active-category"
                  : "category-button"
              }
              onClick={() =>
                setSelectedCategory(
                  itemCategory
                )
              }
            >
              {itemCategory}
            </button>

          ))}

        </div>


        {/* MENU CARDS */}

        <div className="menu-container">

          {filteredMenu.length === 0 && (

            <div className="empty-menu">

              <h3>
                No items found
              </h3>

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
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </div>


              <div className="card-content">

                <span className="item-label">
                  {item.category || "Food"}
                </span>

                <h2>
                  {item.name}
                </h2>

                <p className="price">
                  Rs. {item.price}
                </p>

              </div>


              {/* =========================
                  PERMANENT 3D MODEL
              ========================= */}

              <div className="product-model">

                <model-viewer
                  src={item.URLmodel}
                  camera-controls
                  auto-rotate
                  auto-rotate-delay="0"
                  rotation-per-second="20deg"
                  shadow-intensity="1"
                  interaction-prompt="none"
                  loading="lazy"
                >
                </model-viewer>

              </div>


              {/* VIEW IN AR */}

              <button
                className="ar-view-button"
                onClick={() =>
                  viewAR(item.URLmodel)
                }
              >

                <span>
                  View in AR
                </span>

                <span className="arrow">
                  →
                </span>

              </button>


              {/* PAY NOW */}

              <button
                className="pay-button"
                onClick={() =>
                  handlePayment(item)
                }
              >
                Pay Now
              </button>


              {/* ADMIN UPDATE */}

              {isAdminLoggedIn && (

                <button
                  className="update-button"
                  onClick={() =>
                    handleUpdateClick(item)
                  }
                >
                  Update
                </button>

              )}


              {/* ADMIN DELETE */}

              {isAdminLoggedIn && (

                <button
                  className="delete-button"
                  onClick={() =>
                    handleDelete(item._id)
                  }
                >
                  Delete
                </button>

              )}

            </div>

          ))}

        </div>

      </section>


      {/* =========================
          UPDATE MODAL
      ========================= */}

      {showUpdate && (

        <div className="model-overlay">

          <div className="model-modal update-modal">

            <div className="model-header">

              <div>

                <span className="section-label">
                  UPDATE MENU
                </span>

                <h2>
                  Edit Menu Item
                </h2>

              </div>


              <button
                className="close-button"
                onClick={() =>
                  setShowUpdate(false)
                }
              >
                ✕
              </button>

            </div>


            <form onSubmit={handleUpdate}>

              <div className="input-group">

                <label>
                  Item Name
                </label>

                <input
                  type="text"
                  value={updateName}
                  onChange={(e) =>
                    setUpdateName(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  Price
                </label>

                <input
                  type="number"
                  value={updatePrice}
                  onChange={(e) =>
                    setUpdatePrice(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <div className="input-group">

                <label>
                  Category
                </label>

                <select
                  value={updateCategory}
                  onChange={(e) =>
                    setUpdateCategory(
                      e.target.value
                    )
                  }
                >

                  <option value="Food">
                    Food
                  </option>

                  <option value="Drinks">
                    Drinks
                  </option>

                  <option value="Desserts">
                    Desserts
                  </option>

                </select>

              </div>


              <div className="input-group">

                <label>
                  3D Model URL
                </label>

                <input
                  type="text"
                  value={updateURLmodel}
                  onChange={(e) =>
                    setUpdateURLmodel(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              <button
                type="submit"
                className="add-button"
              >
                Save Changes
              </button>

            </form>

          </div>

        </div>

      )}


      {/* =========================
          AR MODAL
      ========================= */}

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


      {/* =========================
          ADD / UPDATE / DELETE POPUPS
      ========================= */}

      {popupType && (

        <div className="payment-popup-overlay">

          <div className="payment-popup">


            {/* SUCCESS */}

            {popupType === "success" && (

              <>

                <div className="payment-popup-icon success-popup">
                  ✓
                </div>

                <h2>
                  Success!
                </h2>

                <p>
                  {popupMessage}
                </p>

                <p className="popup-small-text">
                  Your changes have been saved successfully.
                </p>

                <button
                  className="popup-button"
                  onClick={() => {
                    setPopupType("");
                    setPopupMessage("");
                  }}
                >
                  Continue
                </button>

              </>

            )}


            {/* ERROR */}

            {popupType === "error" && (

              <>

                <div className="payment-popup-icon cancel-popup">
                  ✕
                </div>

                <h2>
                  Something Went Wrong
                </h2>

                <p>
                  {popupMessage}
                </p>

                <button
                  className="popup-button"
                  onClick={() => {
                    setPopupType("");
                    setPopupMessage("");
                  }}
                >
                  Close
                </button>

              </>

            )}


            {/* DELETE CONFIRMATION */}

            {popupType === "delete-confirm" && (

              <>

                <div className="payment-popup-icon cancel-popup">
                  !
                </div>

                <h2>
                  Delete Menu Item?
                </h2>

                <p>
                  {popupMessage}
                </p>

                <p className="popup-small-text">
                  This action cannot be undone.
                </p>


                <div className="popup-actions">

                  <button
                    className="popup-cancel-button"
                    onClick={() => {
                      setPopupType("");
                      setPopupMessage("");
                      setDeleteId("");
                    }}
                  >
                    Cancel
                  </button>


                  <button
                    className="popup-delete-button"
                    onClick={confirmDelete}
                  >
                    Delete
                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      )}


      {/* =========================
          PAYMENT POPUP
      ========================= */}

      {paymentMessage && (

        <div className="payment-popup-overlay">

          <div className="payment-popup">


            {/* PAYMENT SUCCESS */}

            {paymentMessage === "success" && (

              <>

                <div className="payment-popup-icon success-popup">
                  ✓
                </div>

                <h2>
                  Payment Successful!
                </h2>

                <p>
                  Your payment has been completed successfully.
                </p>

                <p className="popup-small-text">
                  Thank you for your order!
                </p>

              </>

            )}


            {/* PAYMENT CANCEL */}

            {paymentMessage === "cancel" && (

              <>

                <div className="payment-popup-icon cancel-popup">
                  ✕
                </div>

                <h2>
                  Payment Cancelled
                </h2>

                <p>
                  Your payment was not completed.
                </p>

              </>

            )}


            {/* PAYMENT FAILED */}

            {paymentMessage === "failed" && (

              <>

                <div className="payment-popup-icon cancel-popup">
                  ✕
                </div>

                <h2>
                  Payment Failed
                </h2>

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