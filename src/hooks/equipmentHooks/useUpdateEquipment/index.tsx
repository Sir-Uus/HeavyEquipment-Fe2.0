import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

export const useFetchEquipment = (id: string) => {
  return useQuery({
    queryKey: ["equipment", id],
    queryFn: async () => {
      const response = await axios.get(`/Equipment/${id}`);
      return response.data;
    },
  });
};

export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      await axios.put(`/Equipment/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast.success("Data berhasil diubah!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
