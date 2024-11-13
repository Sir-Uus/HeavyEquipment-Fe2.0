import { useState, useEffect } from "react";
import Modal from "../modal/modal";
import axios from "../../api/axios";
import { formatDate } from "../../utils";

interface RentalHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId: string;
}

const RentalHistoryModal: React.FC<RentalHistoryModalProps> = ({ isOpen, onClose, equipmentId }) => {
  const [rentalHistory, setRentalHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userMap, setUserMap] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchRentalHistory = async () => {
      try {
        const response = await axios.get(`/RentalHistory/ByEquipment/${equipmentId}`);
        const rentalHistoryData = response.data;
        setRentalHistory(rentalHistoryData);

        const userIds = new Set<string>();

        rentalHistoryData.forEach((history: any) => {
          if (history.renterId) userIds.add(history.renterId);
        });

        const userPromises = Array.from(userIds).map((id) => axios.get(`/Account/${id}`));
        const userResponses = await Promise.all(userPromises);
        const newUserMap = new Map<string, string>();
        userResponses.forEach((response) => {
          const user = response.data;
          newUserMap.set(user.id, user.displayName);
        });
        setUserMap(newUserMap);
      } catch (error) {
        console.error("Error fetching rental history:", error);
      } finally {
        setLoading(false);
      }
    };

    if (equipmentId && isOpen) {
      fetchRentalHistory();
    }
  }, [equipmentId, isOpen]);

  const needsScroll = rentalHistory.length > 4;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-[10px] lg:text-xl font-bold mb-4">Rental History</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={`overflow-x-auto ${needsScroll ? "max-h-60" : ""}`}>
          <table className={`min-w-full bg-white ${needsScroll ? "max-h-60 overflow-y-auto" : ""}`}>
            <thead>
              <tr>
                <th className="text-[10px] lg:text-xl p-1 md:px-4 md:py-2">User</th>
                <th className="text-[10px] lg:text-xl p-1 md:px-4 md:py-2">Start Date</th>
                <th className="text-[10px] lg:text-xl p-1 md:px-4 md:py-2">End Date</th>
                <th className="text-[10px] lg:text-xl p-1 md:px-4 md:py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {rentalHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-[10px] lg:text-xl p-1 md:px-4 md:py-2 text-center">
                    No rental history available.
                  </td>
                </tr>
              ) : (
                rentalHistory.map((history, index) => (
                  <tr key={index}>
                    <td className="border text-[10px] lg:text-xl p-1 md:px-4 md:py-2">
                      {userMap.get(history.renterId) || "..loading"}
                    </td>
                    <td className="border text-[10px] lg:text-xl p-1 md:px-4 md:py-2">
                      {formatDate(history.rentalStartDate)}
                    </td>
                    <td className="border text-[10px] lg:text-xl p-1 md:px-4 md:py-2">
                      {formatDate(history.rentalEndDate)}
                    </td>
                    <td className="border text-[10px] lg:text-xl p-1 md:px-4 md:py-2">{history.location}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

export default RentalHistoryModal;
