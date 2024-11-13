import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

export const useFetchRentalHistory = (id: string) => {
  return useQuery({
    queryKey: ["rentalHistory", id],
    queryFn: async () => {
      const response = await axios.get(`/RentalHistory/${id}`);
      return response.data;
    },
  });
};

export const useUpdateRentalHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      await axios.put(`/RentalHistory/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast.success("Data berhasil diubah!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["rentalHistory"] });
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
