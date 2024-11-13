import { useParams } from "react-router-dom";
import { PDFViewer } from "@react-pdf/renderer";
import PDFDocument from "../pdfDocument/pdfDocument";
import Navbar from "../navbar/navbar";
import { useTransactionDetail } from "../../hooks/transactionsDetailHooks/useTransactionDetail";
import { useState } from "react";

const TransactionDetail = () => {
  const { transactionId } = useParams<{ transactionId: string }>();
  const { data, isLoading, error } = useTransactionDetail(transactionId!);
  const [showModal, setShowModal] = useState(false);

  if (isLoading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    console.log("data", data);
    return <div className="text-center mt-40">Error loading transaction details.</div>;
  }

  if (!data) {
    return <div className="text-center mt-10">No transaction found.</div>;
  }

  const { transaction, userMap, equipmentMap, sparePartMap } = data;
  const { userId, transactionDate, totalAmount, status, transactionDetails } = transaction;

  const equipmentDetails = transactionDetails.filter((detail: any) => detail.equipmentId !== null);
  const sparePartDetails = transactionDetails.filter((detail: any) => detail.sparePartId !== null);

  return (
    <div>
      <Navbar />
      <div className="mt-[84px] mb-2 mx-4">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h3 className="text-xl font-bold text-center mb-8">Transaction Details</h3>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="font-semibold text-[12px]">User:</p>
              <p className="text-gray-700 text-[12px]">{userMap.get(userId) || "Unknown User"}</p>
              <p className="font-semibold text-[12px] mt-4">Status:</p>
              <p className="text-gray-700 text-[12px]">{status}</p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-[12px]">Transaction ID:</p>
              <p className="text-gray-700 text-[12px]">{transactionId}</p>
              <p className="font-semibold text-[12px] mt-4">Date:</p>
              <p className="text-gray-700 text-[12px]">{new Date(transactionDate).toLocaleDateString()}</p>
              <p className="font-semibold text-[12px] mt-4">Total Amount:</p>
              <p className="text-sm font-bold text-black-600">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  minimumFractionDigits: 0,
                }).format(totalAmount)}
              </p>
            </div>
          </div>

          {equipmentDetails.length > 0 && (
            <>
              <h3 className="text-xl font-semibold mb-6">Equipment Details</h3>
              <table className="min-w-full divide-y divide-gray-200 mb-6">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-2 md:px-6 py-3 text-left text-[10px] md:text-sm font-medium text-gray-600">
                      Equipment
                    </th>
                    <th className="px-2 md:px-6 py-3 text-left text-[10px] md:text-sm font-medium text-gray-600">
                      Quantity
                    </th>
                    <th className="px-2 md:px-6 py-3 text-left text-[10px] md:text-sm font-medium text-gray-600">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-center">
                  {equipmentDetails.map((detail: any) => (
                    <tr key={detail.id}>
                      <td className="px-2 md:px-6 py-3 text-left text-[10px] md:text-sm text-gray-700">
                        {equipmentMap.get(detail.equipmentId)}
                      </td>
                      <td className="px-2 md:px-6 py-3 text-center text-[10px] md:text-sm text-gray-700">
                        {detail.quantity}
                      </td>
                      <td className="px-2 md:px-6 py-3 text-left text-[10px] md:text-sm text-gray-700">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          minimumFractionDigits: 0,
                        }).format(detail.price * detail.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {sparePartDetails.length > 0 && (
            <>
              <h3 className="text-[12px] md:text-xl font-semibold mb-6">Spare Part Details</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 mb-6">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-2 md:px-6 py-3 text-left text-[10px] md:text-sm font-medium text-gray-600">
                        Spare Part
                      </th>
                      <th className="px-2 md:px-6 py-3 text-center text-[10px] md:text-sm font-medium text-gray-600">
                        Quantity
                      </th>
                      <th className="px-2 md:px-6 py-3 text-right text-[10px] md:text-sm font-medium text-gray-600">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-center">
                    {sparePartDetails.map((detail: any) => (
                      <tr key={detail.id}>
                        <td className="px-2 md:px-6 py-4 text-left text-[10px] md:text-sm text-gray-700">
                          {sparePartMap.get(detail.sparePartId)}
                        </td>
                        <td className="px-2 md:px-6 py-4 text-[10px] md:text-sm text-gray-700">
                          {detail.quantity}
                        </td>
                        <td className="px-2 md:px-6 py-4 text-right text-[10px] md:text-sm text-gray-700">
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(detail.price * detail.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-yellow-400 text-black rounded-lg shadow hover:bg-yellow-300 transition-colors duration-300 flex items-center"
            >
              <span className="material-icons mr-2 text-[18px] md:text-[24px]">download</span>{" "}
              <span className="text-[14px] md:text-[16px]">PDF</span>
            </button>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center mt-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <PDFViewer width="100%" height="350" className="mt-4">
                  <PDFDocument
                    transaction={transaction}
                    userMap={userMap}
                    equipmentMap={equipmentMap}
                    sparePartMap={data.sparePartMap}
                  />
                </PDFViewer>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetail;
