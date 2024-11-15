import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Equipments } from "../../../types/EquipmentTypes";

export const useEquipments = () => {
  const itemsPerPage = 6;
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const searchTerm = searchParams.get("searchTerm") || "";
  const type = searchParams.get("type") || "";
  const status = searchParams.get("status") || "";
  const location = searchParams.get("location") || "";
  const brand = searchParams.get("brand") || "";
  const model = searchParams.get("model") || "";
  const specification = searchParams.get("specification") || "";
  const description = searchParams.get("description") || "";
  const yearOfManufacturer = searchParams.get("yearOfManufacturer") || "";
  const rentalPrice = searchParams.get("rentalPrice") || "";
  const unit = searchParams.get("unit") || "";

  const navigate = useNavigate();

  const { data: equipmentData, isLoading: equipmentLoading } = useQuery({
    queryKey: [
      "equipment",
      currentPage,
      itemsPerPage,
      searchTerm,
      type,
      status,
      location,
      brand,
      model,
      specification,
      description,
      yearOfManufacturer,
      rentalPrice,
      unit,
    ],

    queryFn: async () => {
      const delay = new Promise((resolve) => setTimeout(resolve, 500));
      await delay;
      const response = await axios.get("/Equipment", {
        params: {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
          searchTerm,
          type,
          status,
          location,
          brand,
          model,
          specification,
          description,
          yearOfManufacturer,
          rentalPrice,
          unit,
        },
      });
      return response?.data;
    },
    staleTime: 60000,
  });

  const fetchEquipmentImage = async (equipmentId: number) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(500);
    const response = await axios.get(`/Equipment/image/${equipmentId}`);
    return response.data[0]?.image;
  };

  const equipmentImages = useQuery({
    queryKey: ["equipmentImages", equipmentData?.data],
    queryFn: async () => {
      const images: { equipmentId: number; image: string }[] = [];

      for (const equipment of equipmentData?.data || []) {
        const image = await fetchEquipmentImage(equipment.id);
        images.push({ equipmentId: equipment.id, image });
      }

      return images.reduce((acc: any, item) => {
        acc[item.equipmentId] = item.image;
        return acc;
      }, {});
    },
    enabled: !!equipmentData?.data,
  });

  const equipments: Equipments[] = equipmentData?.data || [];
  const totalPages: number = equipmentData?.totalPages || 1;

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/Equipment/${id}`);
      toast.success("Data berhasil dihapus!", { position: "bottom-right" });
      queryClient.invalidateQueries({
        queryKey: ["equipment", currentPage, itemsPerPage, searchTerm, type, status, location],
      });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Gagal menghapus data!", { position: "bottom-right" });
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/update-equipment/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      searchTerm,
      type,
      status,
      location,
      brand,
      model,
      specification,
      description,
      yearOfManufacturer,
      rentalPrice,
      unit,
    });
  };

  return {
    equipments,
    totalPages,
    currentPage,
    handlePageChange,
    handleDelete,
    handleEdit,
    equipmentLoading,
    equipmentImages: equipmentImages?.data || [],
  };
};
