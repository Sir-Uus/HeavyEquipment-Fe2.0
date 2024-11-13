import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

export const useFetchPerformanceFeedback = (id: string) => {
  return useQuery({
    queryKey: ["performanceFeedback", id],
    queryFn: async () => {
      const response = await axios.get(`/Feedbacks/${id}`);
      return response.data;
    },
  });
};

export const useUpdatePerformancedFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      await axios.put(`/Feedbacks/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast.success("Data berhasil diubah!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["performanceFeedback"] });
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
