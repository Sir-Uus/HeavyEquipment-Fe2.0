import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { TextField } from "@mui/material";

const RentalRequestDetail = () => {
  const { rentalRequestId } = useParams<{ rentalRequestId: string }>();
  const [rentalRequest, setRentalRequest] = useState<any>(null);
  const [equipment, setEquipment] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentalRequest = async () => {
      try {
        const rentalResponse = await axios.get(`/RentalRequest/${rentalRequestId}`);
        setRentalRequest(rentalResponse.data);

        const equipmentResponse = await axios.get(`/Equipment/${rentalResponse.data.equipmentId}`);
        setEquipment(equipmentResponse.data);

        const userResponse = await axios.get(`/Account/${rentalResponse.data.userId}`);
        setUser(userResponse.data);
      } catch (error) {
        console.error("Error fetching rental request details:", error);
      }
    };

    fetchRentalRequest();
  }, [rentalRequestId]);

  if (!rentalRequest || !equipment || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-[90px] mx-5">
      <div className="max-w-7xl mx-auto mt-5 p-6 border border-gray-200 bg-white rounded-lg shadow-md">
        <h2 className="text-sm md:text-2xl font-bold mb-6 text-center">Rental Request Details</h2>
        <div className="space-y-20">
          <div className="flex gap-4">
            <div className="w-1/2">
              <TextField
                label="User"
                id="userId"
                type="text"
                slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
                value={user.displayName}
                className="mt-1 p-2 block w-full rounded-md border border-gray-900 shadow-sm sm:text-sm"
              />
            </div>
            <div className="w-1/2">
              <TextField
                label="Equipment"
                id="equipmentId"
                type="text"
                slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
                value={equipment.name}
                className="mt-1 p-2 block w-full rounded-md border border-gray-900 shadow-sm sm:text-sm"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <TextField
                label="Start Date"
                id="starDate"
                type="text"
                slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
                value={new Date(rentalRequest.starDate).toLocaleDateString()}
                className="mt-1 p-2 block w-full rounded-md border border-gray-900 shadow-sm sm:text-sm"
              />
            </div>
            <div className="w-1/2">
              <TextField
                label="End Date"
                id="endDate"
                type="text"
                slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
                value={new Date(rentalRequest.endDate).toLocaleDateString()}
                className="mt-1 p-2 block w-full rounded-md border border-gray-900 shadow-sm sm:text-sm"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-1/2">
              <TextField
                label="Status"
                id="status"
                type="text"
                slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
                value={rentalRequest.status}
                className="mt-1 p-2 block w-full rounded-md border border-gray-900 shadow-sm sm:text-sm"
              />
            </div>
            <div className="w-1/2">
              <TextField
                label="Invoice"
                id="invoice"
                type="text"
                slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
                value={rentalRequest.invoice}
                className="mt-1 p-2 block w-full rounded-md border border-gray-900 shadow-sm sm:text-sm"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={() => navigate(-1)} className="px-4 py-2 bg-gray-300 text-black rounded-md mr-2">
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentalRequestDetail;
