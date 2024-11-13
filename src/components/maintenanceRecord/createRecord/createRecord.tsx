import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEquipmentOptions } from "../../../hooks/maintenanceRecordHooks/useEquipmentOption";
import { useCreateMaintenanceRecord } from "../../../hooks/maintenanceRecordHooks/useCreateRecord";
import { useNavigate } from "react-router-dom";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  equipmentId: z.number().min(0, "Equipment is required"),
  maintenanceDate: z.string().nonempty("Maintenance Date is required"),
  servicedPerformed: z.string().nonempty("Service Performed is required"),
  servicedProvider: z.string().nonempty("Service Provider is required"),
  cost: z.string().min(0, "Cost must be a positive number"),
  nextMaintenanceDue: z.string(),
});

export type FormData = z.infer<typeof schema>;

const CreateMaintenanceRecord: React.FC = () => {
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
  const createMaintenanceRecord = useCreateMaintenanceRecord();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (formData) {
      createMaintenanceRecord.mutate(formData);
      reset();
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Maintenance Record</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Equipment"
              select
              id="equipmentId"
              defaultValue={""}
              {...register("equipmentId")}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Equipment</MenuItem>
              {equipmentOptions.map((equipment: any) => (
                <MenuItem key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </MenuItem>
              ))}
            </TextField>
            {errors.equipmentId && <p className="text-red-600">{String(errors.equipmentId.message)}</p>}
          </div>

          <div className="w-1/2">
            <TextField
              label="Maintenance Date"
              id="maintenanceDate"
              type="date"
              {...register("maintenanceDate")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.maintenanceDate && (
              <p className="text-red-600">{String(errors.maintenanceDate.message)}</p>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Service Performed"
              id="servicedPerformed"
              type="text"
              {...register("servicedPerformed")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.servicedPerformed && (
              <p className="text-red-600">{String(errors.servicedPerformed.message)}</p>
            )}
          </div>

          <div className="w-1/2">
            <TextField
              label="Service Provider"
              id="servicedProvider"
              type="text"
              {...register("servicedProvider")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.servicedProvider && (
              <p className="text-red-600">{String(errors.servicedProvider.message)}</p>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Cost"
              id="cost"
              type="number"
              {...register("cost")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.cost && <p className="text-red-600">{String(errors.cost.message)}</p>}
          </div>

          <div className="w-1/2">
            <TextField
              label="Next Maintenance Date"
              id="nextMaintenanceDue"
              type="date"
              {...register("nextMaintenanceDue")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
          </div>
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
            <span className="material-icons text-gray-900">info</span>Confirm Create
          </h2>
          <p className="text-gray-900 text-center mt-8 font-semibold">
            Are you sure you want to create this Record?
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

export default CreateMaintenanceRecord;
