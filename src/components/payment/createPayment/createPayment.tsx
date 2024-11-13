import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRentalRequestOptions } from "../../../hooks/paymenHooks/useRentalRequestOption";
import { useCreatePayment } from "../../../hooks/paymenHooks/useCreatePayment";
import { useNavigate } from "react-router-dom";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  rentalRequestId: z.number().min(0, "Invoice is required"),
  amount: z.string().nonempty("Amount is required"),
  paymentMethod: z.string().default("Cash"),
  paymentStatus: z.string().nonempty("Payment Status is required"),
});

export type FormData = z.infer<typeof schema>;

const CreatePayment: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();
  const { data: rentalRequestOptions = [] } = useRentalRequestOptions();
  const createPayment = useCreatePayment();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (formData) {
      createPayment.mutate(formData);
      reset();
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Payment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Invoice"
              select
              defaultValue={""}
              id="rentalRequestId"
              {...register("rentalRequestId")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Invoice</MenuItem>
              {rentalRequestOptions.map((rentalRequest: any) => (
                <MenuItem key={rentalRequest.id} value={rentalRequest.id}>
                  {rentalRequest.invoice}
                </MenuItem>
              ))}
            </TextField>
            {errors.rentalRequestId && (
              <p className="text-red-500 text-sm">{errors.rentalRequestId.message}</p>
            )}
          </div>
          <div className="w-1/2">
            <TextField
              label="Amount"
              type="number"
              id="amount"
              {...register("amount")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Payment Method"
              type="text"
              id="paymentMethod"
              select
              defaultValue={""}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Debit">Debit</MenuItem>
            </TextField>
          </div>
          <div className="w-1/2">
            <TextField
              label="Payment Status"
              select
              defaultValue={""}
              id="paymentStatus"
              {...register("paymentStatus")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="On Rented">On Rented</MenuItem>
              <MenuItem value="Is Being Packaged">Is Being Packaged</MenuItem>
              <MenuItem value="On Delivery">On Delivery</MenuItem>
              <MenuItem value="Done">Done</MenuItem>
            </TextField>
            {errors.paymentStatus && <p className="text-red-500 text-sm">{errors.paymentStatus.message}</p>}
          </div>
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm transition duration-300 ease-in hover:bg-gray-600"
            onClick={() => navigate("/admin/list-payment")}
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
            Are you sure you want to create this Payment?
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

export default CreatePayment;
