import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import axios from "../../../api/axios";

const fetchSparePartOptions = async () => {
  const { data } = await axios.get("/SparePart/all");
  return data || [];
};

const fetchSparePart = async (id: string | undefined) => {
  if (!id) throw new Error("No ID provided");
  const { data } = await axios.get(`/SparePart/${id}`);
  return data || {};
};

const fetchSparepartByIds = async (sparepartIds: number[]) => {
  const sparepartPromises = sparepartIds.map((id) => axios.get(`/SparePart/${id}`));
  const sparepartResponses = await Promise.all(sparepartPromises);
  return sparepartResponses.map((response) => response.data);
};

const fetchSparePartImage = async (sparePartId: number) => {
  const response = await axios.get(`/SparePart/image/${sparePartId}`);
  return response.data[0]?.image;
};

export const useSparePartImage = (sparePartId: number) => {
  return useQuery({
    queryKey: ["sparePartImage", sparePartId],
    queryFn: () => fetchSparePartImage(sparePartId),
  });
};

export const useSparePart = () => {
  return useQuery({ queryKey: ["spareParts"], queryFn: fetchSparePartOptions });
};

export const useSparePartOptionsIds = () => {
  const { id } = useParams<{ id: string }>();
  return useQuery({
    queryKey: ["sparePartsIds", id],
    queryFn: () => fetchSparePart(id),
    enabled: !!id,
  });
};

export const useSparepart = (userId: number[]) => {
  return useQuery({
    queryKey: ["sparePart", userId],
    queryFn: () => fetchSparepartByIds(userId),
    enabled: userId.length > 0,
  });
};
