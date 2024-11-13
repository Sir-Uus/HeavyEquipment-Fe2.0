import { Route, Routes } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import UpdateEquipmenPages from "../Equipment/updateEquipment/updateEquipmenPagest";
import GetEquipment from "../Equipment/getEquipment/getEquipment";
import GetPerformancedFeedback from "../PerformancedFeedback/getPerformancedFeedback/getPerformancedFeedback";
import GetMaintenanceRecord from "../MaintenanceRecord/getMaintenancedRecord/getMaintenanceRecord";
import GetRentalHistory from "../RentalHistory/getRentalHistory/getRentalHistory";
import GetSparePart from "../SparePart/getSparePart/getSparePart";
import GetRentalRequest from "../RentalRequest/getRentalRequest/getRentalRequestPages";
import GetPayment from "../Payment/getPayment/getPayment";
import CreateRentalHistoryPages from "../RentalHistory/createRentalHistory/createRentalHistoryPages";
import UpdateRentalRequestPages from "../RentalRequest/updateRentalRequest/updateRentalRequest";
import UpdatePerformancedFeedbackPages from "../PerformancedFeedback/updatePerformancedFeedback/updatePerformancedFeedbackPages";
import UpdateMaintenanceRecordPages from "../MaintenanceRecord/updateMaintenanceRecord/updateMaintenanceRecordPages";
import UpdateSparePartPages from "../SparePart/updateSparePart/updateSparePartPages";
import UpdatePaymentPages from "../Payment/updatePayment/updatePaymentPages";
import UpdateRentalHistoryPages from "../RentalHistory/updateRentalHistory/updateRentalHistoryPages";
import CreatePerformancedFeedbackPages from "../PerformancedFeedback/createPerformancedFeedback/createPerformancedFeedbackPages";
import CreateMaintenanceRecordPages from "../MaintenanceRecord/createMaintenanceRecord/createMaintenanceRecordPages";
import CreateSparePartPages from "../SparePart/createSparePart/createSparePartPages";
import CreateRentalRequestPages from "../RentalRequest/createRentalRequest/createRentalRequestPages";
import CreatePaymentPages from "../Payment/createPayment/createPaymentPages";
import CreateEquipmentPages from "../Equipment/createEquipment/createEquipmentPages";
import Dashbord from "../../components/dashboard/dashbord";

const Admin = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 p-4 overflow-x-hidden ml-64 mt-[50px]">
        <Routes>
          <Route index element={<Dashbord />} />
          <Route path="/dashboard" element={<Dashbord />} />
          {/* Equipment */}
          <Route path="/add-equipment" element={<CreateEquipmentPages />} />
          <Route path="/list-equipment" element={<GetEquipment />} />
          <Route path="/update-equipment/:id" element={<UpdateEquipmenPages />} />
          {/* Feedback */}
          <Route path="/add-feedback" element={<CreatePerformancedFeedbackPages />} />
          <Route path="/update-feedback/:id" element={<UpdatePerformancedFeedbackPages />} />
          <Route path="/list-feedback" element={<GetPerformancedFeedback />} />
          {/* Maintenance Record */}
          <Route path="/add-maintenance-record" element={<CreateMaintenanceRecordPages />} />
          <Route path="/update-maintenance-record/:id" element={<UpdateMaintenanceRecordPages />} />
          <Route path="/list-maintenance-record" element={<GetMaintenanceRecord />} />
          {/* Rental History */}
          <Route path="/add-rental-history" element={<CreateRentalHistoryPages />} />
          <Route path="/update-rental-history/:id" element={<UpdateRentalHistoryPages />} />
          <Route path="/list-rental-history" element={<GetRentalHistory />} />
          {/* Spare Part */}
          <Route path="/add-sparepart" element={<CreateSparePartPages />} />
          <Route path="/update-sparepart/:id" element={<UpdateSparePartPages />} />
          <Route path="/list-sparepart" element={<GetSparePart />} />
          {/* Rental Request */}
          <Route path="/add-rental-request" element={<CreateRentalRequestPages />} />
          <Route path="/update-rental-request/:id" element={<UpdateRentalRequestPages />} />
          <Route path="/list-rental-request" element={<GetRentalRequest />} />
          {/* Payment Request */}
          <Route path="/add-payment" element={<CreatePaymentPages />} />
          <Route path="/update-payment/:id" element={<UpdatePaymentPages />} />
          <Route path="/list-payment" element={<GetPayment />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
