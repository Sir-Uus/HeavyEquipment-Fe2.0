import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFetchRentalHistory,
  useUpdateRentalHistory,
} from "../../../hooks/rentalHistoryHooks/useUpdateRentalHistory";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  equipmentId: z.number().positive(),
  renterId: z.string().nonempty(),
  invoice: z.string().nonempty(),
  rentalStartDate: z.string().nonempty(),
  rentalEndDate: z.string().nonempty(),
  rentalCost: z.number().min(0),
  location: z.string().nonempty(),
});

type FormData = z.infer<typeof schema>;

const UpdateRentalHistory = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const { data, isLoading, isError } = useFetchRentalHistory(id!);
  const updateMutation = useUpdateRentalHistory();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (data) {
      setValue("equipmentId", data.equipmentId);
      setValue("renterId", data.renterId);
      setValue("invoice", data.invoice);
      setValue("rentalStartDate", data.rentalStartDate.split("T")[0]);
      setValue("rentalEndDate", data.rentalEndDate.split("T")[0]);
      setValue("rentalCost", data.rentalCost);
      setValue("location", data.location);
    }
  }, [data, setValue]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading rental request</div>;

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (formData) {
      const currentTime = new Date().toTimeString().split(" ")[0];

      let rentalStartDate, rentalEndDate;

      if (formData.rentalStartDate.includes("T")) {
        rentalStartDate = new Date(formData.rentalStartDate);
      } else {
        rentalStartDate = new Date(`${formData.rentalStartDate}T${currentTime}`);
      }

      if (formData.rentalEndDate.includes("T")) {
        rentalEndDate = new Date(formData.rentalEndDate);
      } else {
        rentalEndDate = new Date(`${formData.rentalEndDate}T${currentTime}`);
      }
      const payload = {
        ...formData,
        rentalStartDate: rentalStartDate.toISOString(),
        rentalEndDate: rentalEndDate.toISOString(),
      };
      await updateMutation.mutateAsync({ id: id!, payload });
      navigate("/admin/list-rental-history");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text 2xl font-bold mb-4">Update Rental Hitory</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <input
            type="hidden"
            id="equipmentId"
            {...register("equipmentId")}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <input
            type="hidden"
            id="renterId"
            {...register("renterId")}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Invoice"
              type="text"
              id="invoice"
              {...register("invoice")}
              slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
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
            {errors.rentalStartDate && (
              <p className="text-red-500 text-sm">{errors.rentalStartDate.message}</p>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Rental Start Date"
              type="date"
              id="rentalEndDate"
              {...register("rentalEndDate")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.rentalEndDate && <p className="text-red-500 text-sm">{errors.rentalEndDate.message}</p>}
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
            {errors.rentalCost && <p className="text-red-500 text-sm">{errors.rentalCost.message}</p>}
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
          {errors.location && <p className="text-red-500 text-sm">{errors.location.message}</p>}
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
            <span className="material-icons text-gray-900">info</span>Confirm Update
          </h2>
          <p className="text-gray-900 text-center mt-8 font-semibold">
            Are you sure you want to update this History?
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

export default UpdateRentalHistory;
