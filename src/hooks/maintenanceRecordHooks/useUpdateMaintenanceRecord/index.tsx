import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

export const useFetchMaintenanceRecord = (id: string) => {
  return useQuery({
    queryKey: ["maintenanceRecord", id],
    queryFn: async () => {
      const response = await axios.get(`/MaintenanceRecord/${id}`);
      return response.data;
    },
  });
};

export const useUpdateMaintenanceRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateRecord"],
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      await axios.put(`/MaintenanceRecord/${id}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      toast.success("Data berhasil diubah!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["maintenanceRecord"] });
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
