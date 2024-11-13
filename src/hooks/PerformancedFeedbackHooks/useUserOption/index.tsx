import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

const fetchUserOptions = async () => {
  const { data } = await axios.get("/Account/All");
  return data || [];
};

export const useUserOptions = () => {
  return useQuery({ queryKey: ["users"], queryFn: fetchUserOptions });
};
