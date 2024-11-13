import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FormData } from "../../../components/rentalHistory/createRentalhistory/createRentalHistory";

export const useCreateRentalHistory = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const currentTime = new Date().toTimeString().split(" ")[0];
      const rentalStart = new Date(`${formData.rentalStartDate}T${currentTime}`).toISOString();
      const rentalEnd = new Date(`${formData.rentalEndDate}T${currentTime}`).toISOString();
      const payload = { ...formData, rentalStartDate: rentalStart, rentalEndDate: rentalEnd };

      await axios.post("/RentalHistory", payload, { headers: { "Content-Type": "application/json" } });
    },
    onSuccess: () => {
      toast.success("Data berhasil ditambahkan!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["rentalHistories"] });
      navigate("/admin/list-rental-history");
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
