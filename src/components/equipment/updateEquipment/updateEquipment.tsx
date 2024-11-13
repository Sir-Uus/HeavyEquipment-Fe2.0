import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchEquipment, useUpdateEquipment } from "../../../hooks/equipmentHooks/useUpdateEquipment";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  yearOfManufacture: z.string().min(1, "Year of Manufacture is required"),
  specification: z.string().min(1, "Specification is required"),
  description: z.string().min(1, "Description is required"),
  images: z.object({
    image: z.string().optional(),
    contenType: z.string().optional(),
    fileName: z.string().optional(),
  }),
  status: z.string().min(1, "Status is required"),
  location: z.string().min(1, "Location is required"),
  rentalPrice: z.number().min(0, "Rental Price is required"),
  unit: z.number().min(0, "Unit is required"),
});

type FormData = z.infer<typeof schema>;

const UpdateEquipment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const { data, isLoading, isError } = useFetchEquipment(id!);
  const updateMutation = useUpdateEquipment();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (data) {
      setValue("name", data.name || "");
      setValue("type", data.type || "");
      setValue("brand", data.brand || "");
      setValue("model", data.model || "");
      setValue("yearOfManufacture", data.yearOfManufacture || "");
      setValue("specification", data.specification || "");
      setValue("description", data.description || "");
      setValue("images", data.images || { image: "", contenType: "", fileName: "" });
      setValue("status", data.status || "");
      setValue("location", data.location || "");
      setValue("rentalPrice", data.rentalPrice || 0);
      setValue("unit", data.unit || 0);
    }
  }, [data, setValue]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading rental request</div>;

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result?.toString().split(",")[1];
        let img = {
          contenType: file.type,
          fileName: file.name,
          image: `data:${file.type};base64,` + base64String || "",
        };
        setValue("images", img);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirm = async () => {
    if (formData) {
      const payload = {
        ...formData,
      };
      await updateMutation.mutateAsync({ id: id!, payload });
      navigate("/admin/list-equipment");
    }
  };

  return (
    <div className="mt-4 p-4 border-t">
      <h2 className="text-xl font-bold mb-4">Edit Equipment</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Equipment Name"
              type="text"
              id="name"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("name")}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Type"
              type="text"
              id="type"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("type")}
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
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("brand")}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.brand && <p className="text-red-500 text-sm">{errors.brand.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Model"
              type="text"
              id="model"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("model")}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.model && <p className="text-red-500 text-sm">{errors.model.message}</p>}
          </div>
        </div>
        <div>
          <TextField
            label="Specification"
            id="specification"
            multiline
            rows={3}
            {...register("specification")}
            slotProps={{ inputLabel: { shrink: true } }}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
          />
          {errors.specification && <p className="text-red-500 text-sm">{errors.specification.message}</p>}
        </div>
        <div>
          <TextField
            label="Description"
            id="description"
            multiline
            {...register("description")}
            slotProps={{ inputLabel: { shrink: true } }}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            rows={3}
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Year of Manufacturw"
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
              label="Image"
              type="file"
              id="image"
              onChange={handleFileChange}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-[5px] block w-full border border-gray-900 rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Status"
              select
              id="status"
              defaultValue={data.status}
              {...register("status")}
              className="mt-1 p-0 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Status</MenuItem>
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Unavailable">Unavailable</MenuItem>
            </TextField>
            {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
          </div>
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
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Rental Price"
              id="rentalPrice"
              {...register("rentalPrice", { valueAsNumber: true })}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setValue("rentalPrice", Number(value));
              }}
              value={watch("rentalPrice") ? watch("rentalPrice").toString() : ""}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.rentalPrice && <p className="text-red-500 text-sm">{errors.rentalPrice.message}</p>}
          </div>

          <div className="w-1/2">
            <TextField
              label="Unit"
              type="text"
              id="unit"
              {...register("unit", { valueAsNumber: true })}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.unit && <p className="text-red-500 text-sm">{errors.unit.message}</p>}
          </div>
        </div>
        <div className="flex justify-between">
          <button
            id="buttonCancel"
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm transition duration-300 ease-in hover:bg-gray-600"
            onClick={() => navigate("/admin/list-equipment")}
          >
            <div className="flex gap-2">
              <span className="material-icons text-[18px] mt-[3px]">exit_to_app</span>Cancel
            </div>
          </button>
          <button
            id="buttonConfirm"
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

export default UpdateEquipment;
