import { Drawer, IconButton, Tab, Tabs } from "@mui/material";
import SidebarOrder from "../sidebarOrder/sidebarOrder";
import { formatNumber } from "../../utils";
import { useState } from "react";
import { ThreeDot } from "react-loading-indicators";
import { useTransactionDetail } from "../../hooks/orderHooks/useTransaction";
import { TransactionDetail } from "../../types/TransactionDetail";
import { useSparepart } from "../../hooks/sparepartHooks/useSparePartOption";
import Navbar from "../navbar/navbar";
import MenuIcon from "@mui/icons-material/Menu";

const sparepartBuyingDetail = () => {
  const {
    transactionDetail,
    totalPages,
    currentPage,
    handlePageChange,
    handleStatusChange,
    transactionDetailLoading,
  } = useTransactionDetail();

  const maxVisiblePages = 3;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  const [statusTab, setStatusTab] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const sparepartIds: number[] = [
    ...new Set(transactionDetail.map((req: TransactionDetail) => req.sparePartId as number)),
  ];

  const { data: sparepartData } = useSparepart(sparepartIds);
  const sparepartMap = new Map<number, string>();

  sparepartData?.forEach((sparepart: any) => {
    sparepartMap.set(sparepart.id, sparepart.partName);
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setStatusTab(newValue);

    if (newValue === 0) {
      handleStatusChange("Paid");
    } else if (newValue === 1) {
      handleStatusChange("Shipping");
    } else if (newValue === 2) {
      handleStatusChange("Done");
    }
  };

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  if (transactionDetailLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDot variant="bob" color="#facc15" size="medium" />
      </div>
    );
  }
  return (
    <>
      <Navbar />
      <div className="mt-[50px] md:mt-3">
        <IconButton onClick={toggleDrawer(true)} className="md:hidden left-[-8px] top-2 md:top-0">
          <MenuIcon className="bg-yellow-300 rounded-r-full p-2" fontSize="large" />
        </IconButton>
        <div className="flex gap-3 lg:gap-14 justify-center md:justify-normal">
          <div className="hidden md:block">
            <SidebarOrder />
          </div>
          <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
            <SidebarOrder />
          </Drawer>
          <div className={`md:mt-1 fade-in active}`}>
            <Tabs
              value={statusTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="inherit"
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  fontSize: { xs: "8px", sm: "8px", md: "12px" },
                  minWidth: "20px",
                  padding: "2px 2px",
                  marginX: { xs: "13px", sm: "0px" },
                },
              }}
            >
              <Tab label="Paid Spareparts" />
              <Tab label="Shipping" />
              <Tab label="Done" />
            </Tabs>

            <div className="overflow-x-auto mb-4">
              <table className="w-[350px] md:w-[550px] mx-3 md:mx-0 lg:w-[690px] xl:w-[920px] 2xl:w-[1550px] divide-y divide-gray-200">
                <thead className="bg-yellow-300">
                  <tr>
                    <th className="px-3 md:px-4 lg:px-6 py-1 md:py-3 text-center text-[6px] md:text-[10px] font-medium text-gray-900 uppercase tracking-wider">
                      SPAREPART
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-1 md:py-3 text-center text-[6px] md:text-[10px] font-medium text-gray-900 uppercase tracking-wider">
                      INVOICE
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-1 md:py-3 text-center text-[6px] md:text-[10px] font-medium text-gray-900 uppercase tracking-wider">
                      QUANTITY
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-1 md:py-3 text-center text-[6px] md:text-[10px] font-medium text-gray-900 uppercase tracking-wider">
                      PRICE
                    </th>
                    <th className="px-3 md:px-4 lg:px-6 py-1 md:py-3 text-center text-[6px] md:text-[10px] font-medium text-gray-900 uppercase tracking-wider">
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                  {transactionDetail.length > 0 ? (
                    transactionDetail.map((record: any) => (
                      <tr key={record.id}>
                        <td className="px-3 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px]  text-gray-900">
                          {sparepartMap.get(record?.sparePartId) || "Loading"}
                        </td>
                        <td className="px-3 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px] text-gray-900">
                          {record?.transactions?.invoice}
                        </td>
                        <td className="px-3 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px] text-gray-900">
                          {record.quantity}
                        </td>
                        <td className="px-3 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px] text-gray-900">
                          {formatNumber(record.price)}
                        </td>
                        <td className="px-3 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px]">
                          <span
                            className={`inline-flex px-2 text-[6px] md:text-[8px] lg:text-[10px] xl:text-[12px] font-semibold leading-5 rounded-full ${
                              record?.transactions?.status === "Done"
                                ? "bg-green-100 text-green-800"
                                : record?.transactions?.status === "Paid"
                                ? "bg-gray-100 text-gray-800"
                                : record?.transactions?.status === "Shipped"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {record?.transactions?.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-3 md:px-4 md:py-3 py-2 text-[8px] md:text-[12px] text-center text-gray-900"
                      >
                        No Sparepart found.
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

export default sparepartBuyingDetail;
