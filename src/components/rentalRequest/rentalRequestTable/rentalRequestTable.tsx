import React, { useEffect, useState } from "react";
import { RentalRequest } from "../../../types/RentalRequest";
import { formatDate } from "../../../utils";
import { Tooltip } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { useRentalRequest } from "../../../hooks/rentalRequestHooks/useRentalRequest";

interface RentalRequestTableProps {
  rentalRequest: RentalRequest[];
  equipmentData: Map<number, string>;
  userData: Map<string, number>;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const RentalRequestTable: React.FC<RentalRequestTableProps> = ({
  rentalRequest,
  equipmentData,
  userData,
  onEdit,
  onDelete,
}) => {
  const { currentPage } = useRentalRequest();
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipmentName, setEquipmentName] = useState(searchParams.get("equipmentName") || "");
  const [userName, setUserName] = useState(searchParams.get("userName") || "");
  const [invoice, setInvoice] = useState(searchParams.get("invoice") || "");
  const [starDate, setStarDate] = useState(searchParams.get("starDate") || "");
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      setSearchParams({
        page: currentPage.toString(),
        equipmentName,
        userName,
        invoice,
        starDate,
        endDate,
        status,
      });
    }, 1000);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [equipmentName, userName, invoice, starDate, endDate, status]);

  const clearSearch = () => {
    setEquipmentName("");
    setUserName("");
    setInvoice("");
    setStarDate("");
    setEndDate("");
    setStatus("");
    setSearchParams({
      page: currentPage.toString(),
      equipmentName: "",
      userName: "",
      invoice: "",
      starDate: "",
      endDate: "",
      status: "",
    });
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-yellow-300">
          <tr className="text-center">
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              User
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Equipment
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Invoice
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Start Date
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              End Date
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Action
            </th>
          </tr>
          <tr>
            <td className="px-6 py-3">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Name..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="text"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                placeholder="Equipment Name..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
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
              <input
                type="date"
                value={starDate}
                onChange={(e) => setStarDate(e.target.value)}
                placeholder="Start Date..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="End Date..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="border rounded-md text-[12px] p-2 w-full"
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
              </select>
            </td>
            <td className="px-6 py-3">
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-red-500 w-full text-white text-[12px] rounded-md hover:bg-red-600 transition-colors"
              >
                Clear
              </button>
            </td>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rentalRequest.length > 0 ? (
            rentalRequest.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {userData?.get(record.userId) || "Loading..."}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {equipmentData?.get(record.equipmentId) || "Loading..."}
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
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                No rental requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RentalRequestTable;
