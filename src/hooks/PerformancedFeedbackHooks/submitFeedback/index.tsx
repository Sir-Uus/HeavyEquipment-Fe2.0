import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";

export const useSubmitFeedback = (equipmentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["submitFeedback", equipmentId],
    mutationFn: async (payload: any) => {
      const response = await axios.post("/Feedbacks", payload);
      return response.data;
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks", equipmentId] });
    },
    onError: (error) => {
      console.error("Error submitting feedback:", error);
    },
  });
};

export const useSubmitSparePartFeedback = (sparePartId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["submitSparePartFeedback", sparePartId],
    mutationFn: async (payload: any) => {
      const response = await axios.post("/SparePartFeedback", payload);
      return response.data;
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["sparepartFeedbacks", sparePartId] });
    },
    onError: (error) => {
      console.error("Error submitting feedback:", error);
    },
  });
};
