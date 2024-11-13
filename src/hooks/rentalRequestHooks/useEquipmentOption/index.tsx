import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { useParams } from "react-router-dom";

const fetchEquipmentOptions = async () => {
  const { data } = await axios.get("/Equipment/all");
  return data || [];
};

export const useEquipmentOptions = () => {
  return useQuery({ queryKey: ["equipments"], queryFn: fetchEquipmentOptions });
};

const fetchEquipmentDetails = async (id: string | undefined) => {
  if (!id) throw new Error("No ID provided");
  const { data } = await axios.get(`/Equipment/${id}`);
  return data || {};
};

export const useEquipmentOptionsIds = () => {
  const { id } = useParams<{ id: string }>();
  return useQuery({
    queryKey: ["equipmentsIds", id],
    queryFn: () => fetchEquipmentDetails(id),
    enabled: !!id,
  });
};
