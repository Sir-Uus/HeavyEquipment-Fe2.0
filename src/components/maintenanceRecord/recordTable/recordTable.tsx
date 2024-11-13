import React, { useEffect, useState } from "react";
import { MaintenaceRecord } from "../../../types/MaintenanceRecord";
import { formatNumber, formatDate } from "../../../utils";
import { Tooltip } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { useMaintenanceRecord } from "../../../hooks/maintenanceRecordHooks/useMaintenanceRecord";

interface RecordTableProps {
  maintenanceRecord: MaintenaceRecord[];
  equipmentData: Map<number, string>;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const RecordTable: React.FC<RecordTableProps> = ({ maintenanceRecord, equipmentData, onEdit, onDelete }) => {
  const { currentPage } = useMaintenanceRecord();
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipmentName, setEquipmentName] = useState(searchParams.get("equipmentName") || "");
  const [maintenanceDate, setMaintenanceDate] = useState(searchParams.get("maintenanceDate") || "");
  const [servicedPerformed, setServicedPerformed] = useState(searchParams.get("servicedPerformed") || "");
  const [servicedProvider, setServicedProvider] = useState(searchParams.get("servicedProvider") || "");
  const [cost, setCost] = useState(searchParams.get("cost") || "");
  const [nextMaintenanceDue, setNextMaintenanceDue] = useState(searchParams.get("nextMaintenanceDue") || "");
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      setSearchParams({
        page: currentPage.toString(),
        equipmentName,
        maintenanceDate,
        servicedPerformed,
        servicedProvider,
        cost,
        nextMaintenanceDue,
      });
    }, 1000);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [equipmentName, maintenanceDate, servicedPerformed, servicedProvider, cost, nextMaintenanceDue]);

  const clearSearch = () => {
    setEquipmentName("");
    setMaintenanceDate("");
    setServicedPerformed("");
    setServicedProvider("");
    setCost("");
    setNextMaintenanceDue("");
    setSearchParams({
      page: currentPage.toString(),
      equipmentName: "",
      maintenanceDate: "",
      servicedPerformed: "",
      servicedProvider: "",
      cost: "",
      nextMaintenanceDue: "",
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 bg-white">
        <thead className="bg-yellow-300">
          <tr className="text-center">
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Equipment
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Maintenance Date
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Service Performed
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Service Provider
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Cost
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Next Maintenance Due
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
                type="date"
                value={maintenanceDate}
                onChange={(e) => setMaintenanceDate(e.target.value)}
                placeholder="Maintenance Date..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="text"
                value={servicedPerformed}
                onChange={(e) => setServicedPerformed(e.target.value)}
                placeholder="Service Performed..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="text"
                value={servicedProvider}
                onChange={(e) => setServicedProvider(e.target.value)}
                placeholder="Service Provider..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <NumericFormat
                id={`cost`}
                value={cost}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                onValueChange={(e) => setCost(e.value)}
                placeholder="Rp 0"
                className="border text-[12px] rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="date"
                value={nextMaintenanceDue}
                onChange={(e) => setNextMaintenanceDue(e.target.value)}
                placeholder="Next Maintenance Due..."
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
          {maintenanceRecord.length > 0 ? (
            maintenanceRecord.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {equipmentData?.get(record.equipmentId || -1) || "Loading..."}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(record.maintenanceDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.servicedPerformed}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.servicedProvider}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatNumber(record.cost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(record.nextMaintenanceDue)}
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
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecordTable;
