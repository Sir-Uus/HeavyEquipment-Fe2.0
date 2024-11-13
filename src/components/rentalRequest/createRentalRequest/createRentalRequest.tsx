import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserOptions } from "../../../hooks/rentalRequestHooks/useUserOption";
import { useEquipmentOptions } from "../../../hooks/rentalRequestHooks/useEquipmentOption";
import { useCreateRentalRequest } from "../../../hooks/rentalRequestHooks/useCreateRentalRequest";
import { useNavigate } from "react-router-dom";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  userId: z.string().nonempty("User is required"),
  equipmentId: z.number().min(0, "Equipment is required"),
  invoice: z.string().nonempty("Invoice is required"),
  starDate: z.string().nonempty("Start Date is required"),
  endDate: z.string().nonempty("End Date is required"),
  status: z.string().nonempty("Status is required"),
});

export type FormData = z.infer<typeof schema>;

const CreateRentalRequest: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const { data: equipmentOptions = [] } = useEquipmentOptions();
  const { data: userOptions = [] } = useUserOptions();
  const createRentalRequest = useCreateRentalRequest();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (formData) {
      createRentalRequest.mutate(formData);
      reset();
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Rental Request</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="User"
              id="userId"
              select
              defaultValue={""}
              {...register("userId")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select User</MenuItem>
              {userOptions.map((user: any) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.displayName}
                </MenuItem>
              ))}
            </TextField>
            {errors.userId && <p className="text-red-500 text-sm">{errors.userId.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Equipment"
              id="equipmentId"
              select
              defaultValue={""}
              {...register("equipmentId")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Equipment</MenuItem>
              {equipmentOptions.map((equipment: any) => (
                <MenuItem key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </MenuItem>
              ))}
            </TextField>
            {errors.equipmentId && <p className="text-red-500 text-sm">{errors.equipmentId.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Invoice"
              type="text"
              id="invoice"
              {...register("invoice")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.invoice && <p className="text-red-500 text-sm">{errors.invoice.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Start Date"
              type="date"
              id="starDate"
              {...register("starDate")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.starDate && <p className="text-red-500 text-sm">{errors.starDate.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="End Date"
              type="date"
              id="endDate"
              {...register("endDate")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              select
              label="Status"
              id="status"
              {...register("status")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
            </TextField>
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm transition duration-300 ease-in hover:bg-gray-600"
            onClick={() => navigate("/admin/list-rental-request")}
          >
            <div className="flex gap-2">
              <span className="material-icons text-[18px] mt-[3px]">exit_to_app</span>Cancel
            </div>
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-400 text-white transition duration-300 ease-in hover:bg-yellow-500 rounded-md shadow-sm"
          >
            <div className="flex gap-2">
              <span className="material-icons text-[18px] mt-[3px]">check_circle</span>Submit
            </div>
          </button>
        </div>
      </form>

      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <div className="flex flex-col items-center justify-center transform transition-all duration-500 ease-out animate-fade-in-up">
          <h2 className="flex gap-2 font-semibold">
            <span className="material-icons text-gray-900">info</span>Confirm Create
          </h2>
          <p className="text-gray-900 text-center mt-8 font-semibold">
            Are you sure you want to create this Request?
          </p>
        </div>
        <button
          className="px-4 py-2 mt-8 w-full bg-yellow-400 text-white transition duration-300 ease-in hover:bg-yellow-500 rounded-md"
          onClick={handleConfirm}
        >
          <div className="flex gap-2 justify-center text-gray-900 font-semibold">
            <span className="material-icons text-[18px] mt-[3px]">check_circle</span>Confirm
          </div>
        </button>
      </Modal>
    </div>
  );
};

export default CreateRentalRequest;
