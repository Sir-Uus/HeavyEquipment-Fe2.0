import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

export const useFetchFeedbacks = (equipmentId: string, isOpen: boolean) => {
  return useQuery({
    queryKey: ["feedbacks", equipmentId],
    queryFn: async () => {
      const response = await axios.get(`/Feedbacks/ByEquipment/${equipmentId}`);
      const feedbacksData = response.data;

      const userIds = new Set<string>();
      feedbacksData.forEach((feedback: any) => {
        if (feedback.userId) userIds.add(feedback.userId);
      });

      const userPromises = Array.from(userIds).map((id) => axios.get(`/Account/${id}`));
      const userResponses = await Promise.all(userPromises);
      const userMap = new Map<string, string>();

      userResponses.forEach((response) => {
        const user = response.data;
        userMap.set(user.id, user.displayName);
      });

      return { feedbacks: feedbacksData, userMap };
    },

    enabled: isOpen && !!equipmentId,
  });
};

export const useFetchSparePartFeedbacks = (sparepartId: string, isOpen: boolean) => {
  return useQuery({
    queryKey: ["sparepartFeedbacks", sparepartId],
    queryFn: async () => {
      const response = await axios.get(`/SparePartFeedback/by-sparepart/${sparepartId}`);
      const feedbacksData = response.data;

      const userIds = new Set<string>();
      feedbacksData.forEach((feedback: any) => {
        if (feedback.userId) userIds.add(feedback.userId);
      });

      const userPromises = Array.from(userIds).map((id) => axios.get(`/Account/${id}`));
      const userResponses = await Promise.all(userPromises);
      const userMap = new Map<string, string>();

      userResponses.forEach((response) => {
        const user = response.data;
        userMap.set(user.id, user.displayName);
      });

      return { feedbacks: feedbacksData, userMap };
    },

    enabled: isOpen && !!sparepartId,
  });
};
