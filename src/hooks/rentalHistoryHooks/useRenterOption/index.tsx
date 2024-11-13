import { useQuery } from "@tanstack/react-query";
import axios from "../../../api/axios";

const fetchRenterOptions = async () => {
  const { data } = await axios.get("/Account/All");
  return data || [];
};

export const useRenterOptions = () => {
  return useQuery({ queryKey: ["renters"], queryFn: fetchRenterOptions });
};
