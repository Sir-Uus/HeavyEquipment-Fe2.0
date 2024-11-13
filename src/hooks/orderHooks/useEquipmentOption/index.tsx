import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

const fetchEquipmentByIds = async (equipmentIds: number[]) => {
  const equipmentPromises = equipmentIds.map((id) => axios.get(`/Equipment/${id}`));
  const equipmentResponses = await Promise.all(equipmentPromises);
  return equipmentResponses.map((response) => response.data);
};

export const useEquipment = (equipmentIds: number[]) => {
  return useQuery({
    queryKey: ["equipment", equipmentIds],
    queryFn: () => fetchEquipmentByIds(equipmentIds),
    enabled: equipmentIds.length > 0,
  });
};
