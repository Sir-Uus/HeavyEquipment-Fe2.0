import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

interface SparepartOptionResponse {
  hasNextPage: boolean;
  currentPage: number;
  data: Array<any>;
}

const fetchSparePartOptions = async ({ pageParam = 1, filters }: { pageParam: number; filters: any }): Promise<SparepartOptionResponse> => {
  const { equipmentName, manufacturer, availabilityStatus, minPrice, maxPrice } = filters;
  const { data } = await axios.get(`/SparePart`, {
    params: {
      pageNumber: pageParam,
      pageSize: 6,
      equipmentName,
      manufacturer,
      availabilityStatus,
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

const fetchSparePartImages = async (sparePartIds: number[], delayTime: number) => {
  const sparePartImages: { [key: number]: string } = {};

  for (const id of sparePartIds) {
    try {
      const response = await axios.get(`/SparePart/image/${id}`);
      const image = response.data[0]?.image;

      sparePartImages[id] = image;

      await delay(delayTime);
    } catch (error) {
      console.error(`Error fetching image for part ID ${id}:`, error);
    }
  }

  return sparePartImages;
};

export const useSparePartOptions = (filters: any) => {
  return useInfiniteQuery({
    queryKey: ["sparePart", filters],
    queryFn: ({ pageParam }) => fetchSparePartOptions({ pageParam, filters }),
    getNextPageParam: (lastPage: { hasNextPage: boolean; currentPage: number }) => {
      return lastPage.hasNextPage ? lastPage.currentPage + 1 : undefined;
    },
    initialPageParam: 1,
  });
};

export const useSparePartImages = (sparePartIds: number[], delay: number = 500) => {
  return useQuery({
    queryKey: ["sparePartImages", sparePartIds],
    queryFn: () => fetchSparePartImages(sparePartIds, delay),
    enabled: sparePartIds.length > 0,
  });
};
