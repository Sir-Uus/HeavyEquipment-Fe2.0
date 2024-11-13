import { Link } from "react-router-dom";
import { formatDate } from "../../utils";
import { useRentalRequests } from "../../hooks/orderHooks/useOrder";
import { useEquipment } from "../../hooks/orderHooks/useEquipmentOption";
import { useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { RentalRequest } from "../../types/RentalRequest";
import { Tooltip, Tabs, Tab } from "@mui/material";

const OrderUser = () => {
  const {
    rentalRequests,
    totalPages,
    currentPage,
    handlePageChange,
    handleStatusChange,
    rentalRequestLoading,
  } = useRentalRequests();

  const maxVisiblePages = 3;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  const [isLoaded, setIsLoaded] = useState(false);
  const [statusTab, setStatusTab] = useState(0);

  const equipmentIds: number[] = [
    ...new Set(rentalRequests.map((req: RentalRequest) => req.equipmentId as number)),
  ];

  const { data: equipmentData } = useEquipment(equipmentIds);
  const equipmentMap = new Map<number, string>();

  equipmentData?.forEach((equipment: any) => {
    equipmentMap.set(equipment.id, equipment.name);
  });

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setStatusTab(newValue);
    if (newValue === 0) {
      handleStatusChange("Pending");
    } else {
      handleStatusChange("Success");
    }
  };

  if (rentalRequestLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDot variant="bob" color="#facc15" size="medium" />
      </div>
    );
  }

  return (
    <div className={`mx-4 mt-[70px] fade-in ${isLoaded ? "active" : ""}`}>
      <Tabs
        value={statusTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="inherit"
        variant="fullWidth"
      >
        <Tab label="Pending Payments" />
        <Tab label="Successful Payments" />
      </Tabs>

      <div className="overflow-x-auto mb-4">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                EQUIPMENT
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                INVOICE
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                START DATE
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                END DATE
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS APPROVAL
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-center">
            {rentalRequests.length > 0 ? (
              rentalRequests.map((record: any) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {equipmentMap.get(record.equipmentId) || "Loading..."}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.invoice}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(record.starDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(record.endDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        record.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : record.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : record.status === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2 justify-center">
                      <Link to={`/equipment/details/${record.equipmentId}/rental-request/${record.id}`}>
                        <Tooltip title="Info" arrow>
                          <button className="px-3 pt-1 bg-blue-800 text-white rounded-md hover:bg-blue-700">
                            <span className="material-icons">info</span>
                          </button>
                        </Tooltip>
                      </Link>
                      {statusTab === 0 && (
                        <Link
                          to={`/equipment/details/${record.equipmentId}/rental-request/${record.id}/payment`}
                        >
                          <Tooltip
                            title={
                              record.status === "Pending"
                                ? "Please wait for admin Approval"
                                : "Proceed to payment"
                            }
                            arrow
                          >
                            <span>
                              <button
                                className={`px-3 pt-1 text-white rounded-md ${
                                  record.status === "Pending"
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-800 hover:bg-green-700"
                                }`}
                                disabled={record.status === "Pending"}
                              >
                                <span className="material-icons">payment</span>
                              </button>
                            </span>
                          </Tooltip>
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No rental requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`pt-[2px] text-[12px] rounded-md mr-8 ${
            currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-400 text-gray-900"
          }`}
        >
          <span className="material-icons">keyboard_arrow_left</span>
        </button>

        {visiblePages.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageChange(pageNumber)}
            className={`mx-1 px-3 py-[-4px] text-[12px] rounded-full ${
              pageNumber === currentPage
                ? "bg-yellow-400 text-gray-900"
                : "bg-gray-300 transition duration-300 ease-in hover:bg-gray-400 text-black "
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`pt-[2px] text-[12px] rounded-md ml-7 ${
            currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-400 text-gray-900"
          }`}
        >
          <span className="material-icons">keyboard_arrow_right</span>
        </button>
      </div>
    </div>
  );
};

export default OrderUser;
