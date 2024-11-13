import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

export const useFetchRentalRequest = (id: string) => {
  return useQuery({
    queryKey: ["rentalRequest", id],
    queryFn: async () => {
      const response = await axios.get(`/RentalRequest/${id}`);
      return response.data;
    },
  });
};

export const useUpdateRentalRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      await axios.put(`/RentalRequest/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast.success("Data berhasil diubah!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["rentalRequests"] });
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
