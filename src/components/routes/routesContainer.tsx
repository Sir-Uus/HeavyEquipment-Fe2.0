import { Route, Routes } from "react-router-dom";
import ForgotPassword from "../forgotPassword/forgotPassword";
import EquipmentDetails from "../equipmentDetails/equipmentDetails";
import PartsDetails from "../partsDetails/partsDetails";
import MakeRentalRequest from "../makeRentalRequest/makeRentalRequest";
import MakePayment from "../makePayment/makePayment";
import Confirmation from "../confirmation/confirmation";
import Home from "../../pages/User/Home";
import About from "../../pages/User/About";
import Order from "../../pages/User/Order";
import HeavyEquipment from "../heavyEquipment/heavyEquipment";
import Parts from "../parts/parts";
import Forbidden from "../forbidden/forbidden";
import Admin from "../../pages/admin/admin";
import Login from "../login/login";
import Register from "../register/register";
import ProtectedRoute from "../protectedRoute/protectedRoute";
import OrderDetail from "../../pages/User/OrderDetails";
import RentalRequestDetail from "../rentalRequestDetail/rentalRequestDetail";
import TransactionHistory from "../transactionHistory/transactionHistory";
import TransactionDetail from "../transactionDetail/transactionDetail";
import Cart from "../cart/cart";
import Otp from "../otp/otp";
import SparepartBuyingDetail from "../sparepartBuyingDetail/sparepartBuyingDetail";
const RoutesContainer = () => {
  return (
    <>
      <Routes>
        {/* Admin Route Protected */}
        <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/order" element={<Order />} />
        <Route path="/buying-sparepart" element={<SparepartBuyingDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/transaction-history" element={<TransactionHistory />} />
        <Route path="/transaction-history/:transactionId" element={<TransactionDetail />} />
        <Route path="/equipment" element={<HeavyEquipment />} />
        <Route path="/parts" element={<Parts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<Otp />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route path="/equipment/details/:id" element={<EquipmentDetails />} />
        <Route path="/parts/details/:id" element={<PartsDetails />} />
        <Route path="/equipment/details/:id/rental-request" element={<MakeRentalRequest />} />
        <Route
          path="/equipment/details/:equipmentId/rental-request/:rentalRequestId"
          element={<RentalRequestDetail />}
        />
        <Route
          path="/equipment/details/:id/rental-request/:rentalRequestId/payment"
          element={<MakePayment />}
        />
        <Route
          path="/equipment/details/:id/rental-request/:rentalRequestId/payment/:paymentId/confirmation"
          element={<Confirmation />}
        />
        <Route path="/order/order-detail" element={<OrderDetail />} />
      </Routes>
    </>
  );
};

export default RoutesContainer;
