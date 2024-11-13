import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserOptions } from "../../../hooks/PerformancedFeedbackHooks/useUserOption";
import { useEquipmentOptions } from "../../../hooks/PerformancedFeedbackHooks/useEquipmentOption";
import { useCreateFeedbacks } from "../../../hooks/PerformancedFeedbackHooks/useCreatePerformancedFeedback";
import { useNavigate } from "react-router-dom";
import { MenuItem, TextField } from "@mui/material";
import Modal from "../../modal/modal";

const schema = z.object({
  equipmentId: z.number().positive(),
  userId: z.string().nonempty(),
  feedbackDate: z.string().nonempty(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(1, "Comment is required"),
});

export type FormData = z.infer<typeof schema>;

const CreatePerformancedFeedback: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const navigate = useNavigate();

  const { data: equipmentOptions = [] } = useEquipmentOptions();
  const { data: userOptions = [] } = useUserOptions();
  const createPerformancedFeedback = useCreateFeedbacks();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);

  const onSubmit = (data: FormData) => {
    setFormData(data);
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    if (formData) {
      createPerformancedFeedback.mutate(formData);
      reset();
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Performance Feedback</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              select
              label="Equipment"
              defaultValue={""}
              id="equipmentId"
              {...register("equipmentId", { valueAsNumber: true })}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Equipment</MenuItem>
              {equipmentOptions.map((equipment: any) => (
                <MenuItem key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </MenuItem>
              ))}
            </TextField>
            {errors.equipmentId && <p className="text-red-600">{String(errors.equipmentId.message)}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              select
              label="User"
              defaultValue={""}
              id="userId"
              {...register("userId")}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select User</MenuItem>
              {userOptions.map((user: any) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.displayName}
                </MenuItem>
              ))}
            </TextField>
            {errors.userId && <p className="text-red-600">{String(errors.userId.message)}</p>}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="w-1/2">
            <TextField
              label="FeedbackDate"
              id="feedbackDate"
              type="date"
              {...register("feedbackDate")}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            />
            {errors.feedbackDate && <p className="text-red-600">{String(errors.feedbackDate.message)}</p>}
          </div>
          <div className="w-1/2">
            <TextField
              select
              label="Rating"
              defaultValue={""}
              id="rating"
              {...register("rating", { valueAsNumber: true })}
              slotProps={{ inputLabel: { shrink: true } }}
              className="mt-1 p-2 block w-full border border-gray-900 rounded-md shadow-sm"
            >
              <MenuItem value="">Select Rating</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </TextField>
            {errors.rating && <p className="text-red-600">{String(errors.rating.message)}</p>}
          </div>
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
          {errors.comment && <p className="text-red-600">{String(errors.comment.message)}</p>}
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
            <span className="material-icons text-gray-900">info</span>Confirm Create
          </h2>
          <p className="text-gray-900 text-center mt-8 font-semibold">
            Are you sure you want to create this Feedback?
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

export default CreatePerformancedFeedback;
