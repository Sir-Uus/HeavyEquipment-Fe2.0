import { Skeleton, Tooltip } from "@mui/material";
import { Equipments } from "../../../types/EquipmentTypes";
import { formatNumber } from "../../../utils";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Modal from "../../modal/modal";
import { useEquipments } from "../../../hooks/equipmentHooks/useEquipment";

interface EquipmentTableProps {
  equipments: Equipments[];
  equipmentImages: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const EquipmentTable = ({ equipments, equipmentImages, onEdit, onDelete }: EquipmentTableProps) => {
  const { currentPage } = useEquipments();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [model, setModel] = useState(searchParams.get("model") || "");
  const [specification, setSpecification] = useState(searchParams.get("specification") || "");
  const [description, setDescription] = useState(searchParams.get("description") || "");
  const [yearOfManufacturer, setYearOfManufacturer] = useState(searchParams.get("yearOfManufacturer") || "");
  const [unit, setUnit] = useState(searchParams.get("unit") || "");
  const [rentalPrice, setRentalPrice] = useState(searchParams.get("rentalPrice") || "");
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
        searchTerm,
        type,
        status,
        location,
        brand,
        model,
        specification,
        description,
        yearOfManufacturer,
        rentalPrice,
        unit,
      });
    }, 1000);

    setDebounceTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [
    searchTerm,
    type,
    status,
    location,
    brand,
    model,
    specification,
    description,
    yearOfManufacturer,
    rentalPrice,
    unit,
  ]);

  const clearSearch = () => {
    setSearchTerm("");
    setType("");
    setStatus("");
    setLocation("");
    setBrand("");
    setModel("");
    setSpecification("");
    setDescription("");
    setYearOfManufacturer("");
    setRentalPrice("");
    setUnit("");
    setSearchParams({
      page: currentPage.toString(),
      searchTerm: "",
      type: "",
      status: "",
      location: "",
      brand: "",
      model: "",
      specification: "",
      description: "",
      yearOfManufacturer: "",
      rentalPrice: "",
      unit: "",
    });
  };

  useEffect(() => {
    const initialLoadingState: { [key: number]: boolean } = {};
    equipments.forEach((eq) => {
      initialLoadingState[eq.id] = true;
    });
  }, [equipments]);

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleChangeNumber = (e: any) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setRentalPrice(value);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white border text-sm">
          <thead className="bg-yellow-300">
            <tr className="text-center">
              <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
                Brand
              </th>
              <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
                Model
              </th>
              <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
                Year Of Manufacture
              </th>
              <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
                Rental Price
              </th>
              <th className="px-6 py-3 min-w-[250px] text-xs font-medium text-gray-900 uppercase tracking-wider">
                Action
              </th>
            </tr>
            <tr>
              <td className="px-6 py-3 flex">
                <input
                  value={searchTerm}
                  name="searchTerm"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Name..."
                  className="bg-white p-2 w-full rounded-md text-[12px] "
                />
              </td>
              <td className="px-6 py-3">
                <select
                  value={type}
                  name="type"
                  onChange={(e) => setType(e.target.value)}
                  className="border text-[12px] rounded-md p-2 w-full"
                >
                  <option value="">Type...</option>
                  <option value="Excavator">Excavator</option>
                  <option value="Loader">Loader</option>
                  <option value="Grader">Grader</option>
                  <option value="Dozer">Dozer</option>
                  <option value="Truck">Truck</option>
                  <option value="Compactor">Compactor</option>
                  <option value="Crane">Crane</option>
                </select>
              </td>
              <td className="px-6 py-3">
                <input
                  type="text"
                  name="brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Brand..."
                  className="border text-[12px] rounded-md p-2 w-full"
                />
              </td>
              <td className="px-6 py-3">
                <input
                  type="text"
                  name="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Model..."
                  className="border text-[12px] rounded-md p-2 w-full"
                />
              </td>
              <td className="px-6 py-3">
                <input
                  type="text"
                  name="yearOfManufacturer"
                  value={yearOfManufacturer}
                  onChange={(e) => setYearOfManufacturer(e.target.value)}
                  placeholder="Year..."
                  className="border text-[12px] rounded-md p-2 w-full"
                />
              </td>
              <td className="px-6 py-3"></td>
              <td className="px-6 py-3">
                <select
                  value={status}
                  name="status"
                  onChange={(e) => setStatus(e.target.value)}
                  className="border text-[12px] rounded-md p-2 w-full"
                >
                  <option value="">Status...</option>
                  <option value="Available">Available</option>
                  <option value="Unavailable">Unavailable</option>
                </select>
              </td>
              <td className="px-6 py-3">
                <input
                  type="text"
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location..."
                  className="border text-[12px] rounded-md p-2 w-full"
                />
              </td>
              <td className="px-6 py-3">
                <input
                  type="text"
                  name="rentalPrice"
                  value={rentalPrice}
                  onChange={handleChangeNumber}
                  placeholder="Rental Price..."
                  className="border text-[12px] rounded-md p-2 w-full"
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
            {equipments.length > 0 ? (
              equipments.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.brand}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.model}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">{record.yearOfManufacture}</td>
                  <td className="px-6 py-4 text-sm flex justify-center">
                    {equipmentImages[record.id] ? (
                      <img
                        src={equipmentImages[record.id]}
                        alt={record.name}
                        className="w-16 h-16 object-cover cursor-pointer"
                        onClick={() => openImageModal(equipmentImages[record.id])}
                      />
                    ) : (
                      <Skeleton variant="rectangular" width={64} height={64} className="mr-6" />
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.status}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{record.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatNumber(record.rentalPrice)}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Edit" arrow>
                        <button
                          className="px-2 py-1 bg-yellow-500 text-white text-sm rounded-md"
                          onClick={() => onEdit(record.id)}
                        >
                          <span className="material-icons text-md">edit</span>
                        </button>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <button
                          className="px-2 py-1 bg-red-500 text-white text-sm rounded-md"
                          onClick={() => onDelete(record.id)}
                        >
                          <span className="material-icons text-md">delete</span>
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={12} className="text-center py-4 text-gray-500">
                  No equipment found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeImageModal}>
        {selectedImage && <img src={selectedImage} alt="Selected Equipment" className="max-w-80 max-h-80" />}
      </Modal>
    </>
  );
};

export default EquipmentTable;
