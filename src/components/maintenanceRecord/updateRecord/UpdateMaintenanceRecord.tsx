import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFetchMaintenanceRecord,
  useUpdateMaintenanceRecord,
} from "../../../hooks/maintenanceRecordHooks/useUpdateMaintenanceRecord";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  equipmentId: z.number(),
  maintenanceDate: z.string().nonempty(),
  servicedPerformed: z.string().nonempty(),
  servicedProvider: z.string().nonempty(),
  cost: z.number().min(0),
  nextMaintenanceDue: z.string().nonempty(),
});

type FormData = z.infer<typeof schema>;

const UpdateMaintenanceRecord = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const { data, isLoading, isError } = useFetchMaintenanceRecord(id!);
  const updateMutation = useUpdateMaintenanceRecord();

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
      setValue("maintenanceDate", data.maintenanceDate.split("T")[0]);
      setValue("servicedPerformed", data.servicedPerformed);
      setValue("servicedProvider", data.servicedProvider);
      setValue("cost", data.cost);
      setValue("nextMaintenanceDue", data.nextMaintenanceDue.split("T")[0]);
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

      const maintenanceDateTime = new Date(`${formData.maintenanceDate}T${currentTime}`).toISOString();
      const nextMaintenanceDueDateTime = new Date(
        `${formData.nextMaintenanceDue}T${currentTime}`
      ).toISOString();
      const payload = {
        ...formData,
        maintenanceDate: maintenanceDateTime,
        nextMaintenanceDue: nextMaintenanceDueDateTime,
      };

      await updateMutation.mutateAsync({ id: id!, payload });
      navigate("/admin/list-maintenance-record");
    }
  };

  return (
    <div className="mt-4 p-4 border-t">
      <h2 className="text-xl font-bold mb-4">Edit Maintenance Record</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <input
            type="hidden"
            id="equipmentId"
            {...register("equipmentId")}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            readOnly
          />
          {errors.equipmentId && <p className="text-red-500 text-sm">{errors.equipmentId.message}</p>}
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Maintenance Date"
              type="date"
              id="maintenanceDate"
              {...register("maintenanceDate")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.maintenanceDate && (
              <p className="text-red-500 text-sm">{errors.maintenanceDate.message}</p>
            )}
          </div>
          <div className="w-1/2">
            <TextField
              label="Service Performed"
              type="text"
              id="servicedPerformed"
              {...register("servicedPerformed")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.servicedPerformed && (
              <p className="text-red-500 text-sm">{errors.servicedPerformed.message}</p>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Service Provider"
              type="text"
              id="servicedProvider"
              {...register("servicedProvider")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.servicedProvider && (
              <p className="text-red-500 text-sm">{errors.servicedProvider.message}</p>
            )}
          </div>
          <div className="w-1/2">
            <TextField
              label="Cost"
              type="number"
              id="cost"
              {...register("cost", { valueAsNumber: true })}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.cost && <p className="text-red-500 text-sm">{errors.cost.message}</p>}
          </div>
        </div>
        <div>
          <TextField
            label="Next Maintenance Date"
            type="date"
            id="nextMaintenanceDue"
            {...register("nextMaintenanceDue")}
            slotProps={{ inputLabel: { shrink: true } }}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            required
          />
          {errors.nextMaintenanceDue && (
            <p className="text-red-500 text-sm">{errors.nextMaintenanceDue.message}</p>
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm transition duration-300 ease-in hover:bg-gray-600"
            onClick={() => navigate("/admin/list-maintenance-record")}
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
            Are you sure you want to update this Record?
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

export default UpdateMaintenanceRecord;
