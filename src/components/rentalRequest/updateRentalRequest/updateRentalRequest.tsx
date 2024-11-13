import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useUpdateRentalRequest,
  useFetchRentalRequest,
} from "../../../hooks/rentalRequestHooks/useUpdateRentalRequest";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  userId: z.string().nonempty(),
  equipmentId: z.number().min(0),
  invoice: z.string().nonempty(),
  starDate: z.string().nonempty(),
  endDate: z.string().nonempty(),
  status: z.string().nonempty(),
});

type FormData = z.infer<typeof schema>;

const UpdateRentalRequest = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { data, isLoading, isError } = useFetchRentalRequest(id!);
  const updateMutation = useUpdateRentalRequest();
  const [unitsAvailable, setUnitsAvailable] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "",
    },
  });

  useEffect(() => {
    if (data) {
      setValue("userId", data.userId);
      setValue("equipmentId", data.equipmentId);
      setValue("invoice", data.invoice);
      setValue("starDate", data.starDate.split("T")[0]);
      setValue("endDate", data.endDate.split("T")[0]);
      setValue("status", data.status);
      setUnitsAvailable(data.equipment.unit);
    }
  }, [data, setValue]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading rental request</div>;

  const handleFormSubmit = (data: FormData) => {
    if (data.status === "Approved" && unitsAvailable <= 0) {
      setShowConfirmModal(false);
      setShowErrorModal(true);
    } else {
      setFormData(data);
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = async () => {
    if (formData) {
      const payload = {
        ...formData,
        starDate: new Date(formData.starDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      await updateMutation.mutateAsync({ id: id!, payload });
      navigate("/admin/list-rental-request");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Rental Request</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <input type="hidden" {...register("userId")} />
        <input type="hidden" {...register("equipmentId")} />
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
            {errors.invoice && <p className="text-red-600">{errors.invoice.message}</p>}
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
            {errors.starDate && <p className="text-red-600">{errors.starDate.message}</p>}
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
            {errors.endDate && <p className="text-red-600">{errors.endDate.message}</p>}
          </div>

          <div className="w-1/2">
            <TextField
              label="Status"
              select
              id="status"
              defaultValue={data.status}
              {...register("status")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
            </TextField>
            {errors.status && <p className="text-red-600">{errors.status.message}</p>}
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
            <span className="material-icons text-gray-900">info</span>Confirm Update
          </h2>
          <p className="text-gray-900 text-center mt-8 font-semibold">
            Are you sure you want to update this Request?
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

      {showErrorModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md transform transition-all duration-500 ease-out animate-fade-in-up">
            <h2 className="font-semibold mb-4 flex gap-2 justify-center">
              <span className="material-icons">info</span>Error
            </h2>
            <p className="font-semibold">This equipment has out of unit</p>
            <div className="mt-4 flex justify-center">
              <button
                className="px-[100px] py-2 bg-yellow-400 text-white transition duration-300 ease-in hover:bg-yellow-500 rounded-md"
                onClick={() => setShowErrorModal(false)}
              >
                <div className="flex gap-2">
                  <span className="material-icons text-[18px] mt-[3px]">exit_to_app</span>Ok
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateRentalRequest;
