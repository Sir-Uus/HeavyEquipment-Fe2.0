import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Drawer, Tooltip } from "@mui/material";
import "./navbar.css";

const Navbar = () => {
  const [menu, setMenu] = useState<string>("home");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState<number>(0);
  const role = localStorage.getItem("role");

  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItemCount(cartItems.length);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    updateCartCount();
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }

    const displayName = localStorage.getItem("displayName");
    if (displayName) {
      setDisplayName(displayName);
    }

    const pathMenuMap: { [key: string]: string } = {
      "/": "home",
      "/about-us": "about-us",
      "/equipment": "equipment",
      "/parts": "parts",
      "/order": "order",
      "/transaction-history": "transaction-history",
    };

    const activeMenu = pathMenuMap[location.pathname] || "";
    setMenu(activeMenu);

    window.addEventListener("storage", updateCartCount);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("resize", handleResize);
    };
  }, [location.pathname]);

  const handleMenuClick = (menuName: string) => {
    setMenu(menuName);
    setIsDrawerOpen(false);
    localStorage.setItem("activeMenu", menuName);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");
    localStorage.removeItem("displayName");
    localStorage.removeItem("activeMenu");
    localStorage?.removeItem("fblst_560920773058158");
    setIsAuthenticated(false);
    setShowConfirmModal(false);
    navigate("/");
    window.location.reload();
  };

  const confirmLogout = () => {
    setShowConfirmModal(true);
  };

  const closeModal = () => {
    setShowConfirmModal(false);
  };

  return (
    <div className="navbar">
      <div className="nav-logo">
        <p className="heavy">HEAVY</p> <p>EQUIPMENT</p>
      </div>

      {isMobile ? (
        <div className="hamburger" onClick={() => setIsDrawerOpen(true)}>
          <span className="material-icons">menu</span>
        </div>
      ) : (
        <ul className="nav-menu">
          <Link to="/" onClick={() => handleMenuClick("home")}>
            <li>Home {menu === "home" ? <hr /> : null}</li>
          </Link>
          <Link to="/about-us" onClick={() => handleMenuClick("about-us")}>
            <li>About {menu === "about-us" ? <hr /> : null}</li>
          </Link>
          <Link to="/equipment" onClick={() => handleMenuClick("equipment")}>
            <li>Equipment {menu === "equipment" ? <hr /> : null}</li>
          </Link>
          <Link to="/parts" onClick={() => handleMenuClick("parts")}>
            <li>Parts {menu === "parts" ? <hr /> : null}</li>
          </Link>
          {isAuthenticated && (
            <>
              <Link to="/order" onClick={() => handleMenuClick("order")}>
                <li>Order {menu === "order" ? <hr /> : null}</li>
              </Link>
              <Link to="/transaction-history" onClick={() => handleMenuClick("transaction-history")}>
                <li>Transaction History {menu === "transaction-history" ? <hr /> : null}</li>
              </Link>
            </>
          )}
        </ul>
      )}

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <div className="drawer-menu" style={{ padding: "20px", width: "250px" }}>
          <ul className="drawer-menu">
            <Link to="/" onClick={() => handleMenuClick("home")}>
              <li>Home {menu === "home" ? <hr /> : null}</li>
            </Link>
            <Link to="/about-us" onClick={() => handleMenuClick("about-us")}>
              <li>About {menu === "about-us" ? <hr /> : null}</li>
            </Link>
            <Link to="/equipment" onClick={() => handleMenuClick("equipment")}>
              <li>Equipment {menu === "equipment" ? <hr /> : null}</li>
            </Link>
            <Link to="/parts" onClick={() => handleMenuClick("parts")}>
              <li>Parts {menu === "parts" ? <hr /> : null}</li>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/order" onClick={() => handleMenuClick("order")}>
                  <li>Order {menu === "order" ? <hr /> : null}</li>
                </Link>
                <Link to="/transaction-history" onClick={() => handleMenuClick("transaction-history")}>
                  <li>Transaction History {menu === "transaction-history" ? <hr /> : null}</li>
                </Link>
                <Link to="/login">
                  <button>Login</button>
                </Link>
              </>
            )}
          </ul>
        </div>
      </Drawer>

      {isAuthenticated ? (
        <div className="logout-group">
          <div className="displayName">
            <Tooltip title="Cart" arrow>
              <Link to="/cart" className="cart-icon">
                <span className="material-icons mr-1 md:text-[18px] text-sm lg:text-2xl lg:mt-[-2px] ">
                  shopping_cart
                </span>
                {cartItemCount > 0 && <span className="cart-item-count">{cartItemCount}</span>}
              </Link>
            </Tooltip>
            <Tooltip title="Chat" arrow>
              <Link to="/chat">
                <span className="material-icons text-sm lg:text-2xl lg:mt-[-2px]  md:text-[18px]">chat</span>
              </Link>
            </Tooltip>
            {role === "Admin" ? (
              <Link to="/admin">
                <span className="material-icons text-sm lg:text-2xl lg:mt-[-2px]  md:text-[18px]">
                  account_circle
                </span>
              </Link>
            ) : (
              <span className="material-icons text-sm lg:text-2xl lg:mt-[-2px]  md:text-[18px]">
                account_circle
              </span>
            )}
            <p>{displayName}</p>
          </div>
          <div className="logout-button">
            <button onClick={confirmLogout}>Logout</button>
          </div>
        </div>
      ) : (
        <div className="login-button">
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md transform transition-all duration-500 ease-out animate-fade-in-up">
            <button onClick={closeModal} className="absolute top-2 right-2 text-xl font-bold">
              &times;
            </button>
            <h2 className="font-semibold mb-4 flex gap-2 justify-center">
              <span className="material-icons">info</span>Confirm Logout
            </h2>
            <p className="font-semibold">Are you sure you want to logout?</p>
            <div className="mt-4 flex justify-center">
              <button
                className="px-20 py-2 bg-yellow-400 text-white transition duration-300 ease-in hover:bg-yellow-500 rounded-md"
                onClick={handleLogout}
              >
                <div className="flex gap-2">
                  <span className="material-icons text-[18px] mt-[3px]">exit_to_app</span>Confirm
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
