import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FormData } from "../../../components/performancedFeedback/createPerformanceFeedback/createFeedback";

export const useCreateFeedbacks = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const currentTime = new Date().toTimeString().split(" ")[0];
      const feedbackDateTime = new Date(`${formData.feedbackDate}T${currentTime}`).toISOString();
      const payload = { ...formData, feedbackDate: feedbackDateTime };

      await axios.post("/Feedbacks", payload, { headers: { "Content-Type": "application/json" } });
    },
    onSuccess: () => {
      toast.success("Data berhasil ditambahkan!", { position: "bottom-right" });
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
      navigate("/admin/list-feedback");
    },
    onError: () => {
      toast.error("Gagal menambahkan data!", { position: "bottom-right" });
    },
  });
};
