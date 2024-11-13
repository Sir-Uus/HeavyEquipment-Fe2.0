import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRenterOptions } from "../../../hooks/rentalHistoryHooks/useRenterOption";
import { useEquipmentOptions } from "../../../hooks/rentalHistoryHooks/useEquipmentOption";
import { useRentalRequestOptions } from "../../../hooks/rentalHistoryHooks/useRentalRequestOption";
import { useCreateRentalHistory } from "../../../hooks/rentalHistoryHooks/useCreateRentalHistory";
import { useNavigate } from "react-router-dom";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  equipmentId: z.number().min(0, "Equipment is required"),
  renterId: z.string().nonempty("Renter is required"),
  invoice: z.string().nonempty("Invoice is required"),
  rentalStartDate: z.string().nonempty("Start Date is required"),
  rentalEndDate: z.string().nonempty("End Date is required"),
  rentalCost: z.number().min(0, "Cost must be a positive number").nonnegative("Cost is required"),
  location: z.string().nonempty("Location is required"),
});

export type FormData = z.infer<typeof schema>;

const CreateRentalHistory: React.FC = () => {
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
  const { data: userOptions = [] } = useRenterOptions();
  const { data: rentalRequestOptions = [] } = useRentalRequestOptions();
  const createRentalHistory = useCreateRentalHistory();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (formData) {
      createRentalHistory.mutate(formData);
      reset();
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Rental History</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Equipment"
              select
              defaultValue={""}
              id="equipmentId"
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
            {errors.equipmentId && <p className="text-red-600">{errors.equipmentId.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Renter"
              select
              defaultValue={""}
              id="renterId"
              {...register("renterId")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Renter</MenuItem>
              {userOptions.map((user: any) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.displayName}
                </MenuItem>
              ))}
            </TextField>
            {errors.renterId && <p className="text-red-600">{errors.renterId.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Invoice"
              id="invoice"
              {...register("invoice")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Invoice</MenuItem>
              {rentalRequestOptions.map((rentalRequest: any) => (
                <MenuItem key={rentalRequest.id} value={rentalRequest.invoice}>
                  {rentalRequest.invoice}
                </MenuItem>
              ))}
            </TextField>
            {errors.invoice && <p className="text-red-600">{errors.invoice.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Rental Start Date"
              type="date"
              id="rentalStartDate"
              {...register("rentalStartDate")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.rentalStartDate && <p className="text-red-600">{errors.rentalStartDate.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Rental End Date"
              type="date"
              id="rentalEndDate"
              {...register("rentalEndDate")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.rentalEndDate && <p className="text-red-600">{errors.rentalEndDate.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Rental Cost"
              type="number"
              id="rentalCost"
              {...register("rentalCost", { valueAsNumber: true })}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.rentalCost && <p className="text-red-600">{errors.rentalCost.message}</p>}
          </div>
        </div>
        <div>
          <TextField
            label="Location"
            type="text"
            id="location"
            {...register("location")}
            slotProps={{ inputLabel: { shrink: true } }}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
          />
          {errors.location && <p className="text-red-600">{errors.location.message}</p>}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm transition duration-300 ease-in hover:bg-gray-600"
            onClick={() => navigate("/admin/list-rental-history")}
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
            Are you sure you want to create this History?
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

export default CreateRentalHistory;
