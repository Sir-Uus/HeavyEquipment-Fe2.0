import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateDays, generateInvoice } from "../../utils";
import { useUserOptions } from "../../hooks/rentalRequestHooks/useUserOption";
import { useMakeRentalRequest } from "../../hooks/rentalRequestHooks/useMakeRentalRequest";
import { useSubmitPayment } from "../../hooks/rentalRequestHooks/useSubmitPayment";
import Wizard from "../wizard/wizard";
import { useEquipmentOptionsIds } from "../../hooks/rentalRequestHooks/useEquipmentOption";
import { TextField } from "@mui/material";
import Modal from "../modal/modal";

const schema = z.object({
  userId: z.string().min(1, "User ID is required"),
  equipmentId: z.number().min(1, "Equipment ID must not empty"),
  starDate: z.string()
  .min(1, "Start Date is required")
  .refine((date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    const diffTime = selectedDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays >= 1;
  }, "Start Date must be at least 1 days after today"),
  endDate: z.string()
  .min(1, "End Date is required")
  .refine((date) => {
    const currentDate = new Date();
    const selectedDate = new Date(date);
    const diffTime = selectedDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24));
    return diffDays >= 1;
  }, "End Date must be at least 1 days after start date"),
  status: z.enum(["Approved", "Pending"], { required_error: "Status is required" }),
  invoice: z.string().nonempty(),
});

export type FormData = z.infer<typeof schema>;

const MakeRentalRequest = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [rentalPrice, setRentalPrice] = useState<number>(0);
  const [minDate, setMinDate] = useState("");

  const { data: userOptions } = useUserOptions();
  const { data: selectedEquipment } = useEquipmentOptionsIds();
  const createRentalRequestMutation = useMakeRentalRequest();
  const submitPaymentMutation = useSubmitPayment();

  useEffect(() => {
    if (selectedEquipment && selectedEquipment.id) {
      setRentalPrice(selectedEquipment.rentalPrice);
      setValue("equipmentId", selectedEquipment.id);
    }

    const storedUserId = localStorage.getItem("id");
    if (storedUserId) {
      setValue("userId", storedUserId);
    }

    setValue("invoice", generateInvoice());
    setValue("status", "Pending");
  }, [selectedEquipment, setValue]);

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (formData) {
      const starDate = new Date(formData.starDate);
      const endDate = new Date(formData.endDate);
      const durationDays = calculateDays(starDate.toISOString(), endDate.toISOString());
      const amount = rentalPrice * durationDays;

      try {
        const rentalResponse = await createRentalRequestMutation.mutateAsync(formData);
        const rentalRequestId = rentalResponse.id;

        await submitPaymentMutation.mutateAsync({ rentalRequestId, amount });
        navigate("/order");
      } catch (error) {
        console.error("Error during rental request or payment submission:", error);
      } finally {
        setShowConfirmModal(false);
      }
    }
  };

  useEffect(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const selectedUserName =
    userOptions?.find((user: any) => user.id === localStorage.getItem("id"))?.displayName || "";
  const selectedEquipmentName = selectedEquipment?.name || "";

  return (
    <div className="mt-[90px] mx-4">
      <Wizard />
      <div className="max-w-7xl mx-auto  mt-5 p-6 border border-gray-200 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Make Rental Request</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-11">
          <div>
            <TextField
              label="User"
              id="userId"
              {...register("userId")}
              type="text"
              slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
              className={`mt-1 p-4 block w-full rounded-md border border-black shadow-sm sm:text-sm ${
                errors.userId ? "border-red-500" : ""
              }`}
              value={selectedUserName}
            />
            {errors.userId && <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>}
          </div>
          <div>
            <TextField
              label="Equipment"
              id="equipmentId"
              {...register("equipmentId", { valueAsNumber: true })}
              type="text"
              slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
              className={`mt-1 p-4 block w-full rounded-md border border-black shadow-sm sm:text-sm ${
                errors.equipmentId ? "border-red-500" : ""
              }`}
              value={selectedEquipmentName}
            />
            {errors.equipmentId && <p className="mt-1 text-sm text-red-600">{errors.equipmentId.message}</p>}
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <TextField
                label="Start Date"
                id="starDate"
                type="date"
                {...register("starDate")}
                slotProps={{ inputLabel: { shrink: true } }}
                className={`mt-1 p-4 block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.starDate ? "border-red-500" : ""
                }`}
                inputProps={{ min: minDate }}
              />
              {errors.starDate && <p className="mt-1 text-sm text-red-600">{errors.starDate.message}</p>}
            </div>
            <div className="w-1/2">
              <TextField
                label="End Date"
                id="endDate"
                type="date"
                {...register("endDate")}
                slotProps={{ inputLabel: { shrink: true } }}
                className={`mt-1 p-4 block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  errors.endDate ? "border-red-500" : ""
                }`}
                inputProps={{ min: minDate }}
              />
              {errors.endDate && <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>}
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-300 text-sm font-semibold"
          >
            Submit Rental Request
          </button>
        </form>
      </div>

      {showConfirmModal && (
        <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
          <div className="flex flex-col items-center justify-center transform transition-all duration-500 ease-out animate-fade-in-up">
            <span className="material-icons text-gray-900">info</span>
            <p className="text-gray-900 text-center mt-8 font-semibold text-[12px] md:text-[16px]">
              Are you sure you want to submit this Request?
            </p>
          </div>
          <button
            className="px-4 py-2 mt-8 w-full bg-yellow-400 text-white transition duration-300 ease-in hover:bg-yellow-500 rounded-md"
            onClick={handleConfirm}
          >
            <div className="flex gap-2 justify-center">
              <span className="material-icons text-[18px] mt-[3px]">check_circle</span>Confirm
            </div>
          </button>
        </Modal>
      )}
    </div>
  );
};

export default MakeRentalRequest;
