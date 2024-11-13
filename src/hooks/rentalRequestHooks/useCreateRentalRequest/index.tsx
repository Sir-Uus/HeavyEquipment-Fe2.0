import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FormData } from "../../../components/rentalRequest/createRentalRequest/createRentalRequest";

export const useCreateRentalRequest = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const starDate = new Date(formData.starDate).toISOString();
      const endDate = new Date(formData.endDate).toISOString();
      const payload = { ...formData, starDate: starDate, endDate: endDate };

      await axios.post("/RentalRequest", payload, { headers: { "Content-Type": "application/json" } });
    },
    onSuccess: () => {
      toast.success("Data berhasil ditambahkan!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["rentalHistories"] });
      navigate("/admin/list-rental-request");
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
