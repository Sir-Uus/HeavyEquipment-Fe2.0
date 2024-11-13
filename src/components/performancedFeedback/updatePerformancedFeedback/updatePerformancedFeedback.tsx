import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useFetchPerformanceFeedback,
  useUpdatePerformancedFeedback,
} from "../../../hooks/PerformancedFeedbackHooks/useUpdateFeedback";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  equipmentId: z.number().positive(),
  userId: z.string().nonempty(),
  feedbackDate: z.string().nonempty(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
});

type FormData = z.infer<typeof schema>;

const UpdatePerformanceFeedback = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const { data, isLoading, isError } = useFetchPerformanceFeedback(id!);
  const updateMutation = useUpdatePerformancedFeedback();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (data) {
      setValue("equipmentId", data.equipmentId);
      setValue("userId", data.userId);
      setValue("feedbackDate", data.feedbackDate.split("T")[0]);
      setValue("rating", data.rating);
      setValue("comment", data.comment);
    }
  }, [data, setValue]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading rental request</div>;

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (formData) {
      const currentTime = new Date().toTimeString().split(" ")[0];
      const feedbackDateTime = new Date(`${formData.feedbackDate}T${currentTime}`).toISOString();
      const payload = {
        ...formData,
        feedbackDate: feedbackDateTime,
      };

      await updateMutation.mutateAsync({ id: id!, payload });
      navigate("/admin/list-feedback");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Feedback</h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <TextField
            label="Feedback Date"
            type="date"
            id="feedbackDate"
            {...register("feedbackDate")}
            slotProps={{ inputLabel: { shrink: true } }}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
          />
          {errors.feedbackDate && <p className="text-red-500 text-sm">{errors.feedbackDate.message}</p>}
        </div>
        <div>
          <TextField
            select
            label="Rating"
            id="rating"
            {...register("rating", { valueAsNumber: true })}
            slotProps={{ inputLabel: { shrink: true } }}
            value={data ? data.rating : ""}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </TextField>
          {errors.rating && <p className="text-red-500 text-sm">{errors.rating.message}</p>}
        </div>
        <div>
          <TextField
            label="Comment"
            multiline
            id="comment"
            {...register("comment")}
            slotProps={{ inputLabel: { shrink: true } }}
            className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            rows={3}
          />
          {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            className="px-4 py-2 bg-gray-500 text-white rounded-md shadow-sm transition duration-300 ease-in hover:bg-gray-600"
            onClick={() => navigate("/admin/list-feedback")}
          >
            <div className="flex gap-2">
              <span className="material-icons text-[18px] mt-[3px]">exit_to_app</span>Cancel
            </div>
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-yellow-400 text-white transition duration-300 ease-in hover:bg-yellow-500 rounded-md shadow-sm"
          >
            <div className="flex gap-2">
              <span className="material-icons text-[18px] mt-[3px]">check_circle</span>Submit
            </div>
          </button>
        </div>
      </form>
      <Modal isOpen={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <div className="flex flex-col items-center justify-center transform transition-all duration-500 ease-out animate-fade-in-up">
          <h2 className="flex gap-2 font-semibold">
            <span className="material-icons text-gray-900">info</span>Confirm Update
          </h2>
          <p className="text-gray-900 text-center mt-8 font-semibold">
            Are you sure you want to update this Feedback?
          </p>
        </div>
        <button
          className="px-4 py-2 mt-8 w-full bg-yellow-400 text-white transition duration-300 ease-in hover:bg-yellow-500 rounded-md"
          onClick={handleConfirm}
        >
          <div className="flex gap-2 justify-center text-gray-900 font-semibold">
            <span className="material-icons text-[18px] mt-[3px]">check_circle</span>Confirm
          </div>
        </button>
      </Modal>
    </div>
  );
};

export default UpdatePerformanceFeedback;
