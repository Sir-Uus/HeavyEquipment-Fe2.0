import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SparePart } from "../../../types/SparePart";

export const useSparePart = () => {
  const itemsPerPage = 6;
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const equipmentName = searchParams.get("equipmentName") || "";
  const partName = searchParams.get("partName") || "";
  const partNumber = searchParams.get("partNumber") || "";
  const manufacturer = searchParams.get("manufacturer") || "";
  const availabilityStatus = searchParams.get("availabilityStatus") || "";
  const price = searchParams.get("price") || "";
  const navigate = useNavigate();

  const { data: sparePartData, isLoading: sparePartLoading } = useQuery({
    queryKey: [
      "sparePart",
      currentPage,
      itemsPerPage,
      equipmentName,
      partName,
      partNumber,
      manufacturer,
      availabilityStatus,
      price,
    ],
    queryFn: async () => {
      const delay = new Promise((resolve) => setTimeout(resolve, 1000));
      await delay;
      const response = await axios.get("/SparePart", {
        params: {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
          equipmentName,
          partName,
          partNumber,
          manufacturer,
          availabilityStatus,
          price,
        },
      });
      return response?.data;
    },
  });

  const fetchSparePartImage = async (sparePartId: number) => {
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(1000);
    const response = await axios.get(`/SparePart/image/${sparePartId}`);
    return response.data[0]?.image;
  };

  const fetchSparePartImages = async (sparePartId: number) => {
    const response = await axios.get(`/SparePart/image/${sparePartId}`);
    return response.data[0]?.image;
  };

  const sparePartImage = useQuery({
    queryKey: ["sparePartImage", sparePartData?.data],
    queryFn: async () => {
      const images: { sparePartId: number; image: string }[] = [];

      for (const sparePart of sparePartData?.data || []) {
        const image = await fetchSparePartImage(sparePart.id);
        images.push({ sparePartId: sparePart.id, image });
      }

      return images.reduce((acc: any, item) => {
        acc[item.sparePartId] = item.image;
        return acc;
      }, {});
    },
    enabled: !!sparePartData?.data,
  });

  const sparePartImages = useQuery({
    queryKey: ["sparePartImages", sparePartData?.data],
    queryFn: async () => {
      const images: { sparePartId: number; image: string }[] = [];

      for (const sparePart of sparePartData?.data || []) {
        const image = await fetchSparePartImages(sparePart.id);
        images.push({ sparePartId: sparePart.id, image });
      }

      return images.reduce((acc: any, item) => {
        acc[item.sparePartId] = item.image;
        return acc;
      }, {});
    },
    enabled: !!sparePartData?.data,
  });

  const sparePart: SparePart[] = sparePartData?.data || [];
  const totalPages: number = sparePartData?.totalPages || 1;

  const { data: equipmentData, isLoading: equipmentLoading } = useQuery({
    queryKey: ["equipmentMap", sparePart],
    queryFn: async () => {
      const equipmentIds = sparePart.map((f) => f.equipmentId);
      const requests = equipmentIds.map((id) => axios.get(`/Equipment/${id}`));
      const responses = await Promise.all(requests);
      const equipmentArray = responses.map((response) => response.data);
      const equipmentMap = new Map(equipmentArray.map((equipment) => [equipment.id, equipment.name]));
      return equipmentMap;
    },
    enabled: sparePart.length > 0,
  });

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/SparePart/${id}`);
      toast.success("Data berhasil dihapus!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["sparePart", currentPage, itemsPerPage] });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Gagal menghapus data!", { position: "bottom-right" });
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/update-sparepart/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      equipmentName,
      partName,
      partNumber,
      manufacturer,
      availabilityStatus,
    });
  };

  return {
    sparePart,
    equipmentData,
    totalPages,
    currentPage,
    handlePageChange,
    handleDelete,
    handleEdit,
    sparePartLoading,
    equipmentLoading,
    sparePartImage: sparePartImage?.data || [],
    sparePartImages: sparePartImages?.data || [],
  };
};
