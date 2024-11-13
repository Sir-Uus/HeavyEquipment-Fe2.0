import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

const fetchEquipmentOptions = async () => {
  const { data } = await axios.get("/Equipment/all");
  return data || [];
};

export const useEquipmentOptions = () => {
  return useQuery({ queryKey: ["equipments"], queryFn: fetchEquipmentOptions });
};
