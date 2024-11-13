import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchPayment, useUpdatePayment } from "../../../hooks/paymenHooks/useUpdatePayment";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  rentalRequestId: z.number().min(0),
  amount: z.number().min(0),
  paymentMethod: z.string().nonempty(),
  paymentStatus: z.string().nonempty(),
});

type FormData = z.infer<typeof schema>;

const UpdatePayment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const { data, isLoading, isError } = useFetchPayment(id!);
  const updateMutation = useUpdatePayment();
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
      setValue("rentalRequestId", data.rentalRequestId);
      setValue("amount", data.amount);
      setValue("paymentMethod", data.paymentMethod);
      setValue("paymentStatus", data.paymentStatus);
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
      const payload = {
        ...formData,
      };

      await updateMutation.mutateAsync({ id: id!, payload });
      navigate("/admin/list-payment");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Payment</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Invoice"
              type="text"
              id="rentalRequestId"
              {...register("rentalRequestId", { valueAsNumber: true })}
              slotProps={{ inputLabel: { shrink: true }, input: { readOnly: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.rentalRequestId && <p className="text-red-600">{errors.rentalRequestId.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Amount"
              type="number"
              id="amount"
              {...register("amount", { valueAsNumber: true })}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.amount && <p className="text-red-600">{errors.amount.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Payment Method"
              type="text"
              id="paymentMethod"
              {...register("paymentMethod")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.paymentMethod && <p className="text-red-600">{errors.paymentMethod.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Payment Status"
              select
              id="paymentStatus"
              {...register("paymentStatus")}
              defaultValue={data ? data.paymentStatus : ""}
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
            <span className="material-icons text-gray-900">info</span>Confirm Update
          </h2>
          <p className="text-gray-900 text-center mt-8 font-semibold">
            Are you sure you want to update this Payment?
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

export default UpdatePayment;
