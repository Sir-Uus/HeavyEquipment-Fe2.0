// hooks/rentalRequestHooks/useCreateRentalRequest.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { FormData } from "../../../components/makeRentalRequest/makeRentalRequest";

export const useMakeRentalRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const payload = {
        ...formData,
        starDate: new Date(formData.starDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      const response = await axios.post("/RentalRequest", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Rental request successfully created!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["rentalRequests"] }); 
    },
    onError: () => {
      toast.error("Failed to create rental request!", { position: "bottom-right" });
    },
  });
};
