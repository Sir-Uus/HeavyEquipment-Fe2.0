import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEquipmentOptions } from "../../../hooks/sparepartHooks/useEquipmentOption";
import { useCreateSparePart } from "../../../hooks/sparepartHooks/useCreateSparepart";
import { useNavigate } from "react-router-dom";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";
import { useDropzone } from "react-dropzone";

const schema = z.object({
  equipmentId: z.number().min(0, "Equipment is required"),
  partName: z.string().nonempty("Part Name is required"),
  partNumber: z.string().nonempty("Part Number is required"),
  manufacturer: z.string().nonempty("Manufacturer is required"),
  availabilityStatus: z.string().nonempty("Availability Status is required"),
  price: z.string().min(0, "Cost must be a positive number"),
  sparePartImage: z
    .object({
      image: z.string().optional(),
      contenType: z.string().optional(),
      fileName: z.string().optional(),
    })
    .optional(),
  stock: z.number().min(0, "stock cannot be empty"),
});

export type FormData = z.infer<typeof schema>;

const CreateSparePart: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const { data: equipmentOptions = [] } = useEquipmentOptions();
  const createMaintenanceRecord = useCreateSparePart();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result?.toString().split(",")[1];
          const img = {
            contenType: file.type,
            fileName: file.name,
            image: `data:${file.type};base64,${base64String}`,
          };
          setValue("sparePartImage", img);
          setImagePreview(reader.result?.toString() || null);
        };
        reader.readAsDataURL(file);
      }
    },
  });

  const handleConfirm = () => {
    if (formData) {
      createMaintenanceRecord.mutate(formData);
      reset();
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Spare Part</h1>
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
              label="Part Name"
              type="text"
              id="partName"
              {...register("partName")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.partName && <p className="text-red-600">{errors.partName.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Part"
              type="text"
              id="partNumber"
              {...register("partNumber")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.partNumber && <p className="text-red-600">{errors.partNumber.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Manufacturer"
              type="text"
              id="manufacturer"
              {...register("manufacturer")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.manufacturer && <p className="text-red-600">{errors.manufacturer.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Status"
              select
              defaultValue={""}
              id="availabilityStatus"
              {...register("availabilityStatus")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </TextField>
            {errors.availabilityStatus && <p className="text-red-600">{errors.availabilityStatus.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Price"
              type="number"
              id="price"
              {...register("price")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.price && <p className="text-red-600">{errors.price.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Stock"
              type="text"
              id="stock"
              {...register("stock", { valueAsNumber: true })}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.stock && <p className="text-red-600">{errors.stock.message}</p>}
          </div>
        </div>
        <div {...getRootProps()} className="text-center cursor-pointer w-[20%] h-[20%] ">
          {imagePreview ? (
            <div>
              <img src={imagePreview} alt="Preview" className="p-2 border border-dashed border-gray-900" />
              <input {...getInputProps()} />
            </div>
          ) : (
            <div>
              <input {...getInputProps()} />
              <img src="/upload_area.svg" alt="upload" className="w-full h-full" />
            </div>
          )}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm transition duration-300 ease-in hover:bg-gray-600"
            onClick={() => navigate("/admin/list-sparepart")}
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
            Are you sure you want to create this Sparepart?
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

export default CreateSparePart;
