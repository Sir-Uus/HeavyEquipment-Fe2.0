import { ChangeEvent, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetchSparePart, useUpdateSparePart } from "../../../hooks/sparepartHooks/useUpdateSparepart";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  equipmentId: z.number(),
  partName: z.string().nonempty(),
  partNumber: z.string().nonempty(),
  manufacturer: z.string().nonempty(),
  availabilityStatus: z.string().nonempty(),
  price: z.number().min(0),
  sparePartImage: z
    .object({
      image: z.string().optional(),
      contenType: z.string().optional(),
      fileName: z.string().optional(),
    })
    .optional(),
  stock: z.number().min(0),
});

type FormData = z.infer<typeof schema>;

const UpdateSparePart = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const { data, isLoading, isError } = useFetchSparePart(id!);
  const updateMutation = useUpdateSparePart();

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
      setValue("partName", data.partName);
      setValue("partNumber", data.partNumber);
      setValue("manufacturer", data.manufacturer);
      setValue("availabilityStatus", data.availabilityStatus);
      setValue("price", data.price);
      setValue("sparePartImage", data.sparePartImage);
      setValue("stock", data.stock);
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
        setValue("sparePartImage", img);
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
      navigate("/admin/list-sparepart");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Update Spare Part</h1>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <input
            type="hidden"
            id="equipmentId"
            {...register("equipmentId")}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
          />
        </div>
        {/* <div>
          <label htmlFor="equipmentName" className="block text-sm font-medium text-gray-700">
            Equipment
          </label>
          <input
            type="text"
            id="equipmentName"
            value={equipmentName}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            readOnly
          />
        </div> */}
        <div className="flex gap-4">
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
          <div className="w-1/2">
            <TextField
              label="Part Number"
              type="text"
              id="partNumber"
              {...register("partNumber")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.partNumber && <p className="text-red-600">{errors.partNumber.message}</p>}
          </div>
        </div>
        <div className="flex gap-4">
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
          <div className="w-1/2">
            <TextField
              label="Status"
              select
              id="availabilityStatus"
              {...register("availabilityStatus")}
              slotProps={{ inputLabel: { shrink: true } }}
              defaultValue={data ? data.availabilityStatus : ""}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Status</MenuItem>
              <MenuItem value="In Stock">In Stock</MenuItem>
              <MenuItem value="Out of Stock">Out of Stock</MenuItem>
            </TextField>
            {errors.manufacturer && <p className="text-red-600">{errors.manufacturer.message}</p>}
          </div>
        </div>
        <div className=" flex gap-4">
          <div className="w-1/2">
            <TextField
              label="Price"
              type="number"
              id="price"
              {...register("price", { valueAsNumber: true })}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.price && <p className="text-red-600">{errors.price.message}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              label="Stock"
              type="number"
              id="stock"
              {...register("stock", { valueAsNumber: true })}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.price && <p className="text-red-600">{errors.price.message}</p>}
          </div>
        </div>
        <div>
          <TextField
            label="Image"
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            slotProps={{ inputLabel: { shrink: true } }}
            className="mt-1 p-[6px] block w-full border border-gray-900 rounded-md shadow-sm"
          />
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
            <span className="material-icons text-gray-900">info</span>Confirm Update
          </h2>
          <p className="text-gray-900 text-center mt-8 font-semibold">
            Are you sure you want to update this Sparepart?
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

export default UpdateSparePart;
