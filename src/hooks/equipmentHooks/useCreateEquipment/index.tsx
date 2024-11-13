import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FormData } from "../../../components/equipment/createEquipment/createEquipment";

export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const payload = {
        ...formData,
      };

      await axios.post("/Equipment", payload, { headers: { "Content-Type": "application/json" } });
    },
    onSuccess: () => {
      toast.success("Data berhasil ditambahkan!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["equipment"] });
      navigate("/admin/list-equipment");
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
