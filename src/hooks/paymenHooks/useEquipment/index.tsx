import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

const fetchEquipment = async (id: string) => {
  const { data } = await axios.get(`/Equipment/${id}`);
  return data;
};

export const useEquipment = (id: string) => {
  return useQuery({ queryKey: ["equipmentsIds", id], queryFn: () => fetchEquipment(id) });
};
