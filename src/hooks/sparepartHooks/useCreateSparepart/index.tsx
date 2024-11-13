import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FormData } from "../../../components/sparePart/createSparePart/createSparePart";

export const useCreateSparePart = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const payload = { ...formData };

      await axios.post("/SparePart", payload, { headers: { "Content-Type": "application/json" } });
    },
    onSuccess: () => {
      toast.success("Data berhasil ditambahkan!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["sparePart"] });
      navigate("/admin/list-sparepart");
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
