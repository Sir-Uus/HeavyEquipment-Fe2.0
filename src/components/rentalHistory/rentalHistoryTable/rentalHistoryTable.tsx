import React, { useEffect, useState } from "react";
import { RentalHistory } from "../../../types/RentalHistory";
import { formatNumber, formatDate } from "../../../utils";
import { Tooltip } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { useRentalHistory } from "../../../hooks/rentalHistoryHooks/useRentalHistory";

interface RentalHistoryTableProps {
  rentalHistory: RentalHistory[];
  equipmentData: Map<number, string>;
  userData: Map<string, string>;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const RentalHistoryTable: React.FC<RentalHistoryTableProps> = ({
  rentalHistory,
  equipmentData,
  userData,
  onEdit,
  onDelete,
}) => {
  const { currentPage } = useRentalHistory();
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipmentName, setEquipmentName] = useState(searchParams.get("equipmentName") || "");
  const [renter, setRenter] = useState(searchParams.get("renter") || "");
  const [invoice, setInvoice] = useState(searchParams.get("invoice") || "");
  const [rentalStartDate, setRentalStartDate] = useState(searchParams.get("rentalStartDate") || "");
  const [rentalEndDate, setRentalEndDate] = useState(searchParams.get("rentalEndDate") || "");
  const [rentalCost, setRentalCost] = useState(searchParams.get("rentalCost") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      setSearchParams({
        page: currentPage.toString(),
        equipmentName,
        renter,
        invoice,
        rentalStartDate,
        rentalEndDate,
        rentalCost,
        location,
      });
    }, 1000);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [equipmentName, renter, invoice, rentalStartDate, rentalEndDate, rentalCost, Location]);

  const clearSearch = () => {
    setEquipmentName("");
    setRenter("");
    setInvoice("");
    setRentalStartDate("");
    setRentalEndDate("");
    setRentalCost("");
    setLocation("");
    setSearchParams({
      page: currentPage.toString(),
      equipmentName: "",
      renter: "",
      invoice: "",
      rentalStartDate: "",
      rentalEndDate: "",
      rentalCost: "",
      location: "",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-yellow-300">
          <tr className="text-center">
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Equipment
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Renter
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Invoice
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Rental Start Date
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Rental End Date
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Rental Cost
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Action
            </th>
          </tr>
          <tr>
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
                value={renter}
                onChange={(e) => setRenter(e.target.value)}
                placeholder="Renter..."
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
                value={rentalStartDate}
                onChange={(e) => setRentalStartDate(e.target.value)}
                placeholder="Rental Start Date..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="date"
                value={rentalEndDate}
                onChange={(e) => setRentalEndDate(e.target.value)}
                placeholder="Rental End Date..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <NumericFormat
                id={`rentalCost`}
                value={rentalCost}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                onValueChange={(e) => setRentalCost(e.value)}
                placeholder="Rp 0"
                className="border text-[12px] rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
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
          {rentalHistory?.length > 0 ? (
            rentalHistory?.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {equipmentData?.get(record.equipmentId || -1) || "Loading..."}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {userData?.get(record.renterId) || "Loading..."}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.invoice}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(record.rentalStartDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(record.rentalEndDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatNumber(record.rentalCost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.location}</td>
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
              <td colSpan={8} className="text-center py-4 text-gray-500">
                No rental history found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RentalHistoryTable;
