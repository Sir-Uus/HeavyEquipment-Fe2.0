import { Link } from "react-router-dom";
import Navbar from "../navbar/navbar";
import { useTransactionHistory } from "../../hooks/transactionHooks/useTransactionHistory";
import { formatDate } from "../../utils";
import { useEffect, useState } from "react";
import { ThreeDot } from "react-loading-indicators";

const TransactionHistory = () => {
  const { Transaction, userMap, TransactionLoading, error, handlePageChange, currentPage, totalPages } =
    useTransactionHistory();
  const [isLoaded, setIsLoaded] = useState(false);
  const maxVisiblePages = 3;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  if (TransactionLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDot variant="bob" color="#facc15" size="medium" />
      </div>
    );
  }

  if (error) {
    return <div>error...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className={`mx-4 mt-[85px] fade-in ${isLoaded ? "active" : ""} `}>
        <div className="md:grid md:grid-cols-4 gap-4">
          <div className="md:block hidden md:col-span-1 p-6 bg-white border-gray-200 rounded-lg shadow">
            <div>
              <img src="/transaction.png" alt="transaction" />
            </div>
            <div className="bg-yellow-100 rounded-md p-2 lg:p-5 mt-8 text-[10px] lg:text-[12px] xl:text-[16px] xl:mt-[54px]">
              You can view all your past transactions, including invoice numbers, total amounts, transaction
              dates, and payment statuses. Click "View Detail" for more information on each transaction
            </div>
          </div>
          <div className="md:col-span-3 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-yellow-300">
                <tr>
                  <th className="px-3 md:px-6 py-1 md:py-3 text-center text-[6px] md:text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Invoice
                  </th>
                  <th className="px-3 md:px-6 py-1 md:py-3 text-center text-[6px] md:text-xs font-medium text-gray-900 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-3 md:px-6 py-1 md:py-3 text-center text-[6px] md:text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-3 md:px-6 py-1 md:py-3 text-center text-[6px] md:text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-3 md:px-6 py-1 md:py-3 text-center text-[6px] md:text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 md:px-6 py-1 md:py-3 text-center text-[6px] md:text-xs font-medium text-gray-900 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-center">
                {Transaction.length > 0 ? (
                  Transaction.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-3 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-xs text-gray-500">
                        {item.invoice}
                      </td>
                      <td className="px-3 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-xs text-gray-500">
                        {userMap.get(item.userId) || "Loading..."}
                      </td>
                      <td className="px-3 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-xs text-gray-500">
                        {item.totalAmount.toLocaleString()} IDR
                      </td>
                      <td className="px-3 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-xs text-gray-500">
                        {formatDate(item.transactionDate)}
                      </td>
                      <td className="px-2 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-xs">
                        <span
                          className={`inline-flex px-2 text-[6px] md:text-xs font-semibold leading-5 rounded-full ${
                            item.status === "Paid" || item.status === "Success" || item.status === "Done"
                              ? "bg-green-100 text-green-800"
                              : item.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 md:px-6 md:py-4 py-2 whitespace-nowrap text-[6px] md:text-xs">
                        <Link to={`/transaction-history/${item.id}`}>
                          <button className="p-1 md:p-2 bg-yellow-400 text-gray-900 rounded-md transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950">
                            View Detail
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-3 md:px-6 md:py-4 py-2 text-center text-[6px] md:text-xs text-gray-500"
                    >
                      No transaction history found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="flex justify-center mt-8">
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
    </div>
  );
};

export default TransactionHistory;
