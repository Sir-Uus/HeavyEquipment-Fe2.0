import { useState } from "react";
import Modal from "../modal/modal";
import { useFetchSparePartFeedbacks } from "../../hooks/PerformancedFeedbackHooks/useFeedback";
import { useSubmitSparePartFeedback } from "../../hooks/PerformancedFeedbackHooks/submitFeedback";
import { Star } from "../star/star";

interface SparePartFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sparepartId: string;
}

const SparePartFeedbackModal: React.FC<SparePartFeedbackModalProps> = ({ isOpen, onClose, sparepartId }) => {
  const [comment, setComment] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [showError, setShowError] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(4);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const { data, isLoading } = useFetchSparePartFeedbacks(sparepartId, isOpen);
  const { feedbacks = [], userMap = new Map() } = data || {};
  const submitFeedbackMutation = useSubmitSparePartFeedback(sparepartId);

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
      sparepartId: sparepartId,
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
        <div className={`space-y-4 ${needsScroll ? "max-h-52 overflow-y-auto" : ""}`}>
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
                <p className="text-sm text-gray-400">{feedback.feedbackDate}</p>
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

      <div className="mt-4">
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Write your feedback here..."
          className="w-full p-2 border border-gray-300 rounded-lg"
          rows={3}
        />
        <button
          onClick={handleSubmit}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </Modal>
  );
};

export default SparePartFeedbackModal;
