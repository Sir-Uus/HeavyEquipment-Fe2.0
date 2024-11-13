import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

const fetchRentalRequestOptions = async () => {
  const { data } = await axios.get("/RentalRequest");
  return data?.data || [];
};

export const useRentalRequestOptions = () => {
  return useQuery({ queryKey: ["rentalRequests"], queryFn: fetchRentalRequestOptions });
};
