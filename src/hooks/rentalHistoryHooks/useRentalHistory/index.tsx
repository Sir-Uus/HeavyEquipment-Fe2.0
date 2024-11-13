import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RentalHistory } from "../../../types/RentalHistory";

export const useRentalHistory = () => {
  const itemsPerPage = 6;
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const equipmentName = searchParams.get("equipmentName") || "";
  const renter = searchParams.get("renter") || "";
  const invoice = searchParams.get("invoice") || "";
  const rentalStartDate = searchParams.get("rentalStartDate") || "";
  const rentalEndDate = searchParams.get("rentalEndDate") || "";
  const rentalCost = searchParams.get("rentalCost") || "";
  const location = searchParams.get("location") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");
  const navigate = useNavigate();

  const { data: rentalHistoryData, isLoading: rentalHistoryLoading } = useQuery({
    queryKey: [
      "rentalHistory",
      currentPage,
      itemsPerPage,
      equipmentName,
      renter,
      invoice,
      rentalStartDate,
      rentalEndDate,
      rentalCost,
      location,
    ],
    queryFn: async () => {
      const response = await axios.get("/RentalHistory", {
        params: {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
          equipmentName,
          renter,
          invoice,
          rentalStartDate,
          rentalEndDate,
          rentalCost,
          location,
        },
      });
      return response?.data;
    },
  });

  const rentalHistory: RentalHistory[] = rentalHistoryData?.data || [];
  const totalPages: number = rentalHistoryData?.totalPages || 1;

  const { data: equipmentData, isLoading: equipmentLoading } = useQuery({
    queryKey: ["equipmentMap", rentalHistory],
    queryFn: async () => {
      const equipmentIds = rentalHistory.map((f) => f.equipmentId);
      const requests = equipmentIds.map((id) => axios.get(`/Equipment/${id}`));
      const responses = await Promise.all(requests);
      const equipmentArray = responses.map((response) => response.data);
      const equipmentMap = new Map(equipmentArray.map((equipment) => [equipment.id, equipment.name]));
      return equipmentMap;
    },
    enabled: rentalHistory.length > 0,
  });

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["userMap", rentalHistory],
    queryFn: async () => {
      const userIds = rentalHistory.map((f) => f.renterId);
      const request = userIds.map((id) => axios.get(`/Account/${id}`));
      const responses = await Promise.all(request);
      const userArray = responses.map((response) => response.data);
      const userMap = new Map(userArray.map((user) => [user.id, user.displayName]));
      return userMap;
    },
    enabled: rentalHistory.length > 0,
  });

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/RentalHistory/${id}`);
      toast.success("Data berhasil dihapus!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["rentalHistory", currentPage, itemsPerPage] });
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast.error("Gagal menghapus data!", { position: "bottom-right" });
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/update-rental-history/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), equipmentName, renter, invoice, rentalStartDate });
  };

  return {
    rentalHistory,
    equipmentData,
    userData,
    totalPages,
    currentPage,
    handlePageChange,
    handleDelete,
    handleEdit,
    rentalHistoryLoading,
    equipmentLoading,
    userLoading,
  };
};
