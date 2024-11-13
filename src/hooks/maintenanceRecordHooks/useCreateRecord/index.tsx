import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FormData } from "../../../components/maintenanceRecord/createRecord/createRecord";

export const useCreateMaintenanceRecord = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["createRecord"],
    mutationFn: async (formData: FormData) => {
      const currentTime = new Date().toTimeString().split(" ")[0];
      const maintenanceDateTime = new Date(`${formData.maintenanceDate}T${currentTime}`).toISOString();
      const nextMaintenanceDueDateTime = new Date(
        `${formData.nextMaintenanceDue}T${currentTime}`
      ).toISOString();
      const payload = {
        ...formData,
        maintenanceDate: maintenanceDateTime,
        nextMaintenanceDue: nextMaintenanceDueDateTime,
      };

      await axios.post("/MaintenanceRecord", payload, { headers: { "Content-Type": "application/json" } });
    },
    onSuccess: () => {
      toast.success("Data berhasil ditambahkan!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["maintenanceRecord"] });
      navigate("/admin/list-maintenance-record");
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
