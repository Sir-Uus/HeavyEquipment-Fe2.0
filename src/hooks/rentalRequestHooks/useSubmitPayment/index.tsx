import { useMutation } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";

export const useSubmitPayment = () => {
  return useMutation({
    mutationFn: async ({ rentalRequestId, amount }: { rentalRequestId: number; amount: number }) => {
      const payload = {
        rentalRequestId,
        amount,
        paymentMethod: "Scan",
        PaymentStatus: "Pending",
      };

      const response = await axios.post("/Payment", payload);
      return response.data;
    },
    onSuccess: () => {
      console.log("success submiting payment ");
    },
    onError: () => {
      toast.error("Failed to submit payment!", { position: "bottom-right" });
    },
  });
};
