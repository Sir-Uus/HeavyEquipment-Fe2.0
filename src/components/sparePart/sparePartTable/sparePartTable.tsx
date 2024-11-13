import React, { useState, useEffect } from "react";
import { SparePart } from "../../../types/SparePart";
import { formatNumber } from "../../../utils";
import { Skeleton, Tooltip } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import Modal from "../../modal/modal";
import { NumericFormat } from "react-number-format";
import { useSparePart } from "../../../hooks/sparepartHooks/useSparepart";

interface RecordTableProps {
  sparePart: SparePart[];
  sparePartImage: string;
  equipmentData: Map<number, string>;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const SparePartTable: React.FC<RecordTableProps> = ({
  sparePart,
  sparePartImage,
  equipmentData,
  onEdit,
  onDelete,
}) => {
  const { currentPage } = useSparePart();
  const [searchParams, setSearchParams] = useSearchParams();
  const [equipmentName, setEquipmentName] = useState(searchParams.get("equipmentName") || "");
  const [partName, setPartName] = useState(searchParams.get("partName") || "");
  const [partNumber, setPartNumber] = useState(searchParams.get("partNumber") || "");
  const [manufacturer, setManufacturer] = useState(searchParams.get("manufacturer") || "");
  const [availabilityStatus, setAvailabilityStatus] = useState(searchParams.get("availabilityStatus") || "");
  const [price, setPrice] = useState(searchParams.get("price") || "");
  const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      setSearchParams({
        page: currentPage.toString(),
        equipmentName,
        partName,
        partNumber,
        manufacturer,
        availabilityStatus,
        price,
      });
    }, 1000);

    setDebounceTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [equipmentName, partName, partNumber, manufacturer, availabilityStatus, price]);

  const clearSearch = () => {
    setEquipmentName("");
    setPartName("");
    setPartNumber("");
    setManufacturer("");
    setAvailabilityStatus("");
    setPrice("");
    setSearchParams({
      page: currentPage.toString(),
      equipmentName: "",
      partName: "",
      partNumber: "",
      manufacturer: "",
      availabilityStatus: "",
      price: "",
    });
  };

  useEffect(() => {
    const initialLoadingState: { [key: number]: boolean } = {};
    sparePart.forEach((record) => {
      initialLoadingState[record.id] = true;
    });
  }, [sparePart]);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
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
              Part Name
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Part Number
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Manufacturer
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Availability Status
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
              Image
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
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="Part Name..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="text"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="Part Number..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                placeholder="Manufacturer..."
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3">
              <select
                value={availabilityStatus}
                onChange={(e) => setAvailabilityStatus(e.target.value)}
                className="border text-[12px] border-gray-300 rounded-md p-2 w-full"
              >
                <option value="">Status...</option>
                <option value="In Stock">In Stock</option>
                <option value="Out Of Stock">Out Of Stock</option>
              </select>
            </td>
            <td className="px-6 py-3">
              <NumericFormat
                id={`price`}
                value={price}
                thousandSeparator="."
                decimalSeparator=","
                prefix="Rp "
                onValueChange={(e) => setPrice(e.value)}
                placeholder="Rp 0"
                className="border text-[12px] rounded-md p-2 w-full"
              />
            </td>
            <td className="px-6 py-3"></td>
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
          {sparePart.length > 0 ? (
            sparePart.map((record) => (
              <tr key={record.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {equipmentData?.get(record.equipmentId || -1) || "Loading..."}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.partName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.partNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.manufacturer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {record.availabilityStatus}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatNumber(record.price)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex justify-center">
                  {sparePartImage[record.id] ? (
                    <img
                      src={sparePartImage[record.id]}
                      alt={record.partName}
                      className="w-16 h-16 object-cover cursor-pointer"
                      onClick={() => openImageModal(sparePartImage[record.id])}
                    />
                  ) : (
                    <Skeleton variant="rectangular" width={64} height={64} className="mr-6" />
                  )}
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
              <td colSpan={8} className="text-center py-4 text-gray-500">
                No spare parts found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={closeImageModal}>
        {selectedImage && <img src={selectedImage} alt="Selected SparePart" className="max-w-80 max-h-80" />}
      </Modal>
    </div>
  );
};

export default SparePartTable;
