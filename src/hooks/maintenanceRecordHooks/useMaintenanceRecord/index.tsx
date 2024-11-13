import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MaintenaceRecord } from "../../../types/MaintenanceRecord";

export const useMaintenanceRecord = () => {
  const itemsPerPage = 6;
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const equipmentName = searchParams.get("equipmentName") || "";
  const maintenanceDate = searchParams.get("maintenanceDate") || "";
  const serivicedPerformed = searchParams.get("serivicedPerformed") || "";
  const serviceProfider = searchParams.get("serviceProfider") || "";
  const cost = searchParams.get("cost") || "";
  const nextMaintenanceDue = searchParams.get("nextMaintenanceDue") || "";
  const navigate = useNavigate();

  const { data: recordData, isLoading: recordLoading } = useQuery({
    queryKey: [
      "record",
      currentPage,
      itemsPerPage,
      equipmentName,
      maintenanceDate,
      serivicedPerformed,
      serviceProfider,
      cost,
      nextMaintenanceDue,
    ],
    queryFn: async () => {
      const response = await axios.get("/MaintenanceRecord", {
        params: {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
          equipmentName,
          maintenanceDate,
          serivicedPerformed,
          serviceProfider,
          cost,
          nextMaintenanceDue,
        },
      });
      return response?.data;
    },
  });

  const records: MaintenaceRecord[] = recordData?.data || [];
  const totalPages: number = recordData?.totalPages || 1;

  const { data: equipmentData, isLoading: equipmentLoading } = useQuery({
    queryKey: ["equipmentMap", records],
    queryFn: async () => {
      const equipmentIds = records.map((f) => f.equipmentId);
      const requests = equipmentIds.map((id) => axios.get(`/Equipment/${id}`));
      const responses = await Promise.all(requests);
      const equipmentArray = responses.map((response) => response.data);
      const equipmentMap = new Map(equipmentArray.map((equipment) => [equipment.id, equipment.name]));
      return equipmentMap;
    },
    enabled: records.length > 0,
  });

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/Feedbacks/${id}`);
      toast.success("Data berhasil dihapus!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["feedback", currentPage, itemsPerPage] });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Gagal menghapus data!", { position: "bottom-right" });
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/update-maintenance-record/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      equipmentName,
      maintenanceDate,
      serivicedPerformed,
      serviceProfider,
      cost,
    });
  };

  return {
    records,
    equipmentData,
    totalPages,
    currentPage,
    handlePageChange,
    handleDelete,
    handleEdit,
    recordLoading,
    equipmentLoading,
  };
};
