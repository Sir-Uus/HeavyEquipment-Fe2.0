import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

export const useFetchPayment = (id: string) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: async () => {
      const response = await axios.get(`/Payment/${id}`);
      return response.data;
    },
  });
};

export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      await axios.put(`/Payment/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast.success("Data berhasil diubah!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["payment"] });
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
