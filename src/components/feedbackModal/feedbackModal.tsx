import { useState } from "react";
import Modal from "../modal/modal";
import { useFetchFeedbacks } from "../../hooks/PerformancedFeedbackHooks/useFeedback";
import { useSubmitFeedback } from "../../hooks/PerformancedFeedbackHooks/submitFeedback";
import { Star } from "../star/star";
import { formatDate2 } from "../../utils";
import { TextField } from "@mui/material";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId: string;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, equipmentId }) => {
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(4);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const { data, isLoading } = useFetchFeedbacks(equipmentId, isOpen);
  const { feedbacks = [], userMap = new Map() } = data || {};
  const submitFeedbackMutation = useSubmitFeedback(equipmentId);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("id");
    const feedbackDate = new Date().toISOString();
    const payload = {
      equipmentId: equipmentId,
      comment: comment,
      userId: userId,
      feedbackDate: feedbackDate,
      rating: rating,
    };

    setSubmitting(true);
    setError("");

    submitFeedbackMutation.mutate(payload, {
      onSuccess: () => {
        setComment("");
        setRating(0);
      },
      onError: (error: any) => {
        if (error.response && error.response.status === 401) {
          setError("You have to login or register first before submitting feedback.");
          setShowError(true);

          setTimeout(() => {
            setShowError(false);
            setTimeout(() => setError(""), 500);
          }, 2000);
        }
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  const handleCloseError = () => {
    setShowError(false);
    setTimeout(() => setError(""), 500);
  };

  const needsScroll = feedbacks.length > 1;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-xl font-bold mb-4">Feedback</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className={`space-y-4 ${needsScroll ? "max-h-36 overflow-y-auto" : ""}`}>
          {feedbacks.length === 0 ? (
            <p>No feedbacks available.</p>
          ) : (
            feedbacks.map((feedback: any, index: any) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg">
                <p className="font-semibold flex items-center">
                  <span className="material-icons mr-2">account_circle</span>
                  {userMap.get(feedback.userId) || "..loading"}
                </p>
                <p className="text-gray-600">{feedback.comment}</p>
                <p className="text-sm text-gray-400">{formatDate2(feedback.feedbackDate)}</p>
              </div>
            ))
          )}
        </div>
      )}

      {error && (
        <div className={`relative transition-all duration-500 ${showError ? "fade-in" : "fade-out"}`}>
          <p className="flex items-center text-gray-900 bg-red-300 rounded-lg p-2 mt-2">
            {error}
            <span className="material-icons ml-auto cursor-pointer" onClick={handleCloseError}>
              close
            </span>
          </p>
        </div>
      )}

      <div className="flex items-center space-x-2 mt-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            star={star}
            rating={rating}
            hoverRating={hoverRating}
            setRating={handleRatingChange}
            setHoverRating={setHoverRating}
          />
        ))}
      </div>

      <div className="flex mt-2">
        <TextField
          multiline
          size="small"
          value={comment}
          onChange={handleCommentChange}
          placeholder="Write your feedback here..."
          className="w-full border border-gray-300"
          rows={1}
        />
        <button
          onClick={handleSubmit}
          className="px-4 p-2 bg-yellow-400 text-black  transition duration-300 ease-in hover:bg-yellow-300 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
