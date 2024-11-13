import { Link } from "react-router-dom";
import { useRentalRequests } from "../../hooks/orderHooks/useOrder";
import { useEffect, useState } from "react";
import { RentalRequest } from "../../types/RentalRequest";
import { useEquipment } from "../../hooks/orderHooks/useEquipmentOption";
import { ThreeDot } from "react-loading-indicators";
import { Drawer, IconButton, Tab, Tabs, Tooltip } from "@mui/material";
import { formatDate } from "../../utils";
import SidebarOrder from "../sidebarOrder/sidebarOrder";
import MenuIcon from "@mui/icons-material/Menu";

const requestEquipmentDetail = () => {
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
  const [drawerOpen, setDrawerOpen] = useState(false);

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
    } else if (newValue === 1) {
      handleStatusChange("Paid");
    } else if (newValue === 2) {
      handleStatusChange("On Rented");
    } else if (newValue === 3) {
      handleStatusChange("Done");
    }
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  if (rentalRequestLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDot variant="bob" color="#facc15" size="medium" />
      </div>
    );
  }

  return (
    <>
      <div className="mt-[50px] md:mt-3 overflow-x-hidden">
        <IconButton onClick={toggleDrawer(true)} className="left-[-8px] top-2 md:top-0">
          <MenuIcon className="bg-yellow-300 rounded-r-full p-2" fontSize="large" />
        </IconButton>
        <div className="flex md:gap-4 lg:gap-14 justify-center md:justify-normal">
          <div className="hidden md:block">
            <SidebarOrder />
          </div>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <SidebarOrder />
          </Drawer>
          <div className={`md:mt-1 fade-in ${isLoaded ? "active" : ""}`}>
            <Tabs
              value={statusTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  fontSize: { xs: "6px", sm: "8px", md: "12px" },
                  minWidth: "20px",
                  padding: "2px 2px",
                  marginX: { xs: "13px", sm: "0px" },
                },
              }}
            >
              <Tab label="Pending Payments" />
              <Tab label="Successful Payments" />
              <Tab label="On Rented" />
              <Tab label="Done" />
            </Tabs>
            <div className=" overflow-x-auto mb-4 md:mr-10">
              <table className="w-[350px] mx-3 md:w-[585px] lg:w-[670px] xl:w-[920px] 2xl:w-[1550px]  md:mx-0 divide-y divide-gray-200 ">
                <thead className="bg-yellow-300">
                  <tr>
                    <th className="px-2 md:px-4 lg:px-6 py-1 md:py-3 text-center text-[6px] md:text-[8px] lg:text-[10px] font-medium text-gray-900 uppercase tracking-wider">
                      EQUIPMENT
                    </th>
                    <th className="px-2 md:px-4 lg:px-6 py-1 md:py-3 text-center text-[6px] md:text-[8px] lg:text-[10px] font-medium text-gray-900 uppercase tracking-wider">
                      INVOICE
                    </th>
                    <th className="px-2 md:px-4 lg:px-6 py-1 md:py-3 text-center text-[6px] md:text-[8px] lg:text-[10px] font-medium text-gray-900 uppercase tracking-wider">
                      START DATE
                    </th>
                    <th className="px-2 md:px-4 lg:px-6 py-1 md:py-3 text-center text-[6px] md:text-[8px] lg:text-[10px] font-medium text-gray-900 uppercase tracking-wider">
                      END DATE
                    </th>
                    <th className="px-2 md:px-4 lg:px-6 py-1 md:py-3 text-center text-[6px] md:text-[8px] lg:text-[10px] font-medium text-gray-900 uppercase tracking-wider">
                      {statusTab != 0 ? "STATUS" : "REQUEST APPROVAL"}
                    </th>
                    <th className="px-2 md:px-4 lg:px-6 py-1 md:py-3 text-center text-[6px] md:text-[8px] lg:text-[10px] font-medium text-gray-900 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                  {rentalRequests.length > 0 ? (
                    rentalRequests.map((record: any) => (
                      <tr key={record.id}>
                        <td className="px-2 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px]  text-gray-500">
                          {equipmentMap.get(record.equipmentId) || "Loading..."}
                        </td>
                        <td className="px-2 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px] text-gray-500">
                          {record.invoice}
                        </td>
                        <td className="px-2 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px] text-gray-500">
                          {formatDate(record.starDate)}
                        </td>
                        <td className="px-2 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px] text-gray-500">
                          {formatDate(record.endDate)}
                        </td>
                        <td className="px-2 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px]">
                          <span
                            className={`inline-flex px-2 text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px] font-semibold leading-5 rounded-full ${
                              (statusTab === 2 || statusTab === 3
                                ? record.payments[0].paymentStatus
                                : record.status) === "Approved"
                                ? "bg-green-100 text-green-800"
                                : (statusTab === 2 || statusTab === 3
                                    ? record.payments[0].paymentStatus
                                    : record.status) === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : (statusTab === 2 || statusTab === 3
                                    ? record.payments[0].paymentStatus
                                    : record.status) === "On Rented"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-200 text-gray-900"
                            }`}
                          >
                            {statusTab === 2 || statusTab === 3
                              ? record.payments[0]?.paymentStatus
                              : record?.status}
                          </span>
                        </td>
                        <td className="px-2 md:px-6 md:py-4 py-2 whitespace-nowrap text-[8px] md:text-sm">
                          <div className="flex gap-2 justify-center">
                            <Link to={`/equipment/details/${record.equipmentId}/rental-request/${record.id}`}>
                              <Tooltip title="Info" arrow>
                                <button className="px-1 lg:px-3 pt-1 bg-blue-800 text-white rounded-md hover:bg-blue-700">
                                  <span className="material-icons text-[12px] md:text-[16px]">info</span>
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
                                      className={`px-1 lg:px-3 pt-1 text-white rounded-md ${
                                        record.status === "Pending"
                                          ? "bg-gray-400 cursor-not-allowed"
                                          : "bg-green-800 hover:bg-green-700"
                                      }`}
                                      disabled={record.status === "Pending"}
                                    >
                                      <span className="material-icons text-[12px] md:text-[16px]">
                                        payment
                                      </span>
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
                      <td
                        colSpan={6}
                        className="px-3 md:px-4 md:py-3 py-2 text-[8px] md:text-[12px] lg:text-[16px] text-center text-gray-500"
                      >
                        No Equipment found.
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
                className={`pt-[2px] px-1 md:px-0 rounded-md mr-8 ${
                  currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-400 text-gray-900"
                }`}
              >
                <span className="material-icons text-[14px] md:text-xl">keyboard_arrow_left</span>
              </button>

              {visiblePages.map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`mx-1 p-[2px] px-[12px] md:px-3 md:py-[-4px] text-[8px] md:text-[12px] rounded-full ${
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
                className={`pt-[2px] px-1 md:px-0 rounded-md ml-7 ${
                  currentPage === totalPages
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-yellow-400 text-gray-900"
                }`}
              >
                <span className="material-icons text-[14px] md:text-xl">keyboard_arrow_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default requestEquipmentDetail;
