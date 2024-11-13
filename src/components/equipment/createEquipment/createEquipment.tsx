import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateEquipment } from "../../../hooks/equipmentHooks/useCreateEquipment";
import { useNavigate } from "react-router-dom";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";
import { useDropzone } from "react-dropzone";

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  type: z.string().nonempty("Type is required"),
  brand: z.string().nonempty("Brand is required"),
  model: z.string().nonempty("Model is required"),
  yearOfManufacture: z.string().nonempty("Year of Manufacture is required"),
  specification: z.string().nonempty("Specification is required"),
  description: z.string().nonempty("Description is required"),
  status: z.string().nonempty("Status is required"),
  location: z.string().nonempty("Location is required"),
  rentalPrice: z.string().min(1, "Rental Price is required"),
  images: z
    .object({
      image: z.string().optional(),
      contenType: z.string().optional(),
      fileName: z.string().optional(),
    })
    .optional(),
  unit: z.number().min(1, "Unit is required"),
});

export type FormData = z.infer<typeof schema>;

const CreateEquipment: React.FC = () => {
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

  const createEquipment = useCreateEquipment();

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
          setValue("images", img);
          setImagePreview(reader.result?.toString() || null);
        };
        reader.readAsDataURL(file);
      }
    },
  });

  const handleConfirm = () => {
    if (formData) {
      createEquipment.mutate(formData);
      reset();
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create Equipment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Name"
              type="text"
              id="name"
              {...register("name")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Type"
              type="text"
              id="type"
              {...register("type")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Brand"
              type="text"
              id="brand"
              {...register("brand")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Model"
              type="text"
              id="model"
              {...register("model")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
          </div>
        </div>
        <div>
          <TextField
            multiline
            label="Specifiaction"
            id="specification"
            {...register("specification")}
            slotProps={{ inputLabel: { shrink: true } }}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            rows={2}
          />
          {errors.specification && <p className="text-red-500 text-sm">{errors.specification.message}</p>}
        </div>
        <div>
          <TextField
            multiline
            label="Description"
            id="description"
            {...register("description")}
            slotProps={{ inputLabel: { shrink: true } }}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            rows={2}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Year of Manufacture"
              type="text"
              id="yearOfManufacture"
              {...register("yearOfManufacture")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.yearOfManufacture && (
              <p className="text-red-500 text-sm">{errors.yearOfManufacture.message}</p>
            )}
          </div>
          <div className="w-1/2">
            <TextField
              label="Status"
              select
              defaultValue={""}
              id="status"
              {...register("status")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Unavailable">Unavailable</MenuItem>
            </TextField>
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
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
          <div className="w-1/2">
            <TextField
              label="Rental Price"
              type="text"
              id="rentalPrice"
              {...register("rentalPrice")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.rentalPrice && <p className="text-red-500 text-sm">{errors.rentalPrice.message}</p>}
          </div>
        </div>
        <div>
          <div className="w-full mb-8">
            <TextField
              label="Unit"
              type="number"
              id="unit"
              {...register("unit", { valueAsNumber: true })}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
          </div>
        </div>
        <div {...getRootProps()} className="text-center cursor-pointer w-[20%] h-[20%] ">
          {imagePreview ? (
            <div>
              <img src={imagePreview} alt="Preview" className="p-2 border border-dashed border-gray-900" />
              <input {...getInputProps()} />
            </div>
          ) : (
            <>
              <input {...getInputProps()} />
              <img src="/upload_area.svg" alt="upload" className="w-full h-full" />
            </>
          )}
        </div>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm transition duration-300 ease-in hover:bg-gray-600"
            onClick={() => navigate("/admin/list-equipment")}
          >
            <div className="f lex gap-2">
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
            Are you sure you want to create this Equipment?
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

export default CreateEquipment;
