import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "react-toastify/ReactToastify.css";
import RecordTable from "../recordTable/recordTable";
import { useMaintenanceRecord } from "../../../hooks/maintenanceRecordHooks/useMaintenanceRecord";
import { ThreeDot } from "react-loading-indicators";
import Modal from "../../modal/modal";

const MaintenaceRecordList = () => {
  const {
    records,
    equipmentData = new Map(),
    totalPages,
    currentPage,
    handlePageChange,
    handleDelete,
    handleEdit,
    recordLoading,
  } = useMaintenanceRecord();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<number | null>(null);
  const maxVisiblePages = 3;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  const visiblePages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  const confirmDelete = (id: number) => {
    setSelectedRecordId(id);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowDeleteModal(false);
    setSelectedRecordId(null);
  };

  if (recordLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDot variant="bob" color="#facc15" size="medium" />
      </div>
    );
  }

  return (
    <>
      <div className={`mt-[10px] fade-in ${isLoaded ? "active" : ""}`}>
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-6">Maintenance Record List</h1>
          <Link to="/admin/add-maintenance-record">
            <button className="px-4 py-2 border border-gray-900 bg-gray-200 text-gray-900 text-[12px] rounded-full hover:bg-green-400 transition-colors">
              + Add Record
            </button>
          </Link>
        </div>
        <RecordTable
          maintenanceRecord={records}
          equipmentData={equipmentData}
          onEdit={handleEdit}
          onDelete={confirmDelete}
        />
        <div className="flex justify-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`pt-[2px] text-[12px] rounded-md mr-8 ${
              currentPage === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-400 text-gray-900"
            }`}
          >
            <span className="material-icons">keyboard_arrow_left</span>
          </button>

          {visiblePages.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`mx-1 px-3 py-[-4px] text-[12px] rounded-full ${
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
            className={`pt-[2px] text-[12px] rounded-md ml-7 ${
              currentPage === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-yellow-400 text-gray-900"
            }`}
          >
            <span className="material-icons">keyboard_arrow_right</span>
          </button>
        </div>
      </div>
      <Modal isOpen={showDeleteModal} onClose={closeModal}>
        <div className="flex flex-col items-center justify-center transform transition-all duration-500 ease-out animate-fade-in-up">
          <h2 className="flex gap-2 font-semibold">
            <span className="material-icons text-gray-900">info</span>Confirm Delete
          </h2>
          <p className="text-gray-900 text-center mt-8 font-semibold">
            Are you sure you want to delete this Feedback?
          </p>
        </div>
        <button
          className="px-4 py-2 mt-8 w-full bg-yellow-400 text-white transition duration-300 ease-in hover:bg-yellow-500 rounded-md"
          onClick={() => {
            handleDelete(selectedRecordId || 0);
            closeModal();
          }}
        >
          <div className="flex gap-2 justify-center text-gray-900 font-semibold">
            <span className="material-icons text-[18px] mt-[3px]">check_circle</span>Confirm
          </div>
        </button>
      </Modal>
    </>
  );
};

export default MaintenaceRecordList;
