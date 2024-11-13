import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

const fetchRentalRequestOptions = async () => {
  const { data } = await axios.get("/RentalRequest/all");
  return data || [];
};

export const useRentalRequestOptions = () => {
  return useQuery({ queryKey: ["rentalRequests"], queryFn: fetchRentalRequestOptions });
};

const fetchRentalRequestIdsOptions = async (rentalRequestId: string) => {
  const { data } = await axios.get(`/RentalRequest/${rentalRequestId}`);
  return data || [];
};

export const useRentalRequestIdsOptions = (rentalRequestId: string) => {
  return useQuery({
    queryKey: ["rentalRequestsIds", rentalRequestId],
    queryFn: () => fetchRentalRequestIdsOptions(rentalRequestId),
  });
};
