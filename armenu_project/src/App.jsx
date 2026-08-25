
import { useEffect, useState } from "react";
import "@google/model-viewer/dist/model-viewer.min.js";
import QRCode from "qrcode";

import "./App.css";


function App() {

  const [menu, setMenu] = useState([]);

  const [selectedModel, setSelectedModel] = useState(null);

  const [qrCodeURL, setQrCodeURL] = useState("");

  const [showAdmin, setShowAdmin] = useState(false);

  const [name, setName] = useState("");

  const [price, setPrice] = useState("");

  const [URLmodel, setURLmodel] = useState("");


  // Mobile se website open karne ka URL

  const websiteURL = "http://192.168.18.238:5173";


  // Backend se menu data lana

  const getMenu = () => {

    fetch("http://192.168.18.238:3000/get")

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


  // QR Code generate karna

  useEffect(() => {

    QRCode.toDataURL(websiteURL)

      .then((url) => {

        setQrCodeURL(url);

      })

      .catch((error) => {

        console.log("QR Error:", error);

      });

  }, []);


  // Selected 3D model set karna

  const viewAR = (modelURL) => {

    setSelectedModel(modelURL);

  };


  // Admin Panel se MongoDB mein data add karna

  const addMenu = async (e) => {

    e.preventDefault();


    try {

      const response = await fetch(

        "http://192.168.18.238:3000/add",

        {

          method: "POST",


          headers: {

            "Content-Type": "application/json",

          },


          body: JSON.stringify({

            name: name,

            price: Number(price),

            URLmodel: URLmodel,

          }),

        }

      );


      const data = await response.json();


      if (data.success) {

        alert("Menu added successfully");


        setName("");

        setPrice("");

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


  // Stripe Payment

  const handlePayment = async (item) => {

    try {

      const response = await fetch(

        "http://192.168.18.238:3000/create-checkout-session",

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


      console.log("Payment response:", data);


      if (response.ok && data.url) {

        window.location.href = data.url;

      } else {

        alert(data.message || "Payment failed");

      }

    } catch (error) {

      console.log("Payment error:", error);

      alert("Payment failed");

    }

  };


  return (

    <div className="app">


      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">

          <span className="logo-icon">

            🍽

          </span>


          <div>

            <h1>

              AR MENU

            </h1>


            <p>

              Experience your food before ordering

            </p>

          </div>

        </div>


        <button

          className="admin-button"

          onClick={() => setShowAdmin(!showAdmin)}

        >

          {showAdmin ? "Close Admin" : "Admin Panel"}

        </button>

      </nav>


      {/* ADMIN PANEL */}

      {showAdmin && (

        <section className="admin-section">

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


          <div className="admin-card">

            <form onSubmit={addMenu}>


              <div className="input-group">

                <label>

                  Food Name

                </label>


                <input

                  type="text"

                  placeholder="e.g. Chicken Burger"

                  value={name}

                  onChange={(e) => setName(e.target.value)}

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

                  onChange={(e) => setPrice(e.target.value)}

                  required

                />

              </div>


              <div className="input-group full-width">

                <label>

                  3D Model URL

                </label>


                <input

                  type="text"

                  placeholder="Paste your Cloudinary .glb URL here"

                  value={URLmodel}

                  onChange={(e) => setURLmodel(e.target.value)}

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

        </section>

      )}


      {/* HERO SECTION */}

      <section className="hero">

        <div className="hero-content">

          <span className="hero-tag">

            INTERACTIVE DINING EXPERIENCE

          </span>


          <h2>

            Explore Your Food

            <span>

              {" "}Before You Order.

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


        {/* QR CODE */}

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


      {/* MENU */}

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


        <div className="menu-container">


          {menu.length === 0 && (

            <div className="empty-menu">

              <h3>

                No menu items yet

              </h3>


              <p>

                Open the Admin Panel and add your first item.

              </p>

            </div>

          )}


          {menu.map((item, index) => (

            <div

              key={item._id}

              className="menu-card"

            >

              <div className="card-number">

                {String(index + 1).padStart(2, "0")}

              </div>


              <div className="card-content">

                <span className="item-label">

                  AVAILABLE NOW

                </span>


                <h2>

                  {item.name}

                </h2>


                <p className="price">

                  Rs. {item.price}

                </p>

              </div>


              {/* VIEW AR */}

              <button

                className="ar-view-button"

                onClick={() => viewAR(item.URLmodel)}

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

                onClick={() => handlePayment(item)}

              >

                Pay Now

              </button>

            </div>

          ))}

        </div>

      </section>


      {/* 3D MODEL + AR */}

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

                onClick={() => setSelectedModel(null)}

              >

                ✕

              </button>

            </div>


            <model-viewer

              src={selectedModel}

              camera-controls

              auto-rotate

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

    </div>

  );
}


export default App;

