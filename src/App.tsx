import { BrowserRouter, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import "react-toastify/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import RoutesContainer from "./components/routes/routesContainer";
import "./App.css";
import Chat from "./components/chat/chat";

function App() {
  return (
    <BrowserRouter>
      <Content />
    </BrowserRouter>
  );
}

function Content() {
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith("/admin");
  const showNavbar =
    !isAdminPath &&
    (["/", "/aboutUs", "/equipment", "/parts", "/order", "/Transaction-history"].includes(
      location.pathname
    ) ||
      location.pathname.startsWith("/equipment/details/") ||
      location.pathname.startsWith("/parts/details/") ||
      location.pathname.startsWith("/order") ||
      location.pathname.startsWith("/transaction-history"));

  return (
    <div>
      {!isAdminPath && showNavbar && <Navbar />}
      <div className="main-content">
        <RoutesContainer />
        <Chat />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
