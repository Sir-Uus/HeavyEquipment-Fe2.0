import { Link, useNavigate, useParams } from "react-router-dom";
import Wizard from "../wizard/wizard";
import RentalHistoryModal from "../rentalHistoryModal/rentalHistoryModal";
import FeedbackModal from "../feedbackModal/feedbackModal";
import Modal from "../modal/modal";
import { useState } from "react";
import { formatNumber, getAverageRating } from "../../utils";
import { useEquipmentOptionsIds, useEquipmentImage } from "../../hooks/equipmentHooks/useEquipmentOption";

const EquipmentDetails = () => {
  const { id } = useParams<{ id: any }>();
  const [isRentalHistoryOpen, setRentalHistoryOpen] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [isNotLoggedInModalOpen, setNotLoggedInModalOpen] = useState(false);
  const navigate = useNavigate();

  const { data: equipment, isLoading, error } = useEquipmentOptionsIds();
  const { data: equipmentImage } = useEquipmentImage(id);

  const handleMakeRequest = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setNotLoggedInModalOpen(true);
    } else {
      navigate(`/equipment/details/${equipment.id}/rental-request`);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error instanceof Error) return <p>{error.message}</p>;
  if (!equipment) return <p>No equipment data available</p>;

  return (
    <div className="p-4 pt-[70px] md:pt-[80px] w-full md:w-full">
      <Wizard />
      <div className="mt-3 md:mt-6px md:grid md:grid-cols-1 lg:grid-cols-10 gap-4">
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <a
            href="#"
            className="block p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
          >
            <h5 className="mb-2 text-sm md:text-lg font-bold tracking-tight text-gray-900">
              Secured Payment Guarantee!
            </h5>
            <p className="text-[12px] md:text-sm font-normal text-gray-900">
              Your payment will be secured. Sit back, relax, and enjoy peace of mind.
            </p>
          </a>

          <div className="p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-700 dark:border-gray-700">
            <a href="#">
              <h5 className="mb-2 text-sm md:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Not what you expect?
              </h5>
            </a>
            <p className="text-[12px] md:text-sm font-normal text-gray-600 dark:text-gray-300">
              Explore other heavy equipment rental services if you are unsatisfied.
            </p>
            <a
              href="/equipment"
              className="inline-flex items-center mt-3 p-1 px-2 md:px-3 md:py-2 text-[12px] md:text-sm font-medium text-center rounded-3xl bg-yellow-400 text-gray-900 transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950"
            >
              Browse more
              <span className="material-icons ms-2">arrow_forward</span>
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 w-full h-auto p-4 bg-white border border-gray-200 rounded-lg shadow mt-4 md:mt-0">
          <div className="flex flex-col items-center md:flex-row">
            <img
              src={equipmentImage}
              alt=""
              className="w-[100%] h-48 md:w-[18rem] md:h-52 mb-4 md:mr-8 object-cover"
            />
            <div className="text-sm font-semibold text-gray-700 w-full md:w-[41%]">
              <h5 className="mb-4 text-slate-800 text-lg font-semibold pb-4 text-center md:text-left uppercase">
                {equipment.name}
              </h5>
              <div className="flex flex-col md:text-[16px] md:mt-8">
                <p>
                  <span className="material-icons mr-2 text-[14px]">build</span>
                  <span className="text-xs">Type: {equipment.type}</span>
                </p>
                <p>
                  <span className="material-icons mr-2 text-[14px]">local_offer</span>
                  <span className="text-xs">Brand: {equipment.brand}</span>
                </p>
                <p>
                  <span className="material-icons mr-2 text-[14px]">widgets</span>
                  <span className="text-xs">Model: {equipment.model}</span>
                </p>
                <p>
                  <span className="material-icons mr-2 text-[14px]">calendar_today</span>
                  <span className="text-xs">Year: {equipment.yearOfManufacture}</span>
                </p>
                <p>
                  <span className="material-icons mr-2 text-[14px]">location_on</span>
                  <span className="text-xs">Location: {equipment.location}</span>
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end justify-end mt-4 md:mt-[70px] lg:mt-[90px]">
              <p className="text-[12px] md:text-sm font-semibold text-slate-400">Price per day</p>
              <p className="text-xl font-bold text-slate-800">{formatNumber(equipment.rentalPrice)}</p>
              <button
                onClick={handleMakeRequest}
                className="flex justify-center text-xs md:text-[16px] mt-4 font-semibold gap-4 py-3 w-ful w-40 rounded-md bg-yellow-400 text-gray-900 transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950"
              >
                Make A Request
              </button>
            </div>
          </div>

          <div className="rounded-2xl mt-4 border-2 py-3 px-2 border-black">
            <p className="text-xs">{equipment.description}</p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
              <h5 className="text-sm md:text-lg font-bold mb-2">Rental History</h5>
              <p className="text-xs md:text-sm text-gray-600">
                View the rental history including previous renters and usage details.
              </p>
              <button
                onClick={() => setRentalHistoryOpen(true)}
                className="inline-flex items-center text-xs mt-4 px-4 py-2 md:text-sm font-medium text-gray-900 bg-yellow-400 rounded-3xl transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950"
              >
                View Details
                <span className="material-icons ms-2">arrow_forward</span>
              </button>
            </div>

            <div className="relative p-4 bg-white border border-gray-200 rounded-lg shadow">
              <h5 className="text-lg font-bold mb-2">Rating</h5>
              <p className="text-sm text-gray-600">Average rating from users who rented this equipment.</p>
              <p className="md:absolute md:bottom-7 text-yellow-500 font-bold text-sm md:text-2xl mt-3 md:mt-0">
                {getAverageRating(equipment.performanceFeedbacks)} / 5
              </p>
            </div>

            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow">
              <h5 className="text-sm md:text-lg font-bold mb-2">Feedback</h5>
              <p className="text-xs md:text-sm text-gray-600">Read user feedback about their experience.</p>
              <button
                onClick={() => setFeedbackOpen(true)}
                className="inline-flex items-center text-xs mt-4 md:mt-9 px-4 py-2 md:text-sm font-medium text-gray-900 bg-yellow-400 rounded-3xl transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-950"
              >
                View Feedback
                <span className="material-icons ms-2">arrow_forward</span>
              </button>
            </div>
          </div>

          <div className="py-4 mt-4">
            <h5 className="font-semibold text-sm md:text-base">Your rental includes:</h5>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> Free service once
              </p>
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> Last minute
                cancellation
              </p>
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> Transport to site
              </p>
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> Additional fuel
              </p>
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> Insurance
              </p>
              <p className="flex items-center text-xs md:text-sm">
                <span className="material-icons text-green-400 mr-1">check_circle</span> Replacement if
                breakdown
              </p>
            </div>
          </div>

          {/* Modals */}
          {isRentalHistoryOpen && (
            <RentalHistoryModal
              isOpen={isRentalHistoryOpen}
              equipmentId={equipment.id || ""}
              onClose={() => setRentalHistoryOpen(false)}
            />
          )}

          {isFeedbackOpen && (
            <FeedbackModal
              isOpen={isFeedbackOpen}
              equipmentId={equipment.id || ""}
              onClose={() => setFeedbackOpen(false)}
            />
          )}

          {isNotLoggedInModalOpen && (
            <Modal isOpen={isNotLoggedInModalOpen} onClose={() => setNotLoggedInModalOpen(false)}>
              <div className="flex flex-col items-center justify-center p-4">
                <span className="material-icons text-gray-900">info</span>
                <p className="text-gray-900 text-center mt-4 font-semibold text-sm">
                  You need to login before making a rental request
                </p>
                <Link to="/login" className="mt-4 w-full">
                  <button className="w-full rounded-md p-2 text-sm font-semibold bg-yellow-400 text-gray-900 transition duration-300 ease-in hover:bg-yellow-300 hover:text-gray-900">
                    Go to Login
                  </button>
                </Link>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;
