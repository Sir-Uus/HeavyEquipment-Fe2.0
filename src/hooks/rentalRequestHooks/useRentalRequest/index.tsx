import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RentalRequest } from "../../../types/RentalRequest";

const fetchMappedData = async (ids: any[], endpoint: string, mapKey: string, mapValue: string) => {
  const requests = ids.map((id) => axios.get(`${endpoint}/${id}`));
  const responses = await Promise.all(requests);
  return new Map(responses.map((res) => [res.data[mapKey], res.data[mapValue]]));
};

export const useFetchEquipment = () => {
  return useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      const { data } = await axios.get("/Equipment/all");
      return data;
    },
  });
};

export const useFetchUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("/Account/All");
      return data;
    },
  });
};

export const useRentalRequest = () => {
  const itemsPerPage = 6;
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const equipmentName = searchParams.get("equipmentName") || "";
  const userName = searchParams.get("userName") || "";
  const invoice = searchParams.get("invoice") || "";
  const starDate = searchParams.get("starDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const status = searchParams.get("status") || "";
  const navigate = useNavigate();

  const { data: rentalRequestData, isLoading: rentalRequestLoading } = useQuery({
    queryKey: [
      "rentalRequest",
      currentPage,
      itemsPerPage,
      status,
      equipmentName,
      userName,
      invoice,
      starDate,
      endDate,
      status,
    ],
    queryFn: async () => {
      const { data } = await axios.get("/RentalRequest", {
        params: {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
          equipmentName,
          userName,
          invoice,
          starDate,
          endDate,
          status,
        },
      });
      return data;
    },
  });

  const rentalRequests: RentalRequest[] = rentalRequestData?.data || [];
  const totalPages: number = rentalRequestData?.totalPages || 1;

  const { data: equipmentMap, isLoading: equipmentLoading } = useQuery({
    queryKey: ["equipmentMap", rentalRequests],
    queryFn: async () => {
      const equipmentIds = rentalRequests.map((req) => req.equipmentId);
      return fetchMappedData(equipmentIds, "/Equipment", "id", "name");
    },
    enabled: rentalRequests.length > 0,
  });

  const { data: userMap, isLoading: userLoading } = useQuery({
    queryKey: ["userMap", rentalRequests],
    queryFn: async () => {
      const userIds = rentalRequests.map((req) => req.userId);
      return fetchMappedData(userIds, "/Account", "id", "displayName");
    },
    enabled: rentalRequests.length > 0,
  });

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/RentalRequest/${id}`);
      toast.success("Data berhasil dihapus!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["rentalRequest", currentPage, itemsPerPage] });
    } catch (error) {
      console.error("Error deleting Rental Request:", error);
      toast.error("Gagal menghapus data!", { position: "bottom-right" });
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/update-rental-request/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({
      page: newPage.toString(),
      equipmentName,
      userName,
      invoice,
      starDate,
      endDate,
      status,
    });
  };

  return {
    rentalRequests,
    equipmentMap,
    userMap,
    totalPages,
    currentPage,
    handlePageChange,
    handleDelete,
    handleEdit,
    rentalRequestLoading,
    equipmentLoading,
    userLoading,
  };
};
