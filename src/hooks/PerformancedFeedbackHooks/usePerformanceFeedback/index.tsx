import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Feedback } from "../../../types/PerformancedFeedback";

export const useFeedbacks = () => {
  const itemsPerPage = 6;
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const equipmentName = searchParams.get("equipmentName") || "";
  const userName = searchParams.get("userName") || "";
  const feedbackDate = searchParams.get("feedbackDate") || "";
  const rating = searchParams.get("rating") || "";
  const comment = searchParams.get("comment") || "";
  const navigate = useNavigate();

  const { data: feedbackData, isLoading: feedbackLoading } = useQuery({
    queryKey: ["feedback", currentPage, itemsPerPage, equipmentName, userName, feedbackDate, rating, comment],
    queryFn: async () => {
      const response = await axios.get("/Feedbacks", {
        params: {
          pageNumber: currentPage,
          pageSize: itemsPerPage,
          equipmentName,
          userName,
          feedbackDate,
          rating,
          comment,
        },
      });
      return response?.data;
    },
  });

  const feedbacks: Feedback[] = feedbackData?.data || [];
  const totalPages: number = feedbackData?.totalPages || 1;

  const { data: equipmentData, isLoading: equipmentLoading } = useQuery({
    queryKey: ["equipmentMap", feedbacks],
    queryFn: async () => {
      const equipmentIds = feedbacks.map((f) => f.equipmentId);
      const requests = equipmentIds.map((id) => axios.get(`/Equipment/${id}`));
      const responses = await Promise.all(requests);
      const equipmentArray = responses.map((response) => response.data);
      const equipmentMap = new Map(equipmentArray.map((equipment) => [equipment.id, equipment.name]));
      return equipmentMap;
    },
    enabled: feedbacks.length > 0,
  });

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["userMap", feedbacks],
    queryFn: async () => {
      const userIds = feedbacks.map((f) => f.userId);
      const request = userIds.map((id) => axios.get(`/Account/${id}`));
      const responses = await Promise.all(request);
      const userArray = responses.map((response) => response.data);
      const userMap = new Map(userArray.map((user) => [user.id, user.displayName]));
      return userMap;
    },
    enabled: feedbacks.length > 0,
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
    navigate(`/admin/update-feedback/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ page: newPage.toString(), equipmentName, userName, feedbackDate, rating, comment });
  };

  return {
    feedbacks,
    equipmentData,
    userData,
    totalPages,
    currentPage,
    handlePageChange,
    handleDelete,
    handleEdit,
    feedbackLoading,
    equipmentLoading,
    userLoading,
  };
};
