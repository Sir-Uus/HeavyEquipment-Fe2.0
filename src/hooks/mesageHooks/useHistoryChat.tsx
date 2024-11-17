import { useQuery } from "@tanstack/react-query";
import axios from "../../api/axios";

const fetchMessageHistory = async (userId: string, otherUserId: string) => {
  const { data } = await axios.get(`/Message/history`, {
    params: { userId, otherUserId },
  });
  return data || [];
};

export const useMessageHistory = (userId: string, otherUserId: string) => {
  return useQuery({
    queryKey: ["messageHistory", userId, otherUserId],
    queryFn: () => fetchMessageHistory(userId, otherUserId),
  });
};
