import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

interface EquipmentOptionResponse {
  hasNextPage: boolean;
  currentPage: number;
  data: Array<any>;
}

const fetchEquipmentOptions = async ({
  pageParam = 1,
  filters,
}: {
  pageParam: number;
  filters: any;
}): Promise<EquipmentOptionResponse> => {
  const { type, status, location, brand, minPrice, maxPrice } = filters;
  const { data } = await axios.get(`/Equipment`, {
    params: {
      pageNumber: pageParam,
      pageSize: 6,
      type,
      status,
      location,
      brand,
      minPrice,
      maxPrice,
    },
  });
  return {
    hasNextPage: data.hasNextPage,
    currentPage: data.currentPage,
    data: data.data,
  };
};


const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchEquipmentImages = async (equipmentIds: number[], delayTime: number) => {
  const equipmetnImages: { [key: number]: string } = {};

  for (const id of equipmentIds) {
    if (!equipmetnImages[id]) {
      try {
        const response = await axios.get(`/Equipment/image/${id}`);
        const image = response.data[0]?.image;
        equipmetnImages[id] = image;
        await delay(delayTime);
      } catch (error) {
        console.error(`Error fetching image for Equipment ID ${id}:`, error);
      }
    }
  }

  return equipmetnImages;
};

export const useEquipmentImages = (equipmentIds: number[], delay: number = 500) => {
  return useQuery({
    queryKey: ["equipmentImages", equipmentIds],
    queryFn: () => fetchEquipmentImages(equipmentIds, delay),
    enabled: equipmentIds.length > 0,
    staleTime: 60000,
  });
};

export const useEquipmentOptions = (filters: any) => {
  return useInfiniteQuery({
    queryKey: ["equipments", filters],
    queryFn: ({ pageParam }) => fetchEquipmentOptions({ pageParam, filters }),
    getNextPageParam: (lastPage: { hasNextPage: boolean; currentPage: number }) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 60000,
  });
};
