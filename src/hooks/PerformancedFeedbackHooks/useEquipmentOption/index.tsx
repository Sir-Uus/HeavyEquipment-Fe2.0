import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

const fetchEquipmentOptions = async () => {
  const { data } = await axios.get("/Equipment/all");
  return data || [];
};

export const useEquipmentOptions = () => {
  return useQuery({ queryKey: ["equipments"], queryFn: fetchEquipmentOptions });
};

const fetchEquipmentPaged = async ({ pageParam = 1 }) => {
  const { data } = await axios.get(`/Equipment?pageNumber=${pageParam}&pageSize=6`);
  return data;
};

export const useEquipmentOptionsPaged = () => {
  return useInfiniteQuery({
    queryKey: ["equipments"],
    queryFn: fetchEquipmentPaged,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
