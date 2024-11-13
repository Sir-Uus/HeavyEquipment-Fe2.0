import React, { useEffect, useState } from "react";
import { Payment } from "../../../types/Payment";
import { formatNumber } from "../../../utils";
import { Tooltip } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { usePayment } from "../../../hooks/paymenHooks/usePayment";

interface PaymentTableProps {
  payment: Payment[];
  rentalRequestData: Map<number, string>;
  TransactionData: Map<number, string>;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({
  payment,
  rentalRequestData,
  TransactionData,
  onEdit,
  onDelete,
}) => {
  const { currentPage } = usePayment();
  const [searchParams, setSearchParams] = useSearchParams();
  const [invoice, setInvoice] = useState(searchParams.get("invoice") || "");
  const [amount, setAmount] = useState(searchParams.get("amount") || "");
  const [paymentMethod, setPaymentMethod] = useState(searchParams.get("paymentMethod") || "");
  const [paymentStatus, setPaymentStatus] = useState(searchParams.get("paymentStatus") || "");
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      setSearchParams({
        page: currentPage.toString(),
        invoice,
        amount,
        paymentMethod,
        paymentStatus,
      });
    }, 1000);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [invoice, amount, paymentMethod, paymentStatus]);

  const clearSearch = () => {
    setInvoice("");
    setAmount("");
    setPaymentMethod("");
    setPaymentStatus("");
    setSearchParams({
      page: currentPage.toString(),
      invoice: "",
      amount: "",
      paymentMethod: "",
      paymentStatus: "",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-yellow-300">
          <tr className="text-center">
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Invoice
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Payment Method
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Payment Status
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Action
            </th>
          </tr>
          <tr>
            <td className="px-6 py-3">
              <input
                type="text"
                value={invoice}
                onChange={(e) => setInvoice(e.target.value)}
                placeholder="Invoice..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <NumericFormat
                id={`amount`}
                value={amount}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                onValueChange={(e) => setAmount(e.value)}
                placeholder="Rp 0"
                className="border text-[12px] rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                placeholder="Payment Method..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Status...</option>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </td>
            <td className="px-6 py-3">
              <button
                onClick={clearSearch}
                className="px-4 py-2 w-full bg-red-500 text-white text-[12px] rounded-md hover:bg-red-600 transition-colors"
              >
                Clear
              </button>
            </td>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {payment.length > 0 ? (
            payment.map((record) => {
              const rentalRequestInvoice =
                record.rentalRequestId === 0 ? "" : rentalRequestData.get(record.rentalRequestId);
              const TransactionInvoice =
                record.transactionId === 0 ? "" : TransactionData.get(record.transactionId);
              return (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.rentalRequestId === 0 ? TransactionInvoice : rentalRequestInvoice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatNumber(record.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        record.paymentStatus === "Success"
                          ? "bg-green-100 text-green-800"
                          : record.paymentStatus === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : record.paymentStatus === "Shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {record.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Edit" arrow>
                        <button
                          className="p-2 py-1 bg-yellow-500 text-white rounded-md"
                          onClick={() => onEdit(record.id)}
                        >
                          <span className="material-icons">edit</span>
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <button
                          className="p-2 py-1 bg-red-500 text-white rounded-md"
                          onClick={() => onDelete(record.id)}
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={5} className="text-center py-4">
                No Payment found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentTable;
